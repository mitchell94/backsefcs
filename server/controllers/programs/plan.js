const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Plan;
const Cycle = require('../../models').Ciclo;
const Cost = require('../../models').Cost;
const Concepts = require('../../models').Concepts;
const ST = Model.sequelize;
const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
module.exports = {
    createPlan: async (req, res) => {


        let plan;
        let cycle;

        let arrayTempCycle = [];

        try {
            let cycles = JSON.parse(crypt.decrypt(req.body.cycles, k, v));


            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                plan = await Model.create({
                    id: max + 1,
                    id_program: req.body.id_program,
                    id_academic_period: req.body.id_academic_period,
                    code: req.body.code,
                    mesh: req.body.mesh,
                    cant_period: req.body.cant_period,
                    credit_elective: req.body.credit_elective,
                    credit_required: req.body.credit_required,
                    description: req.body.description,
                    state: true,
                }, {transaction: t});
                if (plan) {
                    for (let i = 0; i < cycles.length; i++) {
                        let maxCycle = await Cycle.max('id', {paranoid: false}, {transaction: t});
                        cycle = await Cycle.create({
                            id: maxCycle + i + 1,
                            id_plan: plan.id,
                            period: cycles[i].semester,
                            ciclo: cycles[i].cycle,
                            state: cycles[i].state
                        }, {transaction: t});
                        arrayTempCycle.push(cycle);
                    }
                    await Promise.all(arrayTempCycle);
                }
            });
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (e) {
            console.log(e);
            res.status(445).send(e)
        }

    },
    updatePlan: async (req, res) => {


        let arrayTempCycle = [];

        try {
            let cycles = JSON.parse(crypt.decrypt(req.body.cycles, k, v));


            await ST.transaction(async (t) => {

                let plan = await Model.findByPk(req.params.id);
                let planUpdate = await plan.update({
                    id_academic_period: req.body.id_academic_period,
                    code: req.body.code,
                    mesh: req.body.mesh,
                    credit_required: req.body.credit_required,
                    description: req.body.description,
                }, {transaction: t});

                if (planUpdate) {


                    for (let i = 0; i < cycles.length; i++) {
                        let cycle = await Cycle.findByPk(cycles[i].id);
                        let cycleUpdate = await cycle.update({
                            period: cycles[i].semester,
                            state: cycles[i].state
                        }, {transaction: t});
                        arrayTempCycle.push(cycleUpdate);

                    }


                    await Promise.all(arrayTempCycle);

                }


            });
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (e) {
            console.log(e);
            res.status(445).send(e)
        }

    },
    listPlanByProgramID: async (req, res) => {

        try {
            let records;
            await ST.transaction(async (t) => {
                records = await Model.findAll({
                        where: {id_program: req.params.id},
                        order: [['created_at', 'asc']]
                    }, {transaction: t}
                )

            });

            res.status(200).send(records)
        } catch (e) {

            res.status(444).send(e)
        }


    },
    async listStudyPlanByProgramIDReport(req, res) {
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
    listPlanCost: function (req, res) {
        return Model
            .findOne({
                // attributes: ['id', 'denomination'],
                where: {id_program: req.params.id_program, valid: true},
                include: {
                    model: Cost,
                    as: "Cost",
                    include: {
                        where: {denomination: {[Op.like]: '%' + "INSCRIPCIÓN" + '%'}},
                        model: Concepts,
                        as: "Concepts"
                    }

                }

            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    async updateActualPlan(req, res) {
        let array = [];
        let record = [];
        try {
            await ST.transaction(async (t) => {

                let records = await Model.findAll({
                        where: {
                            id_program: req.params.id_program,
                        },
                        order: [['created_at', 'desc']]
                    }, {transaction: true}
                    // {attributes: ['id', 'state', 'year', 'amount']}
                );

                for (let i = 0; i < records.length; i++) {
                    let arrayTemp = "";
                    if (records[i].id == req.body.id_plan) {
                        arrayTemp = await records[i].update({
                            valid: true,
                        }, {transaction: t});
                    } else {
                        arrayTemp = await records[i].update({
                            valid: false,
                        }, {transaction: t});
                    }

                    array.push(arrayTemp);
                }


                record = await Promise.all(array);
            });
            res.status(200).send({record: record, message: message.UPDATED_OK});
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    updateValidPlan: async (req, res) => {

        let plans = JSON.parse(crypt.decrypt(req.body.plans, k, v));
        let arrayTempPlan = [];
        try {
            await ST.transaction(async (t) => {
                for (let i = 0; i < plans.length; i++) {
                    let planOne = await Model.findOne({where: {id: plans[i].id}}, {transaction: t});
                    if (planOne) {
                        let plan = await planOne.update({valid: plans[i].valid}, {transaction: t});
                        arrayTempPlan.push(plan);
                    }

                }
                await Promise.all(arrayTempPlan);

            });
            res.status(200).send({message: message.UPDATED_OK});
        } catch (e) {
            res.status(400).send(e)
        }

    },
    destroyPlan: async (req, res) => {

        try {
            let plan = await Model.findByPk(req.params.id);
            if (!plan) {
                res.status(404).send({message: message.RECORD_NOT_FOUND})
            }
            await plan.update({state: false, valid: false});
            await plan.destroy();
            res.status(200).send({message: message.UPDATED_OK});
        } catch (e) {
            res.status(400).send(e)
        }

    },
};
