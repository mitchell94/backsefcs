const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const Model = require('../../models').Egress_comission;
const Person = require('../../models').Person;
const Concept = require('../../models').Concept;
const ST = Model.sequelize;
const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
module.exports = {

    async listEgressComissionByWorkPlanID(req, res) {
        try {
            let records = await Model.findAll({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id_work_plan: req.params.id_work_plan},
                include: [
                    {
                        attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                        model: Person,
                        as: "Person"
                    },
                    {
                        attributes: ['denomination'],
                        model: Concept,
                        as: "Concept"
                    }
                ],
                order: [['created_at', 'desc']],
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    async createEgressComission(req, res) {
        try {
            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    id_work_plan: req.body.id_work_plan,
                    id_concept: req.body.id_concept,
                    id_person: req.body.id_person,
                    charge: req.body.charge,
                    amount: req.body.amount,
                    observation: req.body.observation,
                    number_month: req.body.number_month
                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK});
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err});
        }
    },
    async updateEgressComission(req, res) {

        try {
            await ST.transaction(async (t) => {
                let EgressComission = await Model.findByPk(req.params.id);
                await EgressComission.update({
                    id_person: req.body.id_person,
                    charge: req.body.charge,
                    amount: req.body.amount,
                    observation: req.body.observation,
                    number_month: req.body.number_month
                }, {transaction: t});
            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async destroyEgressComission(req, res) {
        try {
            let WorkPlan = await Model.findByPk(req.params.id);
            await WorkPlan.destroy();
            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
