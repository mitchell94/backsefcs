const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Movement;
const Concepts = require('../../models').Concepts;
const Payment = require('../../models').Payment;
const Student = require('../../models').Student;
const Person = require('../../models').Person;
const Organic_unit = require('../../models').Organic_unit;
const Program = require('../../models').Programs;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const Literal = Sequelize.literal;
const fs = require('fs').promises;
const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
const ST = Model.sequelize;
const URL_PLUBLIC = require("../Abox").URL_PLUBLIC;
const url_person_voucher = URL_PLUBLIC + 'person/voucher/';
module.exports = {
    createMovement: async (req, res) => {
        let archive = "";
        let tmp_path = "";
        try {
            archive = req.body.id_student + '-' + req.body.voucher_code + '.' + req.files.file.name.split('.').pop();
            tmp_path = req.files.file.path;
            let target_path = url_person_voucher + archive;
            let movement = await Model.findOne({where: {voucher_code: req.body.voucher_code}});
            if (movement) {
                throw 'Error el comprobante ya ha sido registrado!!'
            } else {
                //copy file in new route
                await fs.copyFile(tmp_path, target_path);
            }
            // delete temp file
            await fs.unlink(tmp_path);
        } catch (e) {
            await fs.unlink(tmp_path);
            res.status(444).send(e)
        }

        try {


            await ST.transaction(async (t) => {
                let movement = await Model.findOne({where: {voucher_code: req.body.voucher_code}});
                if (movement) throw "Ya se ha registrado ese número de voucher";

                let maxMovementID = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: maxMovementID + 1,
                    id_student: req.body.id_student,
                    id_program: req.body.id_program,
                    id_organic_unit: req.body.id_organic_unit,
                    id_user: req.body.id_user,
                    denomination: req.body.denomination,
                    voucher_code: req.body.voucher_code,
                    voucher_amount: req.body.voucher_amount,
                    voucher_date: req.body.voucher_date,
                    voucher_url: archive,
                    observation: req.body.observation,
                    type: req.body.type,
                    state: req.body.state
                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (err) {

            console.log(err);
            res.status(445).send(err)
        }

    },
    listMovement: async (req, res) => {
        try {
            let record = await Model.findAll({
                where: {id_student: req.params.id_student},
                order: [['updated_at', 'asc']]
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    listMovementPendientByOrganicUnit: async (req, res) => {
        try {
            let record = await Model.findAll({
                attributes: {exclude: ['id_student', 'id_program', 'id_organic_unit', 'id_user']},
                where: {
                    id_organic_unit: req.params.id_organic_unit,
                    state: 'Registrado'
                },
                include: {
                    attributes: ['id'],
                    model: Student,
                    as: 'Student',
                    include: [
                        {
                            attributes: [[Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name'], 'document_number'],
                            model: Person, as: 'Person'
                        },
                        {
                            attributes: ['id', 'description'],
                            model: Program,
                            as: "Program"
                        },
                    ]
                }
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    searchVoucherStudent: async (req, res) => {
        try {
            let record = await Model.findAll({
                attributes: ['voucher_code', 'voucher_amount', 'voucher_date', 'voucher_url', 'observation', 'type', 'state', 'created_at', 'updated_at'],
                where: {voucher_code: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                include: [
                    {
                        attributes: ['state'],
                        model: Student,
                        as: 'Student',
                        include: {
                            attributes: ['document_number', 'email', [Fn('CONCAT', Col('paternal'), ' ', Col('maternal'), ' ', Col('name')), 'name']],
                            model: Person,
                            as: "Person"
                        },
                    },
                    {
                        attributes: ['description'],
                        model: Program,
                        as: 'Program'
                    },

                ]


            });

            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },

    updateMovement: async (req, res) => {
        let archive = "";
        let tmp_path;
        //existe un archivo
        if (req.files.file) {
            //pregunta busca el nombre del archivo
            let movementTemp = await Model.findByPk(req.params.id)
            const path = url_person_voucher + movementTemp.voucher_url;
            //ELIMINA VOUCHGER ANTIGUO
            try {
                await fs.unlink(path);
                //    lo eliminamos
            } catch (err) {
                console.error(err);
            }


            //REGISTRA NUEVO VOUHCER
            try {

                archive = req.body.id_student + '-' + movementTemp.voucher_code + '.' + req.files.file.name.split('.').pop();
                tmp_path = req.files.file.path;
                let target_path = url_person_voucher + archive;
                await fs.copyFile(tmp_path, target_path);
                await fs.unlink(tmp_path);
            } catch (e) {
                await fs.unlink(tmp_path);
                res.status(444).send(e)
            }
        }

        try {

            await ST.transaction(async (t) => {


                let movementTemp = await Model.findByPk(req.params.id)
                await movementTemp.update({
                    denomination: req.body.denomination,
                    voucher_amount: req.body.voucher_amount,
                    // MPT
                    voucher_code: req.body.voucher_code,
                    // MPT END
                    voucher_date: req.body.voucher_date,
                    voucher_url: archive !== '' ? archive : movementTemp.voucher_url,
                    observation: req.body.observation,
                    type: req.body.type,
                    state: req.body.state
                }, {transaction: t});


            });

            res.status(200).send(message.UPDATED_OK)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }


    },

    destroyMovement: async (req, res) => {
        try {

            await ST.transaction(async (t) => {


                let movementTemp = await Model.findByPk(req.params.id)
                if (movementTemp.state == 'Aceptado') {
                    throw "El comprobante tiene estado Aceptado. para eliminarlo debe estar con estado Registrado";
                }
                await movementTemp.destroy({transaction: t});
                // const path = url_person_voucher + movementTemp.voucher_url;

                // try {
                //     await fs.unlink(path);
                // } catch (err) {
                //    throw "Ocurrio un error al Eliminar comprobante, Por favor intentelo nuevamente";
                // }
            });

            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
