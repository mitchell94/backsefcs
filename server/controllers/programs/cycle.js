const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Ciclo;
const Course = require('../../models').Course;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const ST = Model.sequelize;
const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
module.exports = {
    create: async (req, res) => {

        let cycle;
        let arrayTemp = [];

        try {
            let cycles = JSON.parse(crypt.decrypt(req.body.cycles, k, v));
            await ST.transaction(async (t) => {
                let cont = 1;
                for (let i = 0; i < cycles.length; i++) {
                    const max = await Model.max('id', {paranoid: false}, {transaction: t});
                    cycle = await Model.create({
                        id: max + cont,
                        id_program: req.body.id_program,
                        period: cycles[i].semester,
                        ciclo: cycles[i].cycle,
                        state: cycles[i].state
                    }, {transaction: t});
                    arrayTemp.push(cycle);


                    await Promise.all(arrayTemp);
                }

            });
            res.status(200).send(message.REGISTERED_OK)
        } catch
            (e) {
            console.log(e);
            res.status(445).send(e)
        }
    },


    listCycleByPlan: function (req, res) {
        return Model
            .findAll({
                attributes: ['id', 'id_plan', 'ciclo', 'period', 'state'],
                where: {id_plan: {[Op.eq]: req.params.id_plan}},
                order: [
                    ['ciclo', 'asc']]

            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    async listCourseByPlanID(req, res) {
        try {
            let records = await Model.findAll({
                attributes: ['id', 'ciclo'],
                where: {id_plan: req.params.id_plan},
                include: {
                    attributes: ['id', 'denomination', 'practical_hours', 'hours'],
                    model: Course,
                    as: "Course"
                },

                order: [[{model: Course, as: 'Course'}, 'order', 'asc']],
            });
            let data = [];
            records.map((r, i) => {
                r.Course.map((s, j) => {
                    data.push({
                        "id": s.id,
                        "denomination": s.denomination,
                        "total_hours": s.hours + s.practical_hours,
                    },)
                });

            });
            res.status(200).send(data)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    listCycleCourseByPlan: function (req, res) {
        return Model
            .findAll({
                // attributes: ['id', 'id_program', 'ciclo', 'period', 'state'],
                where: {id_plan: {[Op.eq]: req.params.id_plan}, state: true},
                include: {
                    // where: {state: true},
                    model: Course,
                    as: "Course"
                },
                order: [
                    ['ciclo', 'asc'],
                    [{model: Course, as: 'Course'}, 'order', 'asc']

                ],
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    listCycleCourseByCycle: function (req, res) {
        return Course
            .findAll({
                attributes: [['id', 'value'], ['denomination', 'label'], 'order'],
                where: {state: true},
                include: {
                    attributes: ['state'],
                    where: {id_plan: req.params.id_plan, ciclo: {[Op.lt]: req.params.cycle}},
                    model: Model,
                    as: 'Ciclo'
                },
                order: [['order', 'asc']]
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    listCourseByPlanStudy: async (req, res) => {
        try {
            let records = await Model.findAll({
                // attributes: ['id', 'id_program', 'ciclo', 'period', 'state'],
                where: {id_plan: {[Op.eq]: req.params.id_plan}, state: true},
                include: {
                    // where: {state: true},
                    model: Course,
                    as: "Course"
                },
                order: [
                    ['ciclo', 'asc'],
                    [{model: Course, as: 'Course'}, 'order', 'asc']

                ],
            })
            let data = [];
            records.map((r, i) => {

                r.Course.map((s, j) => {
                    data.push({
                        'cycle': r.ciclo,
                        "id": s.id,
                        "denomination": s.denomination,
                        "area": s.area,
                        "order": s.order,
                        "credits": s.credits,
                        "practical_hours": s.practical_hours,
                        "hours": s.hours,
                        "type": s.type,
                        "requirements": s.requirements ? JSON.parse(s.requirements) : []
                        // "total_hours": s.hours + s.practical_hours,
                    })
                });

            });
            res.status(200).send(data)
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    update: async (req, res) => {
        let cycle;
        let arrayTemp = [];

        try {
            let cycles = JSON.parse(crypt.decrypt(req.body.cycles, k, v));
            await ST.transaction(async (t) => {
                let cont = 1;
                for (let i = 0; i < cycles.length; i++) {
                    let cycleOne = await Model.findOne({where: {id: cycles[i].id}}, {transaction: t});
                    if (cycleOne) {

                        cycle = await cycleOne.update({
                            period: cycles[i].semester,
                            ciclo: cycles[i].cycle,
                            state: cycles[i].state
                        }, {transaction: t});
                        arrayTemp.push(cycle);
                    }


                    await Promise.all(arrayTemp);
                }

            });
            res.status(200).send(message.REGISTERED_OK)
        } catch
            (e) {
            console.log(e);
            res.status(445).send(e)
        }
    },

    destroy: function (req, res) {
        return Model
            .findOne({
                where: {
                    id: {
                        [Op.eq]: req.params.id
                    }
                }
            })
            .then(record => {
                if (!record) return res.status(400).send({message: message.RECORD_NOT_FOUND});
                return record
                    .destroy()
                    .then(() => res.status(200).send({message: message.DELETED_OK}))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }
    ,
};
