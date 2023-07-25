const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Entry;
const Concept = require('../../models').Concept;
const Category_concept = require('../../models').Category_concept;

const ST = Model.sequelize;
const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
module.exports = {

    async listEntryByWorkPlanID(req, res) {
        try {
            let records = await Model.findAll({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id_work_plan: req.params.id_work_plan},
                include: {
                    attributes: ['denomination'],
                    model: Concept,
                    as: "Concept",
                    include: {
                        attributes: ['description'],
                        model: Category_concept,
                        as: "Category_concept"
                    }
                },
                order: [
                    [{model: Concept, as: 'Concept'}, {model: Category_concept, as: 'Category_concept'}, 'order', 'asc']
                ]
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async createEntryWorkPlan(req, res) {

        try {
            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    id_work_plan: req.body.id_work_plan,
                    id_concepts: req.body.id_concepts,
                    cant: req.body.cant,
                    amount: req.body.amount,
                    observation: req.body.observation
                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK});
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err});
        }
    },
    async updateEntryWorkPlan(req, res) {

        try {
            await ST.transaction(async (t) => {
                let entryWorkPlan = await Model.findByPk(req.params.id);
                await entryWorkPlan.update({
                    id_concepts: req.body.id_concepts,
                    cant: req.body.cant,
                    amount: req.body.amount,
                    observation: req.body.observation
                }, {transaction: t});
            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async destroyEntryWorkPlan(req, res) {
        try {
            let WorkPlan = await Model.findByPk(req.params.id);
            await WorkPlan.destroy();
            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
