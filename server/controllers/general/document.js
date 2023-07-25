const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const fs = require('fs').promises;
const Model = require('../../models').Document;
const ST = Model.sequelize;
const Document_type = require('../../models').Document_type;
const Program_document = require('../../models').Program_document;
const Student_document = require('../../models').Student_document;
const Registration_course = require('../../models').Registration_course;
const Registration = require('../../models').Registration;
const Student = require('../../models').Student;
const Payment = require('../../models').Payment;

const URL_PLUBLIC = require("../Abox").URL_PLUBLIC;
const url_document_program = URL_PLUBLIC + 'program/';
const url_document_student = URL_PLUBLIC + 'person/student/';
module.exports = {

    list: function (req, res) {
        return Model
            .findAll({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id_unit_organic: {[Op.eq]: req.params.id_unit_organic}}
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    async createDocument(req, res) {
        let archive;
        let tmp_path;
        let URL_DOC;
        if (req.body.tableName === "Program_document") {
            URL_DOC = url_document_program;
        }
        if (req.body.tableName === "Student_document") {
            URL_DOC = url_document_student;
        }
        if (req.body.tableName === "Student_document_retirement") {
            URL_DOC = url_document_student;
        }

        if (req.files.file) {
            try {

                archive = req.body.archive + '.' + req.files.file.name.split('.').pop();
                tmp_path = req.files.file.path;
                let target_path = URL_DOC + archive;
                await fs.rename(tmp_path, target_path);

            } catch (e) {
                await fs.unlink(tmp_path);
                res.status(444).send(e)
            }
        }
        try {
            await ST.transaction(async (t) => {

                let max = await Model.max('id', {paranoid: false}, {transaction: t});
                let document = await Model.create({
                    id: max + 1,
                    id_parent: req.body.id_parent || null,
                    id_document_type: req.body.id_document_type,
                    id_unit_organic: req.body.id_unit_organic,
                    topic: req.body.topic,
                    archive: archive,
                }, {transaction: t});

                if (req.body.tableName === "Program_document") {
                    let maxPD = await Program_document.max('id', {paranoid: false}, {transaction: t});
                    await Program_document.create({
                        id: maxPD + 1,
                        id_program: req.body.id_belogns,
                        id_document: document.id,
                    }, {transaction: t})
                }
                if (req.body.tableName === "Student_document") {
                    let maxPD = await Student_document.max('id', {paranoid: false}, {transaction: t});
                    await Student_document.create({
                        id: maxPD + 1,
                        id_student: req.body.id_belogns,
                        id_document: document.id,
                        note: req.body.note,
                    }, {transaction: t})
                }
                if (req.body.tableName === "Student_document_retirement") {
                    let maxPD = await Student_document.max('id', {paranoid: false}, {transaction: t});
                    await Student_document.create({
                        id: maxPD + 1,
                        id_student: req.body.id_belogns,
                        id_document: document.id,
                        id_registration: req.body.id_registration,
                        note: req.body.note,
                    }, {transaction: t});

                    //RETIRO TABLES (STUDENT / REGISTRATION / REGISTRATION_COURSE / PAYMENT)
                    let payment, registration, registrationCourse, student, updateRegistrationCourse = [];

                    registration = await Registration.findOne({where: {id: req.body.id_registration}}, {transaction: t});
                    if (!registration) throw "Matricula no encontrada";
                    await registration.update({state: "Retirado"}, {transaction: t});

                    registrationCourse = await Registration_course.findAll({where: {id_registration: req.body.id_registration}}, {transaction: t});
                    if (!registrationCourse) throw "Curso no encontrado";
                    for (let i = 0; i < registrationCourse.length; i++) {
                        if (registrationCourse[i].note === 0) {
                            let tempRegistrationCourse = await registrationCourse[i].update({
                                note: 0,
                                state: "Retirado"
                            }, {transaction: t});
                            updateRegistrationCourse.push(tempRegistrationCourse)
                        }

                    }
                    await Promise.all(updateRegistrationCourse)

                    payment = await Payment.findOne({where: {id: req.body.id_concept}}, {transaction: t});
                    if (!payment) throw "Concepto no encontrado";
                    await payment.update({state: true}, {transaction: t})


                    student = await Student.findOne({where: {id: req.body.id_belogns}}, {transaction: t});
                    if (!student) throw "Estudiante no encontrado";
                    await student.update({type: "Retirado"}, {transaction: t});

                }

            });
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (e) {

            console.log(e)
            res.status(444).send(e)
        }
    },
    async updateDocument(req, res) {
        let archive;
        let tmp_path;
        let URL_DOC;
        if (req.body.tableName === "Program_document") {
            URL_DOC = url_document_program;
        }
        if (req.body.tableName === "Student_document") {
            URL_DOC = url_document_student;
        }
        if (req.files.file) {
            try {
                archive = req.body.archive + '.' + req.files.file.name.split('.').pop();
                tmp_path = req.files.file.path;
                let target_path = URL_DOC + archive;
                await fs.rename(tmp_path, target_path);

            } catch (e) {
                await fs.unlink(tmp_path);
                res.status(444).send(e)
            }
        }
        try {
            await ST.transaction(async (t) => {
                let document = await Model.findOne({where: {id: req.params.id}});
                await document.update({
                    id_document_type: req.body.id_document_type,
                    id_unit_organic: req.body.id_unit_organic,
                    topic: req.body.topic,
                    archive: archive,
                }, {transaction: t});
                if (req.body.tableName === "Student_document") {
                    let StudentDocument = await Student_document.findByPk(req.body.id_student_document);
                    await StudentDocument.update({
                        note: req.body.note
                    }, {transaction: t});
                }
            });

            res.status(200).send({message: message.UPDATED_OK})
        } catch (e) {
            console.log(e)
            res.status(444).send(e)
        }
    },
    listCurriculum: function (req, res) {
        return Model
            .findOne({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id_unit_organic: {[Op.eq]: req.params.id_unit_organic}},
                include: {
                    attributes: ['id'],
                    where: {denomination: {[Op.or]: ['Curriculum', 'Currículum', 'curriculum', 'currículum', 'CURRICULUM', 'CURRÍCULUM']}},
                    model: Document_type,
                    as: 'Type'
                }
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },

    async destroyDocument(req, res) {
        try {
            let document = await Model.findByPk(req.params.id);
            await document.destroy();
            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }


};
