const Sequelize = require('sequelize');
const message = require('../../messages');
const Model = require('../../models').Administrative;
const Person = require('../../models').Person;
const ST = Model.sequelize;
module.exports = {
    async createAdministrativeCharge(req, res) {

        try {
            await ST.transaction(async (t) => {

                let person = await Person.findByPk(req.body.id_person);
                await person.update({administrative_state: true}, {transaction: t});

                const max = await Model.max('id', {paranoid: false});
                await Model.create({
                    id: max + 1,
                    id_person: req.body.id_person,
                    id_organic_unit: req.body.id_organic_unit,
                    id_contract_type: req.body.id_contract_type,
                    id_charge: req.body.id_charge,
                    date_start: req.body.date_start,
                    date_end: req.body.date_end,
                }, {transaction: t});
            });
            res.status(200).send(message.REGISTERED_OK)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async updateAdministrativeCharge(req, res) {
        try {
            const record = await Model.findByPk(req.params.id);
            await record.update({
                id_organic_unit: req.body.id_organic_unit,
                id_contract_type: req.body.id_contract_type,
                id_charge: req.body.id_charge,
                date_start: req.body.date_start,
                date_end: req.body.date_end,
            });
            res.status(200).send(message.UPDATED_OK)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }

    },
    async destroyAdministrativeCharge(req, res) {
        try {
            const record = await Model.findByPk(req.params.id);
            await record.update({
                state: !record.state,
            });
            res.status(200).send(message.UPDATED_OK);
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
};
