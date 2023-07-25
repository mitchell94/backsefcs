const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Bank_account;
const Bank = require('../../models').Bank;
const ST = Model.sequelize;
module.exports = {

    async listBankAccount(req, res) {
        try {
            let records = await Model.findAll({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                include: {
                    attributes: ['denomination'],
                    model: Bank,
                    as: "Bank"
                }
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async createBankAccount(req, res) {
        try {
            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    id_bank: req.body.bank,
                    number_account: req.body.number_account,
                    cci: req.body.cci
                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK})

        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async updateBankAccount(req, res) {
        try {
            await ST.transaction(async (t) => {
                let BankAccount = await Model.findByPk(req.params.id);
                await BankAccount.update({
                    id_bank: req.body.bank,
                    number_account: req.body.number_account,
                    cci: req.body.cci
                }, {transaction: t});
            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async destroyBankAccount(req, res) {
        try {
            let BankAccount = await Model.findByPk(req.params.id);
            await BankAccount.destroy();
            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
