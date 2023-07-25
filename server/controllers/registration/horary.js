const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const Model = require('../../models').Horary;
const Person = require('../../models').Person;
const Teacher = require('../../models').Teacher;
const Course = require('../../models').Course;
const Plan = require('../../models').Plan;
const Ciclo = require('../../models').Ciclo;
const Registration_course = require('../../models').Registration_course;
const ST = Model.sequelize;
module.exports = {


    createHorary: async (req, res) => {
        try {
            await ST.transaction(async (t) => {

                let max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    id_schedule: req.body.id_schedule,
                    id_teacher: req.body.id_teacher,
                    type_course: req.body.type_course,
                    days: req.body.days,
                    ambient: req.body.ambient,
                    start_time: req.body.start_time,
                    end_time: req.body.end_time
                }, {transaction: t})
            });
            res.status(200).send({message: message.REGISTERED_OK});

        } catch (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },
    listHoraryBySchedule: async (req, res) => {
        try {
            let data = await Model.findAll({
                // attributes: ['id', 'id_teacher', 'group_class', 'principal_teacher'],
                where: {id_schedule: req.params.id_schedule},
                include: {
                    attributes: ['id'],
                    model: Teacher,
                    as: 'Teacher',
                    include: {
                        attributes: ['document_number', [Fn('CONCAT', Col('paternal'), ' ', Col('maternal'), ' ', Col('name')), 'name']],
                        model: Person,
                        as: 'Person'
                    }
                }

            });
            res.status(200).send(data);

        } catch (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },


    destroyHorary: async (req, res) => {
        try {
            let m = '';
            await ST.transaction(async (t) => {


                let _data = await Model.findByPk(req.params.id_schedule)
                await _data.destroy();


                m = message.DELETE_OK


            });
            res.status(200).send({message: m})
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
