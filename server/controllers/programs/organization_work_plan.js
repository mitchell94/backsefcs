const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Organization_work_plan;
const Person = require('../../models').Person;
const ST = Model.sequelize;
const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
module.exports = {

    async listOrganizationWorkPlanByID(req, res) {
        try {
            let records = await Model.findAll({
                where: {id_work_plan: req.params.id_work_plan},
                attributes: ['id', 'denomination', 'type', 'state'],

                // order: [['denomination', 'asc']]
                include: {
                    model: Person,
                    as: "Person"
                }
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async createOrganizationWorkPlan(req, res) {
        try {

            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    id_work_plan: req.body.id_work_plan,
                    id_person: req.body.id_person,
                    observation: req.body.observation || null,
                    charge: req.body.charge
                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK});
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err});
        }
    },
    async updateOrganizationWorkPlan(req, res) {
        try {
            await ST.transaction(async (t) => {
                let OrganizationWorkPlan = await Model.findByPk(req.params.id);
                await OrganizationWorkPlan.update({
                    id_person: req.body.id_person,
                    observation: req.body.observation || null,
                    charge: req.body.charge
                }, {transaction: t});
            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async destroyOrganizationWorkPlan(req, res) {
        try {
            let OrganizationWorkPlan = await Model.findByPk(req.params.id);
            await OrganizationWorkPlan.destroy();
            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
