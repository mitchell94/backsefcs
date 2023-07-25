const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Material;
const ST = Model.sequelize;
module.exports = {
    async searchMaterial(req, res) {
        const param = req.params.parameter
        try {
            let record = await Model.findAll({
                // attributes: ['id', 'document_number', 'photo', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: {
                    [Op.and]: [
                        {denomination: {[Op.iLike]: '%' + param + '%'}}
                    ]
                }
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async listMaterial(req, res) {
        try {
            let records = await Model.findAll({
                attributes: ['id', 'denomination', 'type', 'state'],
                order: [['denomination', 'asc']]
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async listMaterialByType(req, res) {
        try {
            let records = await Model.findAll({
                attributes: ['id', 'denomination', 'type', 'state'],
                where: {type: req.params.type},
                order: [['denomination', 'asc']]
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async createMaterial(req, res) {
        try {
            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    denomination: req.body.denomination,
                    type: req.body.category
                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK})

        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    async updateMaterial(req, res) {
        try {
            await ST.transaction(async (t) => {
                let Material = await Model.findByPk(req.params.id);
                await Material.update({
                    denomination: req.body.denomination,
                    type: req.body.category
                }, {transaction: t});
            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async destroyMaterial(req, res) {
        try {
            let material = await Model.findByPk(req.params.id);
            await material.destroy();
            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
