const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Uit;
const ST = Model.sequelize;
module.exports = {

    async listUit(req, res) {
        try {
            let records = await Model.findAll({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                order: [['year', 'desc']],
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async listActualUit(req, res) {
        try {
            let records = await Model.findOne({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {state: true}
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async updateActualUit(req, res) {
        let array = [];
        let r = [];
        try {
            await ST.transaction(async (t) => {

                let records = await Model.findAll({
                        order: [['year', 'desc']],
                    }, {transaction: true}
                    // {attributes: ['id', 'state', 'year', 'amount']}
                );

                for (let i = 0; i < records.length; i++) {
                    let arrayTemp = "";
                    if (records[i].id == req.params.id) {
                        arrayTemp = await records[i].update({
                            state: true,
                        }, {transaction: t});
                    } else {
                        arrayTemp = await records[i].update({
                            state: false,
                        }, {transaction: t});
                    }

                    array.push(arrayTemp);
                }


                r = await Promise.all(array);
            });
            res.status(200).send(r);
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async createUit(req, res) {
        try {
            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    year: req.body.year,
                    amount: req.body.amount,
                    state: false
                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK});
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async updateUit(req, res) {
        try {
            await ST.transaction(async (t) => {
                let Uit = await Model.findByPk(req.params.id);
                await Uit.update({
                    year: req.body.year,
                    amount: req.body.amount,
                }, {transaction: t});
            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async destroyUit(req, res) {
        try {
            let Uit = await Model.findByPk(req.params.id);
            await Uit.destroy();
            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
