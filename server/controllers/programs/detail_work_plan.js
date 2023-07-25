const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Detail_work_plan;
const ST = Model.sequelize;
const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
module.exports = {

    async listDetailWorkPlanByID(req, res) {
        try {
            let records = await Model.findOne({
                where: {id_work_plan: req.params.id_work_plan}
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async createDetailWorkPlan(req, res) {
        let record = [];
        try {

            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                record = await Model.create({
                    id: max + 1,
                    id_work_plan: req.body.id_work_plan,
                    foundation: req.body.foundation,
                    objective: req.body.objective,
                    legal_base: req.body.legal_base,
                    organization: req.body.organization,
                    request: req.body.request
                }, {transaction: t});
            });
            res.status(200).send({id: record.id, message: message.REGISTERED_OK});
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err});
        }
    },
    async updateDetailWorkPlan(req, res) {
        try {
            await ST.transaction(async (t) => {
                let DetailWorkPlan = await Model.findByPk(req.params.id);
                await DetailWorkPlan.update({
                    foundation: req.body.foundation,
                    objective: req.body.objective,
                    legal_base: req.body.legal_base,
                    organization: req.body.organization,
                    request: req.body.request
                }, {transaction: t});
            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async destroyDetailWorkPlan(req, res) {
        try {
            let DetailWorkPlan = await Model.findByPk(req.params.id);
            await DetailWorkPlan.destroy();
            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
