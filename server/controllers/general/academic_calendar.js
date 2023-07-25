const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Academic_calendar;

const Academic_semester = require('../../models').Academic_semester;
const Semester = require('../../models').Semester;
const Semester_activity = require('../../models').Semester_activity;
const Activity = require('../../models').Activity;
const Activity_type = require('../../models').Activity_type;
const ST = Model.sequelize;
const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
module.exports = {
    createAcademicCalendar: async (req, res) => {

        let arrayTempAS = [];
        let semesterAcademicPromise;
        let academicCalendar;
        let tempAcademicSemester;
        try {
            let semesters = JSON.parse(crypt.decrypt(req.body.semesters, k, v));
            let result = await ST.transaction(async (t) => {



                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                academicCalendar = await Model.create({
                    id: max + 1,
                    id_unit_organic: req.body.id_unit_organic,
                    denomination: 'Calendario Académico ' + req.body.denomination,
                    date_start: req.body.date_start,
                    date_end: req.body.date_end,
                    state: req.body.state,
                }, {transaction: t});
                if (academicCalendar) {
                    let cont = 1;
                    for (let i = 0; i < semesters.length; i++) {
                        cont = cont + i;
                        const maxAS = await Academic_semester.max('id', {paranoid: false}, {transaction: t});
                        tempAcademicSemester = await Academic_semester.create({
                            id: maxAS + cont,
                            id_academic_calendar: academicCalendar.id,
                            id_semester: semesters[i].id,
                            denomination: "PROCESO " + semesters[i].denomination,
                            state: semesters[i].state
                        }, {transaction: t});
                        arrayTempAS.push(tempAcademicSemester);
                    }
                    semesterAcademicPromise = await Promise.all(arrayTempAS);
                }


            });
            res.status(200).send(result)
        } catch (e) {
            console.log(e);
            res.status(445).send(e)
        }
    },
    listAcademicCalendar: function (req, res) {
        return Model
            .findAll({
                attributes: ['id', 'denomination', 'date_start', 'date_end', 'state'],
                order: [['id', 'desc']]
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },


    async listProcessByAcademicCalendarID(req, res) {
        try {

            let records = await Academic_semester.findAll({
                attributes: ['id', 'id_academic_calendar', 'id_semester', 'denomination', 'state', 'created_at'],
                where: {
                    state: true,
                    id_academic_calendar: req.params.id_academic_calendar
                }

            });
            // In this case, an instance of Model
            res.status(200).send(records)
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err)
        }


    },
    listAcademicOpenCourse: function (req, res) {
        return Model
            .findOne({
                    attributes: ['id', 'denomination', 'date_start', 'date_end', 'state'],
                    where: {state: true},
                    include: {
                        attributes: ['id', 'id_academic_calendar', 'id_semester', 'denomination', 'state'],
                        where: {state: true},
                        model: Academic_semester,
                        as: "Academic_semester",
                        include: [
                            {
                                attributes: ['id', 'denomination', 'state'],
                                model: Semester,
                                as: "Semester"
                            }
                        ]
                    }
                }
            )
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    listAcademicCalendarAll: function (req, res) {
        return Model
            .findAll({
                    attributes: ['id', 'denomination', 'date_start', 'date_end', 'state'],

                    include: {
                        required: false,
                        attributes: ['id', 'id_academic_calendar', 'id_semester', 'denomination', 'state'],
                        model: Academic_semester,
                        as: "Academic_semesters",
                        include: [
                            {
                                attributes: ['id', 'denomination', 'state'],
                                model: Semester,
                                as: "Semester"
                            }
                        ]
                    },
                    order: [
                        ['created_at', 'desc'],
                        [{model: Academic_semester, as: 'Academic_semesters'}, 'created_at', 'asc']
                    ]

                }
            )
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    listAcademicOrganicUnitNav: function (req, res) {
        return Model
            .findOne({
                    attributes: ['denomination'],
                    where: {
                        id_unit_organic: req.params.id_organic_unit,
                        state: true,

                    },
                    include: {
                        required: false,
                        attributes: ['id', 'denomination'],
                        model: Academic_semester,
                        as: "Academic_semester",
                        include: [

                            {
                                attributes: ['id', 'actual'],
                                model: Semester_activity,
                                as: "SemesterO",
                                where: {
                                    actual: true
                                },
                                include: {
                                    attributes: ['id', 'denomination', 'state'],
                                    model: Activity,
                                    as: "Activity",
                                    include: {
                                        attributes: ['id', 'denomination', 'state'],
                                        where: {denomination: req.params.activity},
                                        model: Activity_type,
                                        as: "Activity_type"
                                    }
                                }
                            }
                        ]
                    }

                }
            )
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    async listAcademicCalendarActual(req, res) {
        try {

            let records = await Model.findOne({
                attributes: ['id', 'denomination', 'date_start', 'date_end', 'state'],
                where: {
                    state: true
                },
                include: {
                    required: true,
                    attributes: ['id', 'id_academic_calendar', 'id_semester', 'denomination', 'state', 'created_at'],
                    where: {state: true},
                    model: Academic_semester,
                    as: "Academic_semesters",
                    include: [
                        {
                            attributes: ['id', 'state', 'actual', 'date_start', 'date_end', 'created_at'],
                            model: Semester_activity,
                            as: "S_a",
                            include: {
                                attributes: ['id', 'denomination', 'state'],
                                where: {state: true},
                                model: Activity,
                                as: "Activity",
                                include: {
                                    attributes: ['id', 'denomination', 'state'],
                                    model: Activity_type,
                                    as: "Activity_type",
                                }
                            }
                        },
                        {
                            attributes: ['id', 'denomination', 'state'],
                            model: Semester,
                            as: "Semester"
                        }

                    ]
                },
                order: [
                    [
                        {model: Academic_semester, as: 'Academic_semesters'}, 'created_at', 'asc'
                    ],
                    [
                        {model: Academic_semester, as: 'Academic_semesters'},
                        {model: Semester_activity, as: 'S_a'}, 'created_at', 'asc'
                    ]
                ]
            });
            // In this case, an instance of Model
            res.status(200).send(records)
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err)
        }


    },
    async listAcademicCalendarActualWorkPlan(req, res) {
        try {

            let records = await Model.findOne({
                attributes: ['id', 'denomination', 'date_start', 'date_end', 'state'],
                where: {
                    state: true
                },
                include: {
                    required: true,
                    attributes: ['id', 'id_academic_calendar', 'id_semester', 'denomination', 'state', 'created_at'],
                    where: {state: true},
                    model: Academic_semester,
                    as: "Academic_semesters",

                },
                order: [
                    [
                        {model: Academic_semester, as: 'Academic_semesters'}, 'created_at', 'asc'
                    ],

                ]
            });
            // In this case, an instance of Model
            res.status(200).send(records)
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err)
        }


    },
    actualActivityState: function (req, res) {
        return Semester_activity
            .findOne({
                where: {
                    id: {
                        [Op.eq]: req.params.id
                    }
                }
            })
            .then(record => {
                if (!record) return res.status(404).send({message: message.RECORD_NOT_FOUND});
                return record
                    .update({
                        actual: !record.actual
                    })
                    .then(updated => {
                        res.status(200).send({
                            message: message.UPDATED_OK,
                            record: updated
                        });
                    })
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    update: async (req, res) => {
        try {
            let academicCalendar;
            let academicSemester;
            let tempAcademicSemester;
            let semesterAcademicPromise;
            let arrayTempAS = [];
            let semesters = JSON.parse(crypt.decrypt(req.body.semesters, k, v));
            let result = await ST.transaction(async (t) => {

                academicCalendar = await Model.findOne({
                    where: {id: req.params.id_academic_calendar}

                }, {transaction: t});
                academicSemester = await Academic_semester.findAll({
                    where: {id_academic_calendar: req.params.id_academic_calendar},
                    order: [['id', 'asc']],
                }, {transaction: t});

                if (academicCalendar && academicSemester) {
                    academicCalendar = await academicCalendar.update({
                        denomination: req.body.denomination || academicCalendar.denomination,
                        date_start: req.body.date_start || academicCalendar.date_start,
                        date_end: req.body.date_end || academicCalendar.date_end,
                        state: req.body.state,

                    }, {transaction: t});
                    for (let i = 0; i < academicSemester.length; i++) {


                        tempAcademicSemester = await academicSemester[i].update({
                            state: semesters[i].state
                        }, {transaction: t});
                        arrayTempAS.push(tempAcademicSemester);


                    }
                    semesterAcademicPromise = await Promise.all(arrayTempAS);

                } else {
                    res.status(200).send("No existe calendario academico con es id")
                }


            });
            res.status(200).send(result)
        } catch (e) {
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
    },

    async listAcademicCalendarAcademicSemesterActivityByActivity(req, res) {
        let data;
        try {
            data = await Model.findOne({
                attributes: ['id', 'denomination', 'date_start', 'date_end', 'state'],
                where: {state: true},
                include: {
                    required: true,
                    attributes: ['id', 'id_academic_calendar', 'id_semester', 'denomination', 'state', 'created_at'],
                    where: {state: true},
                    model: Academic_semester,
                    as: "Academic_semester",
                    include: [
                        {
                            required: true,
                            where: {state: true},
                            attributes: ['id', 'state', 'actual', 'date_start', 'date_end', 'created_at'],
                            model: Semester_activity,
                            as: "SemesterO",
                            include: {
                                required: true,
                                attributes: ['id', 'denomination', 'state'],
                                where: {state: true, denomination: "Inscripción vía Internet"},
                                model: Activity,
                                as: "Activity",
                                include: {
                                    required: true,
                                    attributes: ['id', 'denomination', 'state'],
                                    model: Activity_type,
                                    as: "Activity_type",
                                }
                            }
                        },
                        {
                            attributes: ['id', 'denomination', 'state'],
                            model: Semester,
                            as: "Semester"
                        }

                    ]
                }

            });
            res.status(200).send(data)

        } catch (e) {
            console.log(e);
            res.status(445).send(e)
        }
    }

};
