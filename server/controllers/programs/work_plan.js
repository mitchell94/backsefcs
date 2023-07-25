const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Work_plan;
const Academic_semester = require('../../models').Academic_semester;
const Academic_calendar = require('../../models').Academic_calendar;
const Plan = require('../../models').Plan;
const Programs = require('../../models').Programs;
const Entry = require('../../models').Entry;
const Egress_teacher = require('../../models').Egress_teacher;
const Egress_administrative = require('../../models').Egress_administrative;
const Egress_comission = require('../../models').Egress_comission;
const Egress_material = require('../../models').Egress_material;
const ST = Model.sequelize;
const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
module.exports = {
    async listWorkPlanByProgram(req, res) {
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
                        attributes: ['denomination'],
                        model: Academic_semester,
                        as: "Process",
                        include: {
                            attributes: ['denomination'],
                            model: Academic_calendar, as:
                                "Academic_calendar"
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
    async listWorkPlanByProgramIDS(req, res) {
        try {
            let records = await Model.findAll({
                attributes: ['id', 'description'],
                where: {id_program: req.params.id_program},
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async listWorkPlanByID(req, res) {
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
    async listOneWorkPlanByProgramIDWeb(req, res) {
        try {
            let records = await Model.findOne({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id_program: req.params.id_program},
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async listWorkPlanTotalProjectionByID(req, res) {
        let {entry, egressTeacher, egressAdministrative, egressComission, egressMaterial, workPlan} = "";
        let totalEntry = 0;
        let totalEgressTeacher = 0;
        let totalEgressAdministrative = 0;
        let totalEgressComission = 0;
        let totalEgressMaterial = 0;
        try {
            workPlan = await Model.findOne({
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

                totalEntry: totalEntry * workPlan.number_student,
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
    async createWorkPlan(req, res) {
        let record = [];
        try {
            let days = JSON.parse(crypt.decrypt(req.body.days, k, v));
            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                record = await Model.create({
                    id: max + 1,
                    id_program: req.body.id_program,
                    id_plan: req.body.id_plan,
                    id_process: req.body.id_process,
                    description: req.body.description,
                    number_student: req.body.number_student,
                    days: days,
                    date_start: req.body.date_start,
                    date_end: req.body.date_end,
                    start_time: req.body.start_time,
                    end_time: req.body.end_time,

                    foundation: req.body.foundation,
                    objective: req.body.objective,
                    legal_base: req.body.legal_base,
                    organization: req.body.organization,
                    request: req.body.request
                }, {transaction: t});
            });
            res.status(200).send({id: record.id, message: message.REGISTERED_OK});
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err});
        }
    },
    async updateWorkPlan(req, res) {
        let days = JSON.parse(crypt.decrypt(req.body.days, k, v));
        try {
            await ST.transaction(async (t) => {
                let WorkPlan = await Model.findByPk(req.params.id);
                await WorkPlan.update({
                    id_plan: req.body.id_plan,
                    id_process: req.body.id_process,
                    description: req.body.description,
                    number_student: req.body.number_student,
                    days: days,
                    date_start: req.body.date_start,
                    date_end: req.body.date_end,
                    start_time: req.body.start_time,
                    end_time: req.body.end_time,

                    foundation: req.body.foundation,
                    objective: req.body.objective,
                    legal_base: req.body.legal_base,
                    organization: req.body.organization,
                    request: req.body.request
                }, {transaction: t});
            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async destroyWorkPlan(req, res) {
        try {
            let WorkPlan = await Model.findByPk(req.params.id);
            await WorkPlan.destroy();
            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
