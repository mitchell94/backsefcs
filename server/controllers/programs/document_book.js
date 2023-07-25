const Sequelize = require('sequelize');
const message = require('../../messages');

const Op = Sequelize.Op;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const abox = require('../Abox');
const {promises: fs} = require("fs");
const {URL_PLUBLIC} = require("../Abox");
const Model = require('../../models').Document_book;
const Payment = require('../../models').Payment;
const Student = require('../../models').Student;
const Program = require('../../models').Programs;
const Person = require('../../models').Person;
const Academic_semester = require('../../models').Academic_semester;
const Academic_calendar = require('../../models').Academic_calendar;
const Concept = require('../../models').Concept;
const ST = Model.sequelize;

const url_document_book = URL_PLUBLIC + 'person/studentDocument/';
module.exports = {


    listDocumentPayment: async (req, res) => {
        try {
            let records;

            await ST.transaction(async (t) => {

                let data = await Payment.findAll({
                    where: {
                        type: 'Pagado',
                        generate: 1//concepto que si genera correlativo
                    },
                    include: [
                        {
                            attributes: ['denomination', 'description'],
                            model: Program,
                            as: "Program",

                        },
                        {
                            attributes: ['denomination'],
                            model: Academic_semester,
                            as: "Academic_semester",
                            include: {
                                attributes: ['denomination'],
                                model: Academic_calendar,
                                as: "Academic_calendar",

                            }
                        },
                        {
                            // attributes: ['state'],
                            model: Student,
                            as: 'Student',
                            include: {
                                attributes: ['document_number', 'email', [Fn('CONCAT', Col('paternal'), ' ', Col('maternal'), ' ', Col('name')), 'name']],
                                model: Person,
                                as: "Person"
                            }
                        }
                    ]


                }, {transaction: t})

                records = data
            });

            // In this case, an instance of Model

            res.status(200).send(records)
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err)
            res.status(445).send(err)
        }
    },
    listDocumentBook: async (req, res) => {
        try {
            let records;

            await ST.transaction(async (t) => {

                let data = await Model.findAll({
                    required: true,
                    where: {
                        id_academic_calendar: req.params.id
                    },
                    attributes: ['id', 'id_student', 'type', 'correlative', 'observation', 'created_at', 'file', 'state_upload'],
                    include: [
                        {
                            attributes: ['denomination', 'description'],
                            model: Program, as: "Program",
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Concept, as: "Concept",
                        },
                        {

                            attributes: ['denomination'],
                            model: Academic_calendar, as: "Academic_calendar",
                        },
                        {
                            required: true,
                            attributes: ['id'],
                            model: Student, as: 'Student',
                            include: {
                                attributes: ['document_number', 'email', [Fn('CONCAT', Col('paternal'), ' ', Col('maternal'), ' ', Col('name')), 'name']],
                                model: Person,
                                as: "Person"
                            }
                        }
                    ]


                }, {transaction: t})

                records = data
            });

            // In this case, an instance of Model

            res.status(200).send(records)
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err)
            res.status(445).send(err)
        }
    },
    uploadDocumentBook: async (req, res) => {
        let archive = "";
        let tmp_path = "";
        try {
            archive = req.body.file_name + '.' + req.files.file.name.split('.').pop();
            tmp_path = req.files.file.path;
            let target_path = url_document_book + archive;

            // delete temp file
            await fs.copyFile(tmp_path, target_path);
            await fs.unlink(tmp_path);
        } catch (e) {
            await fs.unlink(tmp_path);
            res.status(444).send(e)
        }

        try {
            await ST.transaction(async (t) => {
                let data = await Model.findByPk(req.params.id);
                await data.update({
                    file: archive,
                    state_upload: true
                }, {transaction: t});
            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {

            console.log(err);
            res.status(445).send(err)
        }

    },
    createDocumentBook: async (req, res) => {
        try {
            let records;

            await ST.transaction(async (t) => {
                // let documentBook = await Model.findByPk(req.params.id_payment);
                //BUSCAMOS SI EXISTE UN REGISTRO CON EL ID_PAYMENT
                let documentBook = await Model.findOne({where: {id_payment: req.body.id_payment}}, {transaction: t});
                if (documentBook) throw {message: "Ya se ha generado un correlativo para ese documento"};
                //BUSCAMOS EL ID DEL CALENDARIO ACADEMICO CON ESTADO ACTUAL
                let academicCalendar = await Academic_calendar.findOne({where: {state: true}}, {transaction: t});
                //BUSCAMOS LOS DEMAS DATOS PARA REGISTRARLOS EN DOCUMENT_BOOK
                let payment = await Payment.findByPk(req.body.id_payment);
                //ACTUALIZAMOS EL GENERADO
                payment.update({generate: 2}, {transaction: t});
                //COGEMOS EL ULTIMO REGISTRO SEGUN EL ID CONCEPT
                 let documentBookDigi = await Model.max('correlative', {
                    where: {
                        id_concept: payment.id_concept,
                        id_academic_calendar: academicCalendar.id
                    }
                }, {transaction: t}) || '0001';
                let digi = await abox.zeroPad(parseInt(documentBookDigi) + 1, 4);

                let max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    id_payment: payment.id,
                    id_academic_calendar: academicCalendar.id,
                    id_concept: payment.id_concept,
                    id_student: payment.id_student,
                    id_program: payment.id_program,
                    correlative: digi,
                    type: ''
                }, {transaction: t});
            });

            // In this case, an instance of Model

            res.status(200).send(message.REGISTERED_OK)
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err)
            res.status(445).send(err)
        }
    },
    updateDocumentBook: async (req, res) => {
        try {


            await ST.transaction(async (t) => {
                //BUSCAMOS LOS DATOS DEL DOCUMENTO
                let data = await Model.findByPk(req.params.id);
                //BUSCAMOS SI YA EXISTE ESE CORRELATIVO
                let digi = await abox.zeroPad(parseInt(req.body.correlative), 4);
                let data2 = await Model.findOne({
                    where: {
                        correlative: digi,
                        id_academic_calendar: data.id_academic_calendar,
                        id_concept: data.id_concept
                    }
                }, {transaction: t});
                if (digi != '0000') {
                    if (data2) throw {message: "Ya existe ese correlativo"};
                }


                await data.update({
                    correlative: digi,
                    observation: req.body.observation || null
                }, {transaction: t});
            });

            // In this case, an instance of Model

            res.status(200).send(message.UPDATED_OK)
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err)
            res.status(445).send(err)
        }
    }

};
