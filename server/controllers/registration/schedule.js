const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const Model = require('../../models').Schedule;
const Person = require('../../models').Person;
const Teacher = require('../../models').Teacher;
const Course = require('../../models').Course;
const Plan = require('../../models').Plan;
const Ciclo = require('../../models').Ciclo;
const Horary = require('../../models').Horary;
const Student = require('../../models').Student;
const Acta_book = require('../../models').Acta_book;
const Registration = require('../../models').Registration;
const Admission_plan = require('../../models').Admission_plan;
const Registration_course = require('../../models').Registration_course;
const ST = Model.sequelize;
const abox = require('../Abox');
const moment = require('moment');
const {Academic_semester, Academic_calendar} = require("../../models");
module.exports = {


    createSchedule: async (req, res) => {
        try {
            await ST.transaction(async (t) => {
                let type = ''
                if (req.body.type === 'Regular' || req.body.type === 'Extemporánea' || req.body.type === 'Curso desaprobado por Credito') {
                    type = 'R'
                }
                if (req.body.type === 'Curso dirigido Tesis' || req.body.type === 'Curso dirigido Otros') {
                    type = 'D'
                }
                if (req.body.type === 'Convalidado UNSM') {
                    type = 'C'
                }
                if (req.body.type === 'Convalidado Externo') {
                    type = 'CC'
                }

                let maxSchedule = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: maxSchedule + 1,
                    id_course: req.body.id_course,
                    id_process: req.body.id_process,
                    id_program: req.body.id_program,
                    group_class: req.body.group_class,
                    type_registration: type,
                    start_date: req.body.start_date,
                    end_date: req.body.end_date,
                    end_date_acta: req.body.end_date_acta,
                }, {transaction: t})
            });
            res.status(200).send({message: message.REGISTERED_OK});

        } catch (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },
    createScheduleMassive: async (req, res) => {
        try {
            const semester = await Academic_semester.findOne({
                where: {id: req.body.id_process},
                include: {
                    model: Academic_calendar,
                    as: 'Academic_calendar'
                }
            });


            let plan;
            await ST.transaction(async (t) => {
                /**
                 * Buscamos los cursos segun el plan actual
                 * @type {*}
                 */
                plan = await Plan.findOne({
                    where: {id_program: req.body.id_program, valid: true},
                    include: {
                        model: Ciclo,
                        as: 'Ciclos',
                        include: {
                            model: Course,
                            as: 'Course'
                        }
                    },
                    order: [
                        [{model: Ciclo, as: 'Ciclos'}, 'period', 'asc'],
                        [{model: Ciclo, as: 'Ciclos'}, {model: Course, as: 'Course'}, 'order', 'asc']

                    ],
                })

                let arrayTemp = [];
                let maxSchedule = await Model.max('id', {paranoid: false}, {transaction: t});
                let k = 1;
                for (let i = 0; i < plan.Ciclos.length; i++) {
                    for (let j = 0; j < plan.Ciclos[i].Course.length; j++) {

                        let temp = await Model.create({
                            id: maxSchedule + k,
                            id_course: plan.Ciclos[i].Course[j].id,
                            id_process: req.body.id_process,
                            id_program: req.body.id_program,
                            group_class: '01',
                            type_registration: 'R',
                            start_date: semester.Academic_calendar.date_start,
                            end_date: semester.Academic_calendar.date_start,
                            end_date_acta: moment().format('YYYY-MM-DD'),
                        }, {transaction: t});
                        arrayTemp.push(temp);
                        k++
                    }
                }
                await Promise.all(arrayTemp);

            });
            res.status(200).send({message: message.REGISTERED_OK});
            // res.status(200).send(courses);

        } catch (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },
    updateSchedule: async (req, res) => {

        try {
            await ST.transaction(async (t) => {

                    /**
                     * SOLO SE PUEDE MODIFICAR, SI NO SE A MATRICULADO NADIE EN ESTA APERTURA DE CURSO.
                     * @type {string}
                     * BUSCAMOS SI EXISTE UNA MATRICULA CON ESTA APERTURA DE CURSO.
                     */
                    let registrationCourse = await Registration_course.findAll({where: {id_schedule: req.params.id}}, {transaction: t});
                    if (registrationCourse.length >= 1) {

                        //ACTUALIZAMOS HORARIO
                        let tempSchedule = await Model.findByPk(req.params.id);
                        await tempSchedule.update({
                            end_date: req.body.end_date,
                            start_date: req.body.start_date,
                            end_date_acta: req.body.end_date_acta,
                        }, {transaction: t})
                        // throw {message: "Solo se edita la FECHA FIN, Ya que ya se han matriculado estudiantes al curso"};
                    } else {
                        let type = (req.body.type === 'Regular' || req.body.type === 'Extemporánea' || req.body.type === 'Curso desaprobado por Credito') ? 'R' :
                            (req.body.type === 'Curso dirigido Tesis' || req.body.type === 'Curso dirigido Otros') ? 'D' : 'A';

                        //ACTUALIZAMOS HORARIO
                        let tempSchedule = await Model.findByPk(req.params.id);
                        await tempSchedule.update({
                            id_course: req.body.id_course,
                            id_process: req.body.id_process,
                            group_class: req.body.group_class,
                            type_registration: type,
                            start_date: req.body.start_date,
                            end_date: req.body.end_date,
                            end_date_acta: req.body.end_date_acta,
                        }, {transaction: t})
                    }

                }
            );
            res.status(200).send({message: message.REGISTERED_OK});

        } catch
            (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },
    listScheduleByProgram: async (req, res) => {
        try {
            let data = await Model.findAll({
                attributes: ['id', 'group_class', 'type_registration', 'start_date', 'end_date', 'end_date_acta'],
                where: {id_program: req.params.id_program, id_process: req.params.id_process},
                include: [
                    {
                        attributes: ['id', 'denomination'],
                        model: Course,
                        as: 'Course',
                        include: {
                            attributes: ['id', 'ciclo'],
                            model: Ciclo,
                            as: 'Ciclo',
                            include: {
                                attributes: ['description'],
                                model: Plan,
                                as: 'Plan'
                            }
                        }
                    },
                    {
                        // attributes: ['id', 'denomination'],
                        model: Acta_book,
                        as: 'Acta_books'
                    }

                ]
            });
            res.status(200).send(data);

        } catch (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },

    listTeacherScheduleByProcessCourse: async (req, res) => {
        try {
            let data = await Model.findOne({
                attributes: ['id'],
                where: {id_course: req.params.id_course, id_process: req.params.id_process},
                include: {
                    required: true,
                    attributes: ['id'],
                    model: Teacher,
                    as: 'Teacher',
                    include: {
                        required: true,
                        attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                        model: Person,
                        as: 'Person'
                    }
                }
            });
            _data = data && data.Teacher && data.Teacher.Person.name ? data.Teacher.Person.name : 'DOCENTE NO REGISTRADO';
            res.status(200).send(_data);

        } catch (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },

    listScheduleAdmissionPlan: async (req, res) => {
        try {
            let registration = [];
            let data = [];
            let teacher
            let schedule
            await ST.transaction(async (t) => {
                    let registrationData = await Registration_course.findAll({
                        where: {id_schedule: req.params.id_schedule},
                        include: {
                            required: true,
                            attributes: ['id', 'type', 'created_at'],
                            model: Registration,
                            as: 'Registration',
                            include: {
                                required: true,
                                attributes: ['id', 'id_admission_plan'],
                                model: Student,
                                as: 'Student',
                                include: [
                                    {
                                        attributes: ['id', 'description'],
                                        model: Admission_plan,
                                        as: 'Admission_plan'
                                    },
                                    {
                                        required: true,
                                        attributes: ['document_number', 'email', 'photo', [Fn('CONCAT', Col('paternal'), ' ', Col('maternal'), ' ', Col('name')), 'name']],
                                        model: Person,
                                        as: 'Person'
                                    }
                                ]
                            }
                        },
                        order: [
                            [
                                {model: Registration, as: 'Registration'},
                                {model: Student, as: 'Student'},
                                {model: Person, as: 'Person'}, 'paternal', 'asc'
                            ]
                        ],

                    }, {transaction: t});
                    teacher = await Teacher.findOne({
                        where: {id_schedule: req.params.id_schedule, principal: true},
                        include: {
                            attributes: ['id', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                            model: Person, as: 'Person'
                        }
                    }, {transaction: t});
                    schedule = await Model.findOne({where: {id: req.params.id_schedule}}, {transaction: t});
                    for (let i = 0; i < registrationData.length; i++) {
                        registration.push({
                            "id_admission_plan": registrationData[i].Registration.Student.Admission_plan.id,
                            "admission_plan": registrationData[i].Registration.Student.Admission_plan.description,
                        })
                    }


                }
            );
            let set = new Set(registration.map(JSON.stringify))
            let plan = Array.from(set).map(JSON.parse);

            data = {
                'end_date': schedule.end_date ? schedule.end_date : 'No Def.',
                'id_teacher': teacher ? teacher.id : '',
                'teacher': teacher && teacher.Person ? teacher.Person.name : 'No Def.',
                'plan': plan
            }

            res.status(200).send(data);

        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err)
        }
    },
    listScheduleStundent: async (req, res) => {
        try {
            let registrationData = [];
            let registration = [];
            await ST.transaction(async (t) => {
                    registrationData = await Registration_course.findAll({
                        where: {id_schedule: req.params.id_schedule},
                        include: {
                            required: true,
                            attributes: ['id', 'type', 'created_at'],
                            model: Registration,
                            as: 'Registration',
                            include: {
                                required: true,
                                where: {
                                    id_admission_plan: req.params.id_admission_plan,
                                    [Op.or]: [
                                        {type: {[Op.eq]: "Estudiante"}},
                                        {type: {[Op.eq]: "Egresado"}},
                                    ]
                                },
                                attributes: ['id', 'id_admission_plan'],
                                model: Student,
                                as: 'Student',
                                include: [

                                    {
                                        required: true,
                                        attributes: ['document_number', 'email', 'photo', [Fn('CONCAT', Col('paternal'), ' ', Col('maternal'), ' ', Col('name')), 'name']],
                                        model: Person,
                                        as: 'Person'
                                    }
                                ]
                            }
                        },
                        order: [
                            [
                                {model: Registration, as: 'Registration'},
                                {model: Student, as: 'Student'},
                                {model: Person, as: 'Person'}, 'paternal', 'asc'
                            ]
                        ],

                    }, {transaction: t});
                    for (let i = 0; i < registrationData.length; i++) {
                        registration.push({
                            'id_registration_course': registrationData[i].id,
                            'registration_course_type': registrationData[i].type,
                            "registration_course_note": registrationData[i].note,
                            "registration_course_note_letter": await abox.numberToLetter(registrationData[i].note),
                            "registration_course_state": registrationData[i].state === 'Sin nota' ? true : false,
                            "id_registration": registrationData[i].Registration.id,
                            "registration_type": registrationData[i].Registration.type,
                            "registration_created_at": registrationData[i].Registration.created_at,
                            "id_student": registrationData[i].Registration.Student.id,
                            "id_person": registrationData[i].Registration.Student.Person.id,
                            "document_number": registrationData[i].Registration.Student.Person.document_number,
                            "email": registrationData[i].Registration.Student.Person.email,
                            "name": registrationData[i].Registration.Student.Person.name,
                            "photo": registrationData[i].Registration.Student.Person.photo,
                        })
                    }

                }
            );
            let set = new Set(registration.map(JSON.stringify))
            let arrSinDuplicaciones = Array.from(set).map(JSON.parse);
            res.status(200).send(arrSinDuplicaciones);

        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err)
        }
    },
    listRegistrationCourseStudentBySchedule: async (req, res) => {
        try {
            let registration = [];
            let registrationData = [];
            let data = [];
            let teacher
            let schedule
            await ST.transaction(async (t) => {
                    teacher = await Teacher.findOne({
                        where: {id_schedule: req.params.id_schedule, principal: true},
                        include: {
                            attributes: ['id', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                            model: Person, as: 'Person'
                        }
                    }, {transaction: t});
                    schedule = await Model.findOne({where: {id: req.params.id_schedule}}, {transaction: t});
                    registrationData = await Registration_course.findAll({
                        where: {id_schedule: req.params.id_schedule,state: {[Op.ne]: "Retirado"}},
                        // where: {id_schedule: req.params.id_schedule, id_course: schedule.id_course, state: {[Op.ne]: "Retirado"}},
                        include: {
                            required: true,
                            attributes: ['id', 'type', 'created_at'],
                            model: Registration,
                            as: 'Registration',
                            // where: {
                            //     [Op.or]: [
                            //         {state: {[Op.eq]: "Desertado"}},
                            //         {state: {[Op.eq]: "Egresado"}},
                            //     ]
                            // },
                            include: {
                                required: true,
                                attributes: ['id', 'id_admission_plan'],

                                model: Student,
                                as: 'Student',
                                include: {
                                    required: true,
                                    attributes: ['document_number', 'email', 'photo', [Fn('CONCAT', Col('paternal'), ' ', Col('maternal'), ' ', Col('name')), 'name']],
                                    model: Person,
                                    as: 'Person'
                                }
                            }
                        },
                        order: [
                            [
                                {model: Registration, as: 'Registration'},
                                {model: Student, as: 'Student'},
                                {model: Person, as: 'Person'}, 'paternal', 'asc'
                            ]
                        ],

                    }, {transaction: t});

                    for (let i = 0; i < registrationData.length; i++) {
                        registration.push({
                            'id_registration_course': registrationData[i].id,
                            'registration_course_type': registrationData[i].type,
                            "registration_course_note": registrationData[i].note,
                            "registration_course_note_letter": await abox.numberToLetter(registrationData[i].note),
                            "registration_course_state": registrationData[i].state === 'Sin nota' ? true : false,
                            "id_registration": registrationData[i].Registration.id,
                            "registration_type": registrationData[i].Registration.type,
                            "registration_created_at": registrationData[i].Registration.created_at,
                            "id_student": registrationData[i].Registration.Student.id,
                            "id_person": registrationData[i].Registration.Student.Person.id,
                            "document_number": registrationData[i].Registration.Student.Person.document_number,
                            "email": registrationData[i].Registration.Student.Person.email,
                            "name": registrationData[i].Registration.Student.Person.name,
                            "photo": registrationData[i].Registration.Student.Person.photo,
                        })
                    }

                }
            );


            data = {
                'end_date': schedule.end_date ? schedule.end_date : 'No Def.',
                'id_teacher': teacher ? teacher.id : '',
                'teacher': teacher && teacher.Person ? teacher.Person.name : 'No Def.',
                'students': registration
            }

            res.status(200).send(data);

        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err)
        }
    },
    listScheduleCourseByProgramProcess: async (req, res) => {
        /**
         * Lista los cursos del segun el proceso y programa
         */
        try {
            let data = await Model.findAll({
                attributes: ['id', 'type_registration', 'group_class'],
                where: {id_program: req.params.id_program, id_process: req.params.id_process},
                include: {
                    required:true,
                    attributes: ['id', 'order', 'denomination'],
                    model: Course,
                    as: 'Course',
                    include: {
                        attributes: ['ciclo'],
                        model: Ciclo,
                        as: 'Ciclo'
                    }
                }
            });

            res.status(200).send(data);

        } catch (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },
    retrieve: function (req, res) {
        return Model
            .findOne({
                where: {
                    id: {
                        [Op.eq]: req.params.id
                    }
                }
            })
            .then(record => {
                if (!record) return res.status(404).send({message: message.RECORD_NOT_FOUND});
                return res.status(200).send(record);
            })
            .catch(error => res.status(400).send(error));
    },


    destroySchedule: async (req, res) => {
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


                // let _data = await Model.findByPk(req.params.id)
                let acta = await Acta_book.findAll({where: {id_schedule: req.params.id}});
                let registrationCourse = await Registration_course.findAll({where: {id_schedule: req.params.id}});
                if (acta.length >= 1) throw {message: "No se puede eliminar, El acta del curso ha sido generada"};
                if (registrationCourse.length >= 1) throw {message: "No se puede eliminar, Ya se han matriculado estudiantes al curso"};

                await Teacher.destroy({where: {id_schedule: req.params.id}});
                await Horary.destroy({where: {id_schedule: req.params.id}});
                await Model.destroy({where: {id: req.params.id}});
                // await _data.destroy();

                m = message.DELETE_OK


            });
            res.status(200).send({message: m})
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
