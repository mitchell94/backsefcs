const Sequelize = require('sequelize');
const message = require('../../messages');
const Model = require('../../models').Teacher;
const Person = require('../../models').Person;
const Horary = require('../../models').Horary;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const ST = Model.sequelize;
module.exports = {
    async createTeacher(req, res) {

        try {
            await ST.transaction(async (t) => {

                const max = await Model.max('id', {paranoid: false});
                await Model.create({
                    id: max + 1,
                    id_person: req.body.id_person,
                    id_schedule: req.body.id_schedule,
                    id_organic_unit: req.body.id_organic_unit,
                    id_contract_type: '1',//temporal
                    id_charge: '4',//docente
                    principal: req.body.principal,

                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    listTeacherBySchedule: async (req, res) => {
        try {
            let data = await Model.findAll({
                attributes: ['id', 'principal'],
                where: {id_schedule: req.params.id_schedule},
                include: [
                    {
                        // attributes: ['id', 'denomination'],
                        attributes: ['id','document_number', [Fn('CONCAT', Col('paternal'), ' ', Col('maternal'), ' ', Col('name')), 'name']],
                        model: Person,
                        as: 'Person'
                    }

                ]
            });
            res.status(200).send(data);

        } catch (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },
    async createTeacherCharge(req, res) {

        try {
            await ST.transaction(async (t) => {
                let person = await Person.findByPk(req.body.id_person);
                await person.update({teacher_state: true}, {transaction: t});

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
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async updateTeacherCharge(req, res) {
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
    async destroyTeacherCharge(req, res) {
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
    async destroyTeacher(req, res) {
        /**
         * @type {*}
         * @private
         * Un SCHEDULE peretenece a un curso , pero este no se registra en REGISTRATION_COURSE en el detalle de cada estudiante
         * Eliminamos docentes
         * Eliminamos horarios
         */
        try {
            let m = '';
            await ST.transaction(async (t) => {


                let _data = await Model.findByPk(req.params.id)
                await _data.destroy();

                await Horary.destroy({where: {id_teacher: _data.id}});

                m = message.DELETE_OK


            });
            res.status(200).send({message: m})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
};
