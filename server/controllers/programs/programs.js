const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;

const fs = require('fs').promises;
const Model = require('../../models').Programs;
const ST = Model.sequelize;
const Organic_unit = require('../../models').Organic_unit;
const Concepts = require('../../models').Concepts;

const Academic_degree = require('../../models').Academic_degree;
const Document = require('../../models').Document;
const Document_type = require('../../models').Document_type;
const Plan = require('../../models').Plan;
const Ciclo = require('../../models').Ciclo;
const Cost = require('../../models').Cost;
const Course = require('../../models').Course;
const Campus = require('../../models').Campus;
const Program_document = require('../../models').Program_document;
const Work_plan = require('../../models').Work_plan;
const Concept = require('../../models').Concept;
const Category_concept = require('../../models').Category_concept;
const Entry = require('../../models').Entry;
const Admission_plan = require('../../models').Admission_plan;
const URL_PLUBLIC = require("../Abox").URL_PLUBLIC;
const url_documents = URL_PLUBLIC + 'program/';
module.exports = {
    /*
   * Modulo=>programas
   * lista los programas para el modal crud
   * */

    async listDocumentProgramByProgramID(req, res) {


        try {
            let records = await Model.findOne({
                    attributes: ['id', 'id_unit_organic_register', 'denomination', 'state'],
                    where: {id: req.params.id_program},
                    include: {
                        attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                        model: Program_document,
                        as: "Program_documents",
                        include: {
                            required: true,
                            attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                            model: Document,
                            as: "Document",
                            include: [
                                {
                                    attributes: ['denomination'],
                                    model: Document_type,
                                    as: "Document_type"
                                },
                                {
                                    attributes: ['denomination'],
                                    model: Organic_unit,
                                    as: "Organic_unit"
                                }
                            ]
                        }
                    },

                    // order: [[{model: Plan, as: 'Plans'}, 'created_at', 'desc']],
                },
            )
            res.status(200).send(records)
        } catch (e) {

            res.status(444).send(e)
        }

    },

    createProgram: function (req, res) {
        return Model
            .max('id', {paranoid: false})
            .then(max => {
                return Model
                    .create({
                        id: max + 1,
                        id_unit_organic_register: req.body.id_unit_organic_register,
                        id_unit_organic_origin: req.body.id_unit_organic_origin,
                        id_academic_degree: req.body.id_academic_degree,
                        code: req.body.code,
                        denomination: req.body.denomination,
                        description: req.body.description,
                    })
                    .then(() => {
                        res.status(200).send({
                            message: message.REGISTERED_OK
                        });
                    })
                    .catch(error => res.status(400).send(error))
            })
            .catch(error => res.status(444).send(error))
    },
    createProgramDocument: async (req, res) => {
        let archive;
        let tmp_path;
        try {
            if (req.body.exists === 'si') {
                archive = req.body.archive + '.' + req.files.file.name.split('.').pop();
                tmp_path = req.files.file.path;
                let target_path = url_documents + archive;
                await fs.rename(tmp_path, target_path);
            } else {
                archive = null;
            }
        } catch (e) {
            await fs.unlink(tmp_path);
            res.status(444).send(e)
        }
        try {
            await ST.transaction(async (t) => {
                let max = await Document.max('id', {paranoid: false}, {transaction: t});
                let document = await Document.create({
                    id: max + 1,
                    id_parent: req.body.id_parent || null,
                    id_document_type: req.body.id_document_type,
                    id_unit_organic: req.body.id_unit_organic,
                    topic: req.body.topic,
                    archive: archive,
                }, {transaction: t});

                let maxPD = await Document.max('id', {paranoid: false}, {transaction: t});
                await Program_document.create({
                    id: maxPD + 1,
                    id_program: req.body.id_program,
                    id_document: document.id,
                }, {transaction: t})

            });
            res.status(200).send(message.REGISTERED_OK)
        } catch (e) {

            console.log(e)
            res.status(444).send(e)
        }

    },
    updateOnlineProgram: async (req, res) => {
        try {
            await ST.transaction(async (t) => {
                let program = await Model.findByPk(req.params.id);
                if (program) {
                    // await program.update({online: !program.online}, {transaction: t});
                }
            });
            res.status(200).send({message: message.UPDATED_OK});
        } catch (e) {
            res.status(400).send(e)
        }

    },
    listProgram: function (req, res) {
        return Model
            .findAll({attributes: ['id', 'id_unit_organic_register', 'denomination', 'state']})
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    updateProgram: function (req, res) {
        return Model
            .findOne({
                where: {
                    id: {
                        [Op.eq]: req.params.id
                    }
                }
            })
            .then(record => {
                if (!record) return res.status(404).send({message: message.RECORD_NOT_FOUND});
                return record
                    .update({
                        id_unit_organic_register: req.body.id_unit_organic_register || record.id_unit_organic_register,
                        id_unit_organic_origin: req.body.id_unit_organic_origin || record.id_unit_organic_origin,
                        id_academic_degree: req.body.id_academic_degree || record.id_academic_degree,
                        id_academic_period: req.body.id_academic_period || record.id_academic_period,
                        cant_period: req.body.cant_period || record.cant_period,
                        code: req.body.code || record.code,
                        denomination: req.body.denomination || record.denomination,
                        description: req.body.description || record.description,
                        credit_required: req.body.credit_required || record.credit_required,
                        credit_elective: req.body.credit_elective || record.credit_elective,
                    })
                    .then(updated => {
                        res.status(200).send({
                            message: message.UPDATED_OK,
                            record: updated
                        });
                    })
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },
    destroy: function (req, res) {
        return Model
            .findOne({
                where: {
                    id: {
                        [Op.eq]: req.params.id
                    }
                }
            })
            .then(record => {
                if (!record) return res.status(404).send({message: message.RECORD_NOT_FOUND});
                return record
                    .update({
                        state: !record.state,
                        // online: false,
                    })
                    .then(updated => {
                        res.status(200).send({
                            message: message.UPDATED_OK,
                            record: updated
                        });
                    })
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },
    destroyProgramDocument: async (req, res) => {
        try {
            let programDocument = await Program_document.findByPk(req.params.id);
            if (!programDocument) {
                res.status(404).send({message: message.RECORD_NOT_FOUND})
            }
            await programDocument.destroy();

            let document = await Document.findByPk(programDocument.id_document);
            if (!document) {
                res.status(404).send({message: message.RECORD_NOT_FOUND})
            }
            await document.destroy();

            res.status(200).send(programDocument);
        } catch (e) {
            res.status(400).send(e)
        }

    },
    async listProgramIDPlan(req, res) {


        try {
            let records = await Model.findOne({
                    attributes: ['id', 'id_unit_organic_register', 'denomination', 'state'],
                    where: {id: req.params.id},
                    include: {
                        required: false,
                        where: {state: true},
                        model: Plan,
                        as: "Plans"
                    },

                    order: [[{model: Plan, as: 'Plans'}, 'created_at', 'desc']],
                },
            )
            res.status(200).send(records)
        } catch (e) {

            res.status(444).send(e)
        }

    },

    listProgramReport: async (req, res) => {
        try {
            let records = await Model.findAll({
                attributes: ['id', 'description']
            });
            res.status(200).send(records)
        } catch (e) {
            res.status(444).send(e)
        }
    },

    listProgramDetail: async (req, res) => {
        //id_unit_organic_origin   unidad que crea la resolucion  y el plan
        //id_unit_organic_register unidad que esta a cargo
        try {
            let records = await Model.findOne({
                attributes: ['id', 'id_unit_organic_register', 'id_unit_organic_origin', 'id_academic_degree', 'denomination', 'description'],
                where: {
                    id: req.params.id,
                    // online: true,
                    state: true
                },
                include: [
                    {
                        attributes: ['denomination'],
                        model: Organic_unit,
                        as: "Organic_unit_origin"
                    },
                    {
                        attributes: ['id', 'denomination', 'abbreviation'],
                        where: {state: true},
                        model: Academic_degree,
                        as: "Academic_degree"
                    },
                    //PLAN DE ESTUDIOS
                    {
                        attributes: ['id', 'description', 'credit_required', 'credit_elective'],
                        where: {valid: true},
                        model: Plan,
                        as: "Plan",
                        include: [
                            {
                                attributes: ['id', 'ciclo', 'period'],
                                where: {state: true},
                                required: false,
                                model: Ciclo,
                                as: "Ciclos",
                                include: {
                                    attributes: ['denomination'],
                                    where: {state: true},
                                    required: false,
                                    model: Course,
                                    as: "Course"
                                }
                            },

                        ]
                    },
                    //PLAN DE ADMISION
                    {
                        attributes: ['id', 'number_student', 'date_start', 'date_end'],
                        model: Admission_plan,
                        as: "Admission_plan"
                    }

                ]
            });
            res.status(200).send(records)
        } catch (e) {

            res.status(444).send(e)
        }

    },


    listProgramByOrganicUnitRegisterID: function (req, res) {
        return Model
            .findAll({

                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {
                    id_unit_organic_register: req.params.id,
                    state: true
                },
                include: [
                    {
                        attributes: ['denomination'],
                        model: Organic_unit,
                        as: "Organic_unit_origin"
                    },
                    {
                        attributes: ['denomination'],
                        model: Organic_unit,
                        as: "Organic_unit_register",
                        include: {
                            attributes: ['denomination'],
                            model: Campus,
                            as: "Campu"
                        }
                    },
                    {
                        attributes: ['denomination', 'abbreviation'],
                        model: Academic_degree,
                        as: "Academic_degree"
                    },

                ],
                order: [
                    ['created_at', 'ASC']
                ]
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    async listProgramGOD(req, res) {
        try {
            let records = await Model.findAll({
                where: {state: true},
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                include: [
                    {
                        attributes: ['denomination'],
                        model: Organic_unit,
                        as: "Organic_unit_origin"
                    },
                    {
                        attributes: ['denomination'],
                        model: Organic_unit,
                        as: "Organic_unit_register",
                        include: {
                            attributes: ['denomination'],
                            model: Campus,
                            as: "Campu"
                        }
                    },
                    {
                        attributes: ['denomination', 'abbreviation'],
                        model: Academic_degree,
                        as: "Academic_degree"
                    },

                ],
                order: [
                    ['created_at', 'ASC']
                ]

            });
            res.status(200).send(records)
        } catch (e) {

            res.status(444).send(e)
        }

    },

    async listSimpleProgramGOD(req, res) {
        try {
            let records = await Model.findAll({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                order: [
                    ['created_at', 'ASC']
                ]
            });
            res.status(200).send(records)
        } catch (e) {

            res.status(444).send(e)
        }

    },
    async listSimpleProgramByOrganicUnitRegisterID(req, res) {
        try {
            let records = await Model.findAll({
                attributes: ["id", "denomination"],
                where: {
                    id_unit_organic_register: req.params.id
                },
                include: [
                    {
                        attributes: ['denomination'],
                        model: Organic_unit,
                        as: "Organic_unit_register",
                        include: {
                            attributes: ['denomination'],
                            model: Campus,
                            as: "Campu"
                        }
                    },
                    {
                        attributes: ['denomination'],
                        model: Organic_unit,
                        as: "Organic_unit_origin"
                    },
                ],
                order: [
                    ['created_at', 'ASC']
                ]
            });
            res.status(200).send(records)
        } catch (e) {

            res.status(444).send(e)
        }

    },
};
