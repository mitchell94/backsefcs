const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Unit_measure;
const ST = Model.sequelize;
module.exports = {

    async listUnitMeasure(req, res) {
        try {
            let records = await Model.findAll({
                // attributes: ['id', 'description', 'equivalence', 'state'],
                order: [['id', 'asc']]
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async createUnitMeasure(req, res) {
        try {
            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,

                    description: req.body.description,
                    equivalence: req.body.equivalence
                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK})

        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async updateUnitMeasure(req, res) {
        try {
            await ST.transaction(async (t) => {
                let UnitMeasure = await Model.findByPk(req.params.id);
                await UnitMeasure.update({

                    description: req.body.description,
                    equivalence: req.body.equivalence
                }, {transaction: t});
            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async destroyUnitMeasure(req, res) {
        try {
            let UnitMeasure = await Model.findByPk(req.params.id);
            await UnitMeasure.destroy();
            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
