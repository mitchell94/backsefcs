const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Category_concept;
const ST = Model.sequelize;
module.exports = {

    async listCategoryConcept(req, res) {
        try {
            let records = await Model.findAll({
                attributes: ['id', 'order', 'description', 'state'],
                order: [['order', 'asc']]
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async createCategoryConcept(req, res) {
        try {
            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    order: req.body.order,
                    description: req.body.description
                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK})

        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async updateCategoryConcept(req, res) {
        try {
            await ST.transaction(async (t) => {
                let categoryConcept = await Model.findByPk(req.params.id);
                await categoryConcept.update({
                    order: req.body.order,
                    description: req.body.description
                }, {transaction: t});
            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async destroyCategoryConcept(req, res) {
        try {
            let categoryConcept = await Model.findByPk(req.params.id);
            await categoryConcept.destroy();
            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
