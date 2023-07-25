const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Discount;
const Authority = require('../../models').Authority;
const Organic_unit = require('../../models').Organic_unit;
const System_configuration = require('../../models').System_configuration;
const ST = Model.sequelize;
module.exports = {

    listDiscount: async (req, res) => {
        try {
            let records = await Model.findAll({ order: [['created_at', 'asc']]});
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    listAuthority: async (req, res) => {
        try {
            let records = await Authority.findAll({
                attributes: ['id', 'person', 'charge', 'type', 'state'],
                include: {
                    attributes: ['denomination', 'abbreviation'],
                    model: Organic_unit,
                    as: 'Organic_unit'
                },
                order: [['created_at', 'asc']]
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    updateStateAuthority: async (req, res) => {
        try {
            await ST.transaction(async (t) => {
                let data = await Authority.findByPk(req.params.id);
                await data.update({
                    state: !data.state
                }, {transaction: t});

            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }

    },
    listConfig: async (req, res) => {
        try {
            let records = await System_configuration.findAll();
            res.status(200).send(records)
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    updateStateConfig: async (req, res) => {
        try {
            await ST.transaction(async (t) => {
                let data = await System_configuration.findByPk(req.params.id);
                await data.update({
                    state: !data.state
                }, {transaction: t});

            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }

    }

};
