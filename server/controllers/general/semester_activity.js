const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Activity = require('../../models').Activity;
const Activity_type = require('../../models').Activity_type;
const Model = require('../../models').Semester_activity;
const Academic_calendar = require('../../models').Academic_calendar;
const Academic_semester = require('../../models').Academic_semester;
const Admission_plan = require('../../models').Admission_plan;
const ST = Model.sequelize;
const moment = require('moment');
const crypt = require('node-cryptex');
const {Registration, Student, Plan, Registration_course, Course} = require("../../models");
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
moment.locale('es-mx');
module.exports = {
    create: async (req, res) => {
        try {
            let activitys = JSON.parse(crypt.decrypt(req.body.activitys, k, v));

            let tempActivity;
            let promiseActivity = [];
            let result = await ST.transaction(async (t) => {
                if (activitys) {
                    let cont = 1;
                    for (let i = 0; i < activitys.length; i++) {

                        for (let j = 0; j < activitys[i].Activity.length; j++) {
                            cont = cont + 1;
                            const max = await Model.max('id', {paranoid: false}, {transaction: t});
                            tempActivity = await Model.create({
                                id: max + cont,
                                id_academic_semester: req.body.id_academic_semester,
                                id_activity: activitys[i].Activity[j].id,
                                id_unit_organic: 11,
                                date_start: activitys[i].Activity[j].date_start,
                                date_end: activitys[i].Activity[j].date_end,
                                state: activitys[i].Activity[j].state,
                            }, {transaction: t});
                        }

                        promiseActivity.push(tempActivity);
                    }
                    await Promise.all(promiseActivity);
                }


            });

            res.status(200).send({result, promiseActivity})
        } catch (e) {
            console.log(e);
            res.status(445).send(e)
        }
        // id: max + 1,

    },

    list: function (req, res) {
        let condition;
        if (req.body.id_unit_organic) {
            condition = {
                id_unit_organic: {[Op.eq]: req.body.id_unit_organic},
                id_academic_semester: {[Op.eq]: req.body.id_academic_semester}
            };
        } else {
            condition = {id_academic_semester: {[Op.eq]: req.body.id_academic_semester}}

        }
        return Model
            .findAll({
                attributes: ['id', 'id_academic_semester', 'id_activity', 'id_unit_organic', 'date_start', 'date_end', 'actual', 'state'],
                where: condition,
                order: [['id', 'asc']],
                include: {
                    attributes: ['id', 'denomination'],
                    model: Activity,
                    as: 'Activity'
                }
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    listSemesterActivity: async (req, res) => {
        try {
            const records = await Model.findAll({
                where: {
                    id_program: req.params.id_program,
                    id_academic_semester: req.params.id_process
                },
                include: {
                    required: true,
                    model: Activity,
                    as: 'Activity'
                },
                order: [['created_at', 'asc']]
            })
            let data = []
            for (let i = 0; i < records.length; i++) {
                data.push({
                    "id": records[i].id,
                    "date_start": records[i].date_start,
                    "date_end": records[i].date_end,
                    "actual": records[i].actual,
                    "state": records[i].state,
                    "finish": records[i].finish,
                    "activity": records[i].Activity.denomination
                })
            }
            res.status(200).send(data)
        } catch (e) {
            res.status(400).send(e)
        }
    },
    retriveSemesterActivity: async (req, res) => {

        try {
            let data = [];
            let record = ''
            let state = false;

            record = await Model.findOne({
                where: {
                    id_program: req.body.id_program,
                    id_academic_semester: req.body.id_process,
                    id_activity: req.body.id_activity
                }

            })
            if (record) {
                if (record.date_end <= moment() || record.state) {
                    state = true
                }
            }


            res.status(200).send(state);
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    retriveSemesterActivityRegistration: async (req, res) => {

        try {
            let data = [];
            let record = ''
            let type = 0;

            record = await Model.findOne({
                where: {
                    id_program: req.body.id_program,
                    id_academic_semester: req.body.id_process,
                    state: true
                },
                include: {
                    model: Activity,
                    as: 'Activity',
                    where: {id_activity_type: 2}
                }

            })
            if (record) {
                if (record.date_end <= moment() || record.state) {
                    type = record.id_activity
                    //3 regular y 4 extemporanea
                }
            }


            res.status(200).send({type: type});
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    finishSemesterActivity: async (req, res) => {

        try {
            let record = [];
            await ST.transaction(async (t) => {
                //Buscamos el año de acuerdo al where
                const semesterActivitys = await Model.findAll({
                    where: {
                        id_program: req.body.id_program,
                        id_academic_semester: req.body.id_process
                    }
                });
                //actualizamos todos los estaod s a finish en true de finalizado
                let newData = []
                for (let i = 0; i < semesterActivitys.length; i++) {
                    let temp = await Model.findByPk(semesterActivitys[i].id);
                    await temp.update({finish: true, state: false}, {transaction: t});
                    newData.push(temp)
                }
                //Seleccionamos los matriculas hasta la fecha del estudiante y segun  la condicion
                record = await Student.findAll({
                    where: {type: 'Estudiante', id_program: req.body.id_program},
                    attributes: ['id', 'type'],
                    include: [
                        {
                            attributes: ['credit_required'],
                            model: Plan,
                            as: 'Plan'
                        },
                        {
                            attributes: ['id', 'id_semester'],
                            required: true,
                            where: {
                                id_semester: {[Op.lte]: req.body.id_process},
                                id_program: req.body.id_program
                            },
                            model: Registration,
                            as: 'Registration',
                            include: {
                                attributes: ['id', 'state'],
                                required: true,
                                model: Registration_course,
                                as: 'Registration_course',
                                include: {
                                    attributes: ['id', 'credits'],
                                    model: Course,
                                    as: 'Course'
                                }
                            }

                        }
                    ],
                    order: [[{model: Registration, as: 'Registration'}, 'created_at', 'asc']]
                }, {transaction: t});
                //selecionamos solo a los que tienen la cantidad de creditos aprobados
                let studentData = []
                for (let i = 0; i < record.length; i++) {
                    let totalCredit = 0;
                    let ids = 0;
                    for (let j = 0; j < record[i].Registration.length; j++) {
                        for (let k = 0; k < record[i].Registration[j].Registration_course.length; k++) {
                            if (record[i].Registration[j].Registration_course[k].state === 'Aprobado') {
                                totalCredit = totalCredit + record[i].Registration[j].Registration_course[k].Course.credits
                                ids = record[i].Registration[j].id_semester
                            }
                        }
                    }

                    if (totalCredit >= record[i].Plan.credit_required) {
                        studentData.push({
                            'id_student': record[i].id,
                            'id_process_egress': ids,
                            'required_credit': record[i].Plan.credit_required,
                            'total_credit': totalCredit
                        });
                        console.log(record[i].id)
                    }

                }
                if (studentData.length > 0) {
                    for (let i = 0; i < studentData.length; i++) {
                        let temp = await Student.findByPk(studentData.id_student);
                        if (temp) {
                            await temp.update({
                                type: 'Egresado',
                                id_process_egress: studentData.id_process_egress
                            }, {transaction: t});
                            newData.push(temp)
                        }
                    }
                }
                data = studentData
                await Promise.all(newData)
            })
            res.status(200).send(data);
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    updateStateSemesterActivity: async (req, res) => {

        try {
            let record = [];
            await ST.transaction(async (t) => {
                //Buscamos el año de acuerdo al where
                const semesterActivitys = await Model.findAll();
                //actualizamos todos los estaod s a finish en true de finalizado
                let newData = []
                for (let i = 0; i < semesterActivitys.length; i++) {
                    let temp = await Model.findByPk(semesterActivitys[i].id);
                    await temp.update({ state: false}, {transaction: t});
                    newData.push(temp)
                }

                await Promise.all(newData)
            })
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    createSemesterActivity: async (req, res) => {

        try {
            let data = [];
            let promiseActivity = [];
            await ST.transaction(async (t) => {
                let activitys = [1, 2, 3, 4, 5, 6, 7, 8];
                let cont = 0;

                const semester = await Academic_semester.findOne({
                    where: {id: req.body.id_academic_semester},
                    include: {
                        model: Academic_calendar,
                        as: 'Academic_calendar'
                    }
                });

                for (let i = 0; i < activitys.length; i++) {
                    cont = cont + 1;
                    const max = await Model.max('id', {paranoid: false}, {transaction: t});
                    let tempActivity = await Model.create({
                        id: max + cont,
                        id_academic_semester: req.body.id_academic_semester,
                        id_program: req.body.id_program,
                        id_activity: activitys[i],
                        date_start: semester.Academic_calendar.date_start,
                        date_end: semester.Academic_calendar.date_start,
                        actual: false,
                        finish: false,
                        state: false,
                    }, {transaction: t});
                    promiseActivity.push(tempActivity);
                }
                await Promise.all(promiseActivity);

            })

            res.status(200).send(data);
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    updateSemesterActivity: async (req, res) => {
        try {
            let data = []

            data = await Model.findByPk(req.params.id)
            await data.update({
                date_start: req.body.date_start,
                date_end: req.body.date_end,
                state: req.body.state,
            })

            res.status(200).send({message: message.UPDATED_OK})
        } catch (e) {
            console.log(e);
            res.status(445).send(e)
        }
        // id: max + 1,

    },

    destroy: function (req, res) {
        return Model
            .findOne({
                where: {id: {[Op.eq]: req.params.id}}
            })
            .then(record => {
                if (!record) return res.status(400).send({message: message.RECORD_NOT_FOUND});
                return record
                    .destroy()
                    .then(() => res.status(200).send({message: message.DELETED_OK}))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
};
