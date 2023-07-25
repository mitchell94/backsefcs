const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Admission_plan;
const Academic_semester = require('../../models').Academic_semester;
const Academic_calendar = require('../../models').Academic_calendar;
const Cost_admission_plan = require('../../models').Cost_admission_plan;
const Organic_unit = require('../../models').Organic_unit;
const Plan = require('../../models').Plan;
const Programs = require('../../models').Programs;
const Concept = require('../../models').Concept;
const Campus = require('../../models').Campus;

const ST = Model.sequelize;
const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
module.exports = {
    async listAdmissionPlanByProgram(req, res) {
        try {
            let records = await Model.findAll({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id_program: req.params.id_program},
                include: [
                    {
                        attributes: ['description'],
                        model: Plan,
                        as: "Plan"
                    },
                    {
                        attributes: ['id', 'id_academic_calendar', 'denomination'],
                        model: Academic_semester,
                        as: "Process",
                        include: {
                            attributes: ['denomination'],
                            model: Academic_calendar, as: "Academic_calendar"
                        }
                    },
                ]
                // attributes: ['id', 'denomination', 'type', 'state'],
                // order: [['denomination', 'asc']]
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async listAdmissionPlanByProgramIDReport(req, res) {
        try {
            let records = await Model.findAll({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id_program: req.params.id_program},
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    
    async listAdmissionPlanByProgramIDS(req, res) {
        try {
            let records = await Model.findAll({
                attributes: ['id', 'id_plan', 'id_process', 'description'],
                where: {id_program: req.params.id_program},
                include: [
                    {
                        attributes: ['description'],
                        model: Plan,
                        as: "Plan"
                    },
                    {
                        // where:{}
                        attributes: ['cant'],
                        model: Cost_admission_plan,
                        as: "Cost_admission_plan",
                        include: {
                            attributes: ['denomination'],
                            where: {denomination: {[Op.like]: '%' + "Matrícula" + '%'}},
                            model: Concept,
                            as: "Concept"
                        }
                    }
                ]
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    async listAdmissionPlanByID(req, res) {
        try {
            let records = await Model.findOne({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id: req.params.id},
                include: [
                    {
                        attributes: ['description'],
                        model: Plan,
                        as: "Plan"
                    },
                    {
                        attributes: ['denomination'],
                        model: Programs,
                        as: "Program"
                    },
                    {
                        attributes: ['denomination'],
                        model: Academic_semester,
                        as: "Process",
                        include: {
                            attributes: ['denomination'],
                            model: Academic_calendar,
                            as: "Academic_calendar"
                        }
                    }
                ]
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async retriveAdmissionPlanByID(req, res) {
        try {
            let records = await Model.findOne({

                    attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                    where: {
                        id: req.params.id_admission_plan
                    },
                    include: [
                        {
                            attributes: ['id'],
                            model: Programs,
                            as: "Program",
                            include: {
                                attributes: ['id', 'denomination'],
                                model: Organic_unit,
                                as: "Organic_unit_register",
                                include: {
                                    attributes: ['denomination'],
                                    model: Campus,
                                    as: "Campu"
                                }
                            }
                        },
                        {
                            attributes: ['id', 'description'],
                            model: Plan,
                            as: "Plan"
                        },


                    ]

                },
            );
            res.status(200).send(records)
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async listAdmissionPlanTotalProjectionByID(req, res) {
        let {entry, egressTeacher, egressAdministrative, egressComission, egressMaterial, AdmissionPlan} = "";
        let totalEntry = 0;
        let totalEgressTeacher = 0;
        let totalEgressAdministrative = 0;
        let totalEgressComission = 0;
        let totalEgressMaterial = 0;
        try {
            AdmissionPlan = await Model.findOne({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id: req.params.id}
            });


            entry = await Entry.findAll({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id_work_plan: req.params.id},
            });

            egressTeacher = await Egress_teacher.findAll({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id_work_plan: req.params.id},
            });

            egressAdministrative = await Egress_administrative.findAll({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id_work_plan: req.params.id},
            });
            egressComission = await Egress_comission.findAll({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id_work_plan: req.params.id},
            });
            egressMaterial = await Egress_material.findAll({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id_work_plan: req.params.id}
            });

            entry.map(r => {
                totalEntry = (r.cant * parseFloat(r.amount)) + totalEntry;
            });


            egressTeacher.map(r => {
                totalEgressTeacher = (r.cant * parseFloat(r.price_hour)) + totalEgressTeacher;
            });


            egressAdministrative.map(r => {
                totalEgressAdministrative = (r.number_month * parseFloat(r.amount)) + totalEgressAdministrative;
            });


            egressComission.map(r => {
                totalEgressComission = (r.number_month * parseFloat(r.amount)) + totalEgressComission;
            });

            egressMaterial.map(r => {
                totalEgressMaterial = (r.cant * parseFloat(r.amount)) + totalEgressMaterial;
            });

            res.status(200).send({

                totalEntry: totalEntry * AdmissionPlan.number_student,
                totalEgressTeacher: totalEgressTeacher,
                totalEgressAdministrative: totalEgressAdministrative,
                totalEgressComission: totalEgressComission,
                totalEgressMaterial: totalEgressMaterial
            })
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async createAdmissionPlan(req, res) {
        let record = [];
        try {
            await ST.transaction(async (t) => {
                let admissionPlan = await Model.findOne({
                    where: {
                        id_program: req.body.id_program,
                        id_plan: req.body.id_plan,
                        id_process: req.body.id_process,
                    }
                }, {transaction: t});
                if (admissionPlan) throw "Ya existen registros con ese proceso";
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                record = await Model.create({
                    id: max + 1,
                    id_program: req.body.id_program,
                    id_plan: req.body.id_plan,
                    id_process: req.body.id_process,
                    description: req.body.description,
                    number_student: req.body.number_student,
                    duration: req.body.duration,
                    start_class: req.body.start_class,
                    date_start: req.body.date_start,
                    date_end: req.body.date_end,
                }, {transaction: t});
            });
            res.status(200).send({id: record.id, message: message.REGISTERED_OK});
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err});
        }
    },
    async updateAdmissionPlan(req, res) {
        try {
            await ST.transaction(async (t) => {
                // let admissionPlan = await Model.findOne({
                //     where: {
                //
                //         id_plan: req.body.id_plan,
                //         id_process: req.body.id_process,
                //     }
                // }, {transaction: t});
                // if (admissionPlan) throw "Ya existen registros con ese proceso";
                let AdmissionPlan = await Model.findByPk(req.params.id);
                await AdmissionPlan.update({
                    id_plan: req.body.id_plan,
                    id_process: req.body.id_process,
                    description: req.body.description,
                    number_student: req.body.number_student,
                    duration: req.body.duration,
                    date_class: req.body.date_class,
                    date_start: req.body.date_start,
                    date_end: req.body.date_end
                }, {transaction: t});
            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async destroyAdmissionPlan(req, res) {
        try {
            let AdmissionPlan = await Model.findByPk(req.params.id);
            await AdmissionPlan.destroy();
            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
