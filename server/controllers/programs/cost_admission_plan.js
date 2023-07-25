const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Cost_admission_plan;
const Concept = require('../../models').Concept;
const Category_concept = require('../../models').Category_concept;

const ST = Model.sequelize;
module.exports = {
    async listCostByAdmissionPlanID(req, res) {
        try {

            let records = await Model.findAll({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id_admission_plan: req.params.id_admission_plan},
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
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async createCostAdmissionPlan(req, res) {
        try {
            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    id_admission_plan: req.body.id_admission_plan,
                    id_concept: req.body.id_concept,
                    amount: req.body.amount,
                    cant: req.body.cant,
                    observation: req.body.observation
                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK});
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err});
        }
    },
    async updateCostAdmissionPlan(req, res) {

        try {
            await ST.transaction(async (t) => {
                let CostAdmissionPlan = await Model.findByPk(req.params.id);
                await CostAdmissionPlan.update({
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
    async destroyCostAdmissionPlan(req, res) {
        try {
            let AdmissionPlan = await Model.findByPk(req.params.id);
            await AdmissionPlan.destroy();
            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
