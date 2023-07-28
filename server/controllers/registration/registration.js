const Sequelize = require("sequelize");
const message = require("../../messages");
const Op = Sequelize.Op;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const Model = require("../../models").Registration;
const Payment = require("../../models").Payment;
const Payment_detail = require("../../models").Payment_detail;
const Cost = require("../../models").Cost;
const Concepts = require("../../models").Concepts;
const Concept = require("../../models").Concept;
const Course = require("../../models").Course;
const Plan = require("../../models").Plan;
const Ciclo = require("../../models").Ciclo;
const Semester = require("../../models").Semester;
const Cost_admission_plan = require("../../models").Cost_admission_plan;
const Semester_mention = require("../../models").Semester_mention;
const Semester_activity = require("../../models").Semester_activity;
const Academic_semester = require("../../models").Academic_semester;
const Academic_calendar = require("../../models").Academic_calendar;
const Registration_course = require("../../models").Registration_course;
const Student = require("../../models").Student;
const Person = require("../../models").Person;
const Program = require("../../models").Programs;
const Admission_plan = require("../../models").Admission_plan;
const Student_document = require("../../models").Student_document;
const Student_discount = require("../../models").Student_discount;
const Document = require("../../models").Document;
const Discount = require("../../models").Discount;
const Uit = require("../../models").Uit;
const Schedule = require("../../models").Schedule;
const Teacher = require("../../models").Teacher;
const Acta_book = require("../../models").Acta_book;
const Horary = require("../../models").Horary;
const ST = Model.sequelize;
const Literal = Sequelize.literal;
const crypt = require("node-cryptex");
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
const moment = require("moment");
const abox = require("../Abox");
const generator = require("voucher-code-generator");
const { aprovedDesaproved } = require("../general/migrate");
module.exports = {
    // listRegistrationCourse: async (req, res) => {
    //     try {
    //         let approvedData = [];
    //         let approvedCourse = [];
    //         let registrationExist;
    //         let disapproved;
    //         let at;
    //         let courseRequerimentData = [];
    //         let ciclo;
    //         let courses = [];
    //         let finalCourse = [];
    //         let totalCourse = [];
    //         await ST.transaction(async (t) => {
    //                 console.log(req.body.id_student, req.body.id_plan)
    //
    //                 //Buscar si el estudiante al menos ha sio matriculado en al menos un curso
    //                 registrationExist = await Model.findAll({
    //                     where: {id_student: req.body.id_student}
    //                 });
    //                 if (registrationExist.length > 0) {
    //
    //                     disapproved = await Model.findAll({
    //                         attributes: ['id', 'id_semester', 'type'],
    //                         where: {id_student: req.body.id_student},
    //                         include: {
    //                             attributes: ['id', 'id_course', 'note', 'state'],
    //                             where: {note: {[Op.ne]: 13}},
    //                             model: Registration_course,
    //                             as: "Registration_course",
    //                         }
    //                     }, {transaction: true});
    //                     //Buscamos cursos aprobados
    //                     approvedData = await Model.findAll({
    //                         attributes: ['id', 'id_semester', 'type'],
    //                         where: {id_student: req.body.id_student},
    //                         include: {
    //                             attributes: ['id', 'id_course', 'note',  'state'],
    //                             //note>13
    //                             where: {note: {[Op.gte]: 13}},
    //                             model: Registration_course,
    //                             as: "Registration_course",
    //                         }
    //                     }, {transaction: true});
    //
    //                     //convertirmos la data en un solo array (approvedCourse)
    //                     approvedData.map(r =>
    //                         r.Registration_course.map(j =>
    //                             approvedCourse.push({
    //                                 "id": j.id,
    //                                 "id_course": j.id_course,
    //                                 "note": j.note,
    //                                 "state": j.state
    //                             })
    //                         )
    //                     )
    //
    //                     //Listamos todos los cursos que tiene un prerequisito => todos apartir del ciclo 2
    //                     courseRequerimentData = await Ciclo.findAll({
    //                         attributes: ['id', 'ciclo', 'period'],
    //                         where: {id_plan: req.body.id_plan, state: true},
    //                         include: {
    //                             attributes: ['id', 'abbreviation', 'area', 'code', 'order', 'credits', 'practical_hours', 'hours', 'requirements', 'type', 'denomination', "state"],
    //                             where: {state: true, requirements: {[Op.ne]: null}},
    //                             required: true,
    //                             model: Course,
    //                             as: "Course"
    //                         },
    //                         order: [[{model: Course, as: 'Course'}, 'order', 'asc']],
    //                     }, {transaction: t});
    //                     //Convertimos de text a json al campo id_requeriment
    //                     courseRequerimentData.map(r =>
    //                         r.Course.map(k => {
    //                                 at = k.requirements !== null ? JSON.parse(k.requirements) : [];
    //                                 courses.push({
    //                                     "id": k.id,
    //                                     "ciclo": r.ciclo,
    //                                     "abbreviation": k.abbreviation,
    //                                     "area": k.area,
    //                                     "code": k.code,
    //                                     "order": k.order,
    //                                     "credits": k.credits,
    //                                     "practical_hours": k.practical_hours,
    //                                     "hours": k.hours,
    //                                     "requirements": at,
    //                                     "type": k.type,
    //                                     "note": 0,
    //                                     "denomination": k.denomination,
    //                                     "state": false,
    //
    //                                 })
    //                             }
    //                         )
    //                     );
    //
    //                     //Selecionamos los cursos de acuerdo a los prerequisitos aprobados
    //
    //                     for (let i = 0; i < courses.length; i++) { //Recorremos los cursos
    //                         let match = 0;//contador de coincidencias
    //                         for (let j = 0; j < courses[i].requirements.length; j++) { //Recorremos los prerequisitos
    //
    //
    //                             for (let k = 0; k < approvedCourse.length; k++) {//Recorremos los cursos aprobados
    //                                 if (approvedCourse[k].id_course === courses[i].requirements[j].value) {//Buscamos coincidencias
    //                                     match = match + 1;
    //                                 }
    //                             }
    //                             if (courses[i].requirements.length === j + 1) {//Pregunta si es el ultimo recorrido
    //                                 //Pregunta si la cantidad si la cantidad de cursos aprobados es la misma que la de los requisitos
    //                                 //Si se cumple la condicion se añade el curso al array temporal
    //                                 if (courses[i].requirements.length === match) {
    //                                     totalCourse.push(courses[i]);
    //                                 }
    //
    //                             }
    //
    //
    //                         }
    //                     }
    //
    //                     //Filtramos los cursos que no tienen prerequisitos segun el ciclo mayor
    //
    //                     //Recorremos el (totalCourse), y seleccionamos los cursos que no han sido registrados
    //                     //en Registration_course... descartamos los demas por que ya han sido aprobados
    //                     for (let i = 0; i < totalCourse.length; i++) {
    //                         let otherCourse = [];
    //                         otherCourse = await Model.findAll({
    //                             where: {id_student: req.body.id_student},
    //                             include: {
    //                                 where: {id_course: totalCourse[i].id},
    //                                 model: Registration_course,
    //                                 as: "Registration_course"
    //                             }
    //                         }, {transaction: true})
    //                         if (otherCourse.length === 0) {
    //                             finalCourse.push(totalCourse[i])
    //                         }
    //                     }
    //                     //Buscamos el ciclo mayor de los registros para buscar los cursos que no tienen requisitos
    //                     let cicle = await finalCourse.reduce((a, b) => {
    //                         return (a.cicle > b.cicle ? a.ciclo : b.ciclo)
    //                     });
    //                     let otherCourse = await Ciclo.findAll({
    //                         attributes: ['id', 'ciclo', 'period'],
    //                         where: {id_plan: req.body.id_plan, ciclo: cicle, state: true},
    //                         include: {
    //                             attributes: ['id', 'abbreviation', 'area', 'code', 'order', 'credits', 'practical_hours', 'hours', 'requirements', 'type', 'denomination', "state"],
    //                             where: {state: true, requirements: null},
    //                             required: false,
    //                             model: Course,
    //                             as: "Course"
    //                         },
    //                         order: [[{model: Course, as: 'Course'}, 'order', 'asc']],
    //                     }, {transaction: t});
    //
    //                     otherCourse.map(r =>
    //                         r.Course.map(k =>
    //                             finalCourse.push({
    //                                 "id": k.id,
    //                                 "ciclo": r.ciclo,
    //                                 "abbreviation": k.abbreviation,
    //                                 "area": k.area,
    //                                 "code": k.code,
    //                                 "order": k.order,
    //                                 "credits": k.credits,
    //                                 "practical_hours": k.practical_hours,
    //                                 "hours": k.hours,
    //                                 "requirements": k.requirements,
    //                                 "type": k.type,
    //                                 "note": 0,
    //                                 "denomination": k.denomination,
    //                                 "state": false,
    //                             })
    //                         )
    //                     );
    //
    //                 } else {
    //
    //                     //Cursos del primer ciclo
    //                     ciclo = await Ciclo.findAll({
    //                         attributes: ['id', 'ciclo', 'period'],
    //                         where: {id_plan: req.body.id_plan, ciclo: "I", state: true},
    //                         include: {
    //                             attributes: ['id', 'abbreviation', 'area', 'code', 'order', 'credits', 'practical_hours', 'hours', 'requirements', 'type', 'denomination', "state"],
    //                             where: {state: true},
    //                             required: false,
    //                             model: Course,
    //                             as: "Course"
    //                         },
    //                         order: [[{model: Course, as: 'Course'}, 'order', 'asc']],
    //                     }, {transaction: t});
    //                     ciclo.map(r =>
    //                         r.Course.map(k =>
    //                             k.requirements === null && finalCourse.push({
    //                                 "id": k.id,
    //                                 "ciclo": r.ciclo,
    //                                 "abbreviation": k.abbreviation,
    //                                 "area": k.area,
    //                                 "code": k.code,
    //                                 "order": k.order,
    //                                 "credits": k.credits,
    //                                 "practical_hours": k.practical_hours,
    //                                 "hours": k.hours,
    //                                 "requirements": k.requirements,
    //                                 "type": k.type,
    //                                 "note": 0,
    //                                 "denomination": k.denomination,
    //                                 "state": false,
    //                             })
    //                         )
    //                     );
    //                 }
    //
    //
    //             }
    //         );
    //         res.status(200).send(finalCourse);
    //
    //     } catch (err) {
    //         // Rollback transaction if any errors were encountered
    //         console.log(err);
    //         res.status(445).send(err)
    //     }
    // },

    //cursos del modal para seleccionar
    listRegistrationCourse: async (req, res) => {
        try {
            let schedule;
            let ciclo = [];
            let restCourse = [];
            let finalCourse = [];
            let approvedData = [];
            let approvedCourse = [];
            let totalCourse = [];

            await ST.transaction(async (t) => {
                //CONSULTAMOS EL PLAN DE ESTUDIO ES CORRECTO
                const plan = await Plan.findByPk(req.body.id_plan);
                //*Resumen
                //Obtenemos el listado completo de los cursos
                //Obtenemos el total de cursos aprobados

                //*//
                // OBTENEMOS EL LISTADO DE TODOS LOS CURSOS SEGUN EL PLAN
                ciclo = await Schedule.findAll(
                    {
                        where: {
                            id_process: req.body.id_process,
                            type_registration: req.body.type_registration,
                        },
                        include: [
                            {
                                attributes: ["id", "principal"],
                                model: Teacher,
                                as: "Teachers",
                                include: [
                                    {
                                        attributes: [
                                            [
                                                Fn(
                                                    "CONCAT",
                                                    Col("name"),
                                                    " ",
                                                    Col("paternal"),
                                                    " ",
                                                    Col("maternal")
                                                ),
                                                "name",
                                            ],
                                        ],
                                        model: Person,
                                        as: "Person",
                                    },
                                    {
                                        attributes: [
                                            "ambient",
                                            "days",
                                            "end_time",
                                            "start_time",
                                        ],
                                        model: Horary,
                                        as: "Horarys",
                                    },
                                ],
                            },

                            {
                                required: true,
                                model: Course,
                                as: "Course",
                                include: {
                                    required: true,
                                    where: { id_plan: req.body.id_plan },
                                    attributes: ["id", "ciclo", "period"],
                                    model: Ciclo,
                                    as: "Ciclo",
                                },
                            },
                        ],
                        order: [
                            [{ model: Course, as: "Course" }, "order", "asc"],
                        ],
                    },
                    { transaction: t }
                );

                ciclo.map((r) =>
                    totalCourse.push({
                        id: r.id_course,
                        id_schedule: r.id,
                        ciclo: r.Course.Ciclo.ciclo,
                        abbreviation: r.Course.abbreviation,
                        area: r.Course.area,
                        code: r.Course.code,
                        order: r.Course.order,
                        credits: r.Course.credits,
                        practical_hours: r.Course.practical_hours,
                        hours: r.Course.hours,
                        requirements: JSON.parse(r.Course.requirements),
                        type: r.Course.type,
                        note: 0,
                        note_state: false,
                        denomination: r.Course.denomination,
                        state: false,
                        group: r.group_class,
                        teachers: r.Teachers.length > 0 ? r.Teachers : [],
                    })
                );
                /////////
                //Obtenemos los todos los cursos aprovados por el estudiante
                approvedData = await Model.findAll(
                    {
                        attributes: ["id", "id_semester", "type"],
                        where: { id_student: req.body.id_student },
                        include: {
                            attributes: ["id", "id_course", "note", "state"],
                            //note>=14 &&
                            where: {
                                note: { [Op.gte]: 14 },
                                state: "Aprobado",
                            },
                            model: Registration_course,
                            as: "Registration_course",
                        },
                    },
                    { transaction: true }
                );
                //convertirmos la data en un solo array (approvedCourse)
                approvedData.map((r) =>
                    r.Registration_course.map((j) =>
                        approvedCourse.push({
                            id: j.id,
                            id_course: j.id_course,
                            note: j.note,
                            state: j.state,
                        })
                    )
                );
                //RECORREMOS EL TOTAL DE CURSOS

                for (let i = 0; i < totalCourse.length; i++) {
                    //Recorremos el array de cursos aprobados y pushing los cursos que no han sido aprobados
                    let match = false;
                    for (let j = 0; j < approvedCourse.length; j++) {
                        if (approvedCourse[j].id_course === totalCourse[i].id) {
                            match = true;
                            break;
                        }
                    }
                    if (match === false) {
                        restCourse.push(totalCourse[i]);
                    }
                }

                if (plan.mesh === false) {
                    finalCourse = restCourse;
                } else {
                    // obtenemos los cursos que tinen prerequisitos
                    for (let i = 0; i < approvedCourse.length; i++) {
                        for (let j = 0; j < restCourse.length; j++) {
                            // recorremos los requisitos
                            // console.log(JSON.parse(restCourse[j].requirements))
                            if (restCourse[j].requirements) {
                                for (
                                    let k = 0;
                                    k < restCourse[j].requirements.length;
                                    k++
                                ) {
                                    // preguntamos si el curso apronvado esta dentro de los requerimientos
                                    // y solo cargamos esos dichos cursos
                                    if (
                                        restCourse[j].requirements[k].value ===
                                        approvedCourse[i].id_course
                                    ) {
                                        finalCourse.push(restCourse[j]);
                                    }
                                }
                            }
                        }
                    }
                }
            });
            res.status(200).send(finalCourse);
            // res.status(200).send({ciclo, approvedData});
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    listSeeRequirement: async (req, res) => {
        try {
            let records;
            let data = [];
            let text = "";

            await ST.transaction(async (t) => {
                records = await Course.findByPk(req.params.id_course);
                console.log(records.requirements);
                if (records.requirements !== null) {
                    data = JSON.parse(records.requirements);
                    if (data.length > 0) {
                        data.map((r) => (text = text + r.order + " / "));
                    }
                } else {
                    text = "Ninguno";
                }
            });
            res.status(200).send(text);
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    //lista los curso de index matricuala
    listRegistrationCourseStudent: async (req, res) => {
        try {
            let registrationData;
            let registration = [];
            await ST.transaction(async (t) => {
                registrationData = await Model.findAll(
                    {
                        attributes: [
                            "id",
                            "id_semester",
                            "type",
                            "state",
                            "created_at",
                            "deleted_at",
                        ],
                        where: { id_student: req.params.id_student },
                        include: [
                            {
                                required: true,
                                attributes: ["id", "denomination"],
                                model: Academic_semester,
                                as: "Academic_semester",
                                include: {
                                    attributes: ["id", "denomination"],
                                    model: Academic_calendar,
                                    as: "Academic_calendar",
                                },
                            },
                            {
                                //como existen varios conceptos en id registration..... matricula ... pension de enseñansa ... y toma cualqueira
                                //por eso la condicion
                                required: true,
                                where: { denomination: "Matrícula" },
                                attributes: ["id", "amount"],
                                model: Payment,
                                as: "Payment",
                                include: {
                                    attributes: ["id", "denomination"],
                                    model: Concept,
                                    as: "Concept",
                                },
                            },
                            {
                                required: true,
                                attributes: [
                                    "id",
                                    "id_course",
                                    "id_schedule",
                                    "note",
                                    "type_course",
                                    "state",
                                ],
                                model: Registration_course,
                                as: "Registration_course",
                                include: {
                                    attributes: [
                                        "id",
                                        "id_ciclo",
                                        "denomination",
                                        "order",
                                        "credits",
                                        "type",
                                        "state",
                                        "code",
                                    ],
                                    model: Course,
                                    as: "Course",
                                    include: {
                                        // attributes: ['ciclo'],
                                        model: Ciclo,
                                        as: "Ciclo",
                                    },
                                },
                            },
                        ],
                        order: [
                            ["created_at", "desc"],
                            [
                                {
                                    model: Registration_course,
                                    as: "Registration_course",
                                },
                                { model: Course, as: "Course" },
                                "order",
                                "asc",
                            ],
                        ],
                    },
                    { transaction: t }
                );
                for (let i = 0; i < registrationData.length; i++) {
                    registration.push({
                        id: registrationData[i].id,
                        id_semester: registrationData[i].id_semester,
                        type: registrationData[i].type,
                        state: registrationData[i].state,
                        deleted_at: registrationData[i].deleted_at,
                        created_at: registrationData[i].created_at,
                        Academic_semester: {
                            id: registrationData[i].Academic_semester.id,
                            denomination:
                                registrationData[
                                    i
                                ].Academic_semester.denomination.substr(-2),
                            Academic_calendar: {
                                id: registrationData[i].Academic_semester
                                    .Academic_calendar.id,
                                denomination:
                                    registrationData[
                                        i
                                    ].Academic_semester.Academic_calendar.denomination.substr(
                                        -4
                                    ),
                            },
                        },
                        Payment: {
                            id: registrationData[i].Payment.id,
                            amount: registrationData[i].Payment.amount,
                            Concept: {
                                id: registrationData[i].Payment.Concept.id,
                                denomination:
                                    registrationData[i].Payment.Concept
                                        .denomination,
                            },
                        },
                        Registration_course: [],
                    });
                    for (
                        let j = 0;
                        j < registrationData[i].Registration_course.length;
                        j++
                    ) {
                        registration[i].Registration_course.push({
                            id: registrationData[i].Registration_course[j]
                                .Course.id,
                            denomination:
                                registrationData[i].Registration_course[j]
                                    .Course.denomination,
                            order: registrationData[i].Registration_course[j]
                                .Course.order,
                            credits:
                                registrationData[i].Registration_course[j]
                                    .Course.credits,
                            type_course:
                                registrationData[i].Registration_course[j]
                                    .Course.type,
                            type_registration_course:
                                registrationData[i].Registration_course[j]
                                    .type_course,
                            ciclo: registrationData[i].Registration_course[j]
                                .Course.Ciclo.ciclo,
                            state: true,
                            note_state:
                                registrationData[i].Registration_course[j]
                                    .state === "Sin nota"
                                    ? true
                                    : false, //genero este estado para poder manejar mejor en la vista
                            //registration table
                            id_registration:
                                registrationData[i].Registration_course[j].id,
                            id_schedule:
                                registrationData[i].Registration_course[j]
                                    .id_schedule,
                            note: registrationData[i].Registration_course[j]
                                .note,
                            state_registration_course:
                                registrationData[i].Registration_course[j]
                                    .state,
                            code: registrationData[i].Registration_course[j]
                                .Course.code,
                        });
                    }
                }
            });
            res.status(200).send(registration);
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },

    listRegistrationRetirement: async (req, res) => {
        try {
            let registrationData = [];
            let registration = [];
            await ST.transaction(async (t) => {
                registrationData = await Model.findAll(
                    {
                        attributes: ["id", "type", "state"],
                        where: {
                            id_student: req.params.id_student,
                            state: { [Op.like]: "%Retirado%" },
                        },
                        include: [
                            {
                                attributes: ["id", "denomination"],
                                model: Academic_semester,
                                as: "Academic_semester",
                                include: {
                                    attributes: ["id", "denomination"],
                                    model: Academic_calendar,
                                    as: "Academic_calendar",
                                },
                            },
                            {
                                //como existen varios conceptos en id registration..... matricula ... pension de enseñansa ... y toma cualqueira
                                //por eso la condicion
                                where: { denomination: "Matrícula" },
                                attributes: ["id", "amount"],
                                model: Payment,
                                as: "Payment",
                                include: {
                                    attributes: ["id", "denomination"],
                                    model: Concept,
                                    as: "Concept",
                                },
                            },
                            {
                                // required: true,
                                attributes: ["id"],
                                model: Student_document,
                                as: "Student_document",
                                include: {
                                    attributes: ["id", "topic", "archive"],
                                    model: Document,
                                    as: "Document",
                                },
                            },
                        ],
                        order: [["created_at", "desc"]],
                    },
                    { transaction: t }
                );
                console.log(registrationData);
                for (let i = 0; i < registrationData.length; i++) {
                    registration.push({
                        id: registrationData[i].id,
                        type: registrationData[i].type,
                        state: registrationData[i].state,
                        id_academic_semester:
                            registrationData[i].Academic_semester.id,
                        academic_semester_denomination:
                            registrationData[
                                i
                            ].Academic_semester.denomination.substr(-1),
                        academic_calendar_denomination:
                            registrationData[
                                i
                            ].Academic_semester.Academic_calendar.denomination.substr(
                                -4
                            ),
                        id_payment: registrationData[i].Payment.id,
                        payment_concept_denomination:
                            registrationData[i].Payment.Concept.denomination,
                        id_payment_concept:
                            registrationData[i].Payment.Concept.id,
                        id_student_document:
                            registrationData[i].Student_document.id,
                        id_document:
                            registrationData[i].Student_document.Document.id,
                        document_archive:
                            registrationData[i].Student_document.Document
                                .archive,
                        document_topic:
                            registrationData[i].Student_document.Document.topic,
                    });
                }
            });

            res.status(200).send(registration);
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },

    listRegistrationByOrganicUnitSemester: async (req, res) => {
        try {
            let records = await Model.findAll({
                attributes: ["type", "state", "created_at", "updated_at"],
                where: {
                    id_semester: req.params.id_process,
                    id_organic_unit: req.body.id_organic_unit,
                },
                include: [
                    {
                        required: true,
                        attributes: ["state"],
                        model: Student,
                        as: "Student",
                        include: [
                            {
                                attributes: [
                                    "id",
                                    "document_number",
                                    "email",
                                    [
                                        Fn(
                                            "CONCAT",
                                            Col("paternal"),
                                            " ",
                                            Col("maternal"),
                                            " ",
                                            Col("name")
                                        ),
                                        "name",
                                    ],
                                ],
                                model: Person,
                                as: "Person",
                            },
                            {
                                required: true,
                                attributes: ["id", "description"],
                                model: Admission_plan,
                                as: "Admission_plan",
                            },
                        ],
                    },
                    {
                        required: true,
                        attributes: ["id", "denomination", "state"],
                        model: Program,
                        as: "Program",
                    },
                ],
                order: [
                    [
                        { model: Student, as: "Student" },
                        { model: Person, as: "Person" },
                        "paternal",
                        "asc",
                    ],
                ],
            });

            res.status(200).send(records);
        } catch (err) {
            console.log(err);
            res.status(445).send(err);
        }
    },
    listUltimateRegistrationCourseStudent: async (req, res) => {
        try {
            let registrationData;
            let registration = [];
            await ST.transaction(async (t) => {
                registrationData = await Model.findAll(
                    {
                        attributes: ["id", "id_semester", "type", "state"],
                        where: {
                            id_student: req.params.id_student,
                            [Op.or]: [
                                { type: { [Op.eq]: "Extemporánea" } },
                                { type: { [Op.eq]: "Regular" } },
                            ],
                        },

                        include: [
                            {
                                attributes: ["id", "denomination"],
                                model: Academic_semester,
                                as: "Academic_semester",
                                include: {
                                    attributes: ["id", "denomination"],
                                    model: Academic_calendar,
                                    as: "Academic_calendar",
                                },
                            },
                            {
                                //como existen varios conceptos en id registration..... matricula ... pension de enseñansa ... y toma cualqueira
                                //por eso la condicion
                                where: { denomination: "Matrícula" },
                                attributes: ["id", "amount"],
                                model: Payment,
                                as: "Payment",
                                include: {
                                    attributes: ["id", "denomination"],
                                    model: Concept,
                                    as: "Concept",
                                },
                            },
                            {
                                attributes: [
                                    "id",
                                    "id_course",
                                    "id_schedule",
                                    "note",
                                    "state",
                                ],
                                model: Registration_course,
                                as: "Registration_course",
                                include: {
                                    attributes: [
                                        "id",
                                        "id_ciclo",
                                        "denomination",
                                        "order",
                                        "credits",
                                        "state",
                                    ],
                                    model: Course,
                                    as: "Course",
                                    include: {
                                        attributes: ["ciclo"],
                                        model: Ciclo,
                                        as: "Ciclo",
                                    },
                                },
                            },
                        ],

                        order: [
                            ["created_at", "desc"],
                            [
                                {
                                    model: Registration_course,
                                    as: "Registration_course",
                                },
                                { model: Course, as: "Course" },
                                "order",
                                "asc",
                            ],
                        ],
                    },
                    { transaction: t }
                );
                for (let i = 0; i < registrationData.length; i++) {
                    registration.push({
                        id: registrationData[i].id,
                        id_semester: registrationData[i].id_semester,
                        type: registrationData[i].type,
                        state: registrationData[i].state,
                        Academic_semester: {
                            id: registrationData[i].Academic_semester.id,
                            denomination:
                                registrationData[i].Academic_semester
                                    .denomination,
                            Academic_calendar: {
                                id: registrationData[i].Academic_semester
                                    .Academic_calendar.id,
                                denomination:
                                    registrationData[
                                        i
                                    ].Academic_semester.Academic_calendar.denomination.substr(
                                        -4
                                    ),
                            },
                        },
                        Payment: {
                            id: registrationData[i].Payment.id,
                            amount: registrationData[i].Payment.amount,
                            Concept: {
                                id: registrationData[i].Payment.Concept.id,
                                denomination:
                                    registrationData[i].Payment.Concept
                                        .denomination,
                            },
                        },
                        Registration_course: [],
                    });
                    for (
                        let j = 0;
                        j < registrationData[i].Registration_course.length;
                        j++
                    ) {
                        registration[i].Registration_course.push({
                            id: registrationData[i].Registration_course[j]
                                .Course.id,
                            denomination:
                                registrationData[i].Registration_course[j]
                                    .Course.denomination,
                            order: registrationData[i].Registration_course[j]
                                .Course.order,
                            credits:
                                registrationData[i].Registration_course[j]
                                    .Course.credits,
                            ciclo: registrationData[i].Registration_course[j]
                                .Course.Ciclo.ciclo,
                            state: true,
                            note_state:
                                registrationData[i].Registration_course[j]
                                    .state === "Sin nota"
                                    ? true
                                    : false, //genero este estado para poder manejar mejor en la vista
                            //registration table
                            id_registration:
                                registrationData[i].Registration_course[j].id,
                            id_schedule:
                                registrationData[i].Registration_course[j]
                                    .id_schedule,
                            note: registrationData[i].Registration_course[j]
                                .note,
                            type: registrationData[i].Registration_course[j]
                                .state,
                        });
                    }
                }
            });
            res.status(200).send(registration[0]);
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    createRegistration: async (req, res) => {
        try {
            let totalDiscount = 0,
                discounts = [];
            await ST.transaction(async (t) => {
                //BUSCAMOS SI YA SE MATRICULO EN ESTE SEMESTRE SOLO CUANDO ES REGULAR Y EXTEMPORANEA NO PUEDE
                // MATRICULARSE DOS VECES EN EL MISMOS SEMESTRE
                if (
                    req.body.type === "Regular" ||
                    req.body.type === "Extemporánea"
                ) {
                    let existRegistration = await Model.findOne(
                        {
                            where: {
                                id_semester: req.body.id_process,
                                id_student: req.body.id_student,
                                type: req.body.type,
                                id_program: req.body.id_program,
                                id_organic_unit: req.body.id_organic_unit,
                            },
                        },
                        { transaction: t }
                    );
                    if (existRegistration) {
                        throw { message: "Ya se registro en este semestre" };
                    }
                }

                //REGISTRAMOS LA MATRICULA
                let maxRegistrationID = await Model.max(
                    "id",
                    { paranoid: false },
                    { transaction: t }
                );
                let registration = await Model.create(
                    {
                        id: maxRegistrationID + 1,
                        id_semester: req.body.id_process,
                        id_student: req.body.id_student,
                        type: req.body.type,
                        id_program: req.body.id_program,
                        id_organic_unit: req.body.id_organic_unit,
                        observation: req.body.observation || null,
                        state: "Pendiente",
                    },
                    { transaction: t }
                );

                if (!registration) {
                    throw "No ha seleccionado ningun curso";
                } else {
                    //REGISTRAM EL CONCEPTO DE PAGO MATRICULA
                    let maxPaymentID = await Payment.max(
                        "id",
                        { paranoid: false },
                        { transaction: t }
                    );
                    await Payment.create(
                        {
                            id: maxPaymentID + 1,
                            id_student: req.body.id_student,
                            id_program: req.body.id_program,
                            id_organic_unit: req.body.id_organic_unit,
                            id_registration: registration.id,
                            id_concept: req.body.id_concept,
                            id_semester: req.body.id_process,
                            type: "Pendiente",
                            payment_date: "",
                            orderNumber: 1,
                            denomination: "Matrícula",
                            amount: req.body.amount,
                        },
                        { transaction: t }
                    );

                    //CONSULTAMOS LOS COSTOS DE ADMISION - PENSION
                    let pensionCost = await Cost_admission_plan.findOne(
                        {
                            where: {
                                id_admission_plan: req.body.id_admission_plan,
                            },
                            include: {
                                attributes: ["denomination"],
                                where: {
                                    denomination: {
                                        [Op.like]: "%" + "Pensión " + "%",
                                    },
                                },
                                model: Concept,
                                as: "Concept",
                            },
                        },
                        { transaction: t }
                    );
                    //CONSULTAMOS LOS COSTOS DE MATRÍCULA PARA OBTENER LA CANTIDAD DE MATRICULAS
                    let matriculaCost = await Cost_admission_plan.findOne(
                        {
                            where: {
                                id_admission_plan: req.body.id_admission_plan,
                            },
                            include: {
                                attributes: ["denomination"],
                                where: {
                                    denomination: {
                                        [Op.like]: "%" + "Matrícula " + "%",
                                    },
                                },
                                model: Concept,
                                as: "Concept",
                            },
                        },
                        { transaction: t }
                    );
                    //PREGUNTAMOS SI EL ESTUDIANTE TIENE DESCUENTO
                    discounts = await Student_discount.findAll(
                        {
                            where: { id_student: req.body.id_student },
                            include: {
                                attributes: ["id", "amount"],
                                model: Discount,
                                as: "Discount",
                            },
                        },
                        { transaction: t }
                    );
                    discounts.map(
                        (r) =>
                            (totalDiscount =
                                totalDiscount + parseFloat(r.Discount.amount))
                    );
                    //APLICAMOS DESCUENTO SI EL TOTAL DISCOUTN ES MAYOR A CERO
                    let pensionCostAmount =
                        totalDiscount > 0
                            ? pensionCost.amount -
                              (pensionCost.amount * totalDiscount) / 100
                            : pensionCost.amount;
                    let totalPension = pensionCost.cant / matriculaCost.cant;
                    let tempPension = [];
                    if (totalPension < 1)
                        throw "No ha registrado correctamente los costos de admisión";

                    // BUSCAMOS EL NUMERO DE ORDEN DE ACUERDO A LA ULTIMA PENSION SEGUN EL ID Y EL MAYOR NUMERO
                    let endNumberPension = await Payment.max(
                        "order_number",
                        {
                            where: {
                                id_student: req.body.id_student,
                                id_concept: pensionCost.id_concept,
                            },
                        },
                        { transaction: t }
                    );

                    let _orderNumberPension = 0;
                    if (isNaN(endNumberPension)) {
                        console.log("indefinido");
                    } else {
                        _orderNumberPension = endNumberPension;
                    }
                    //GENERARMOS LAS FECHAS DE PAGO SEGUN EL CALENDARIO ACADEMICO
                    let durationClass = await Semester_activity.findOne({
                        where: {
                            id_activity: 8,
                            id_program: req.body.id_program,
                            id_academic_semester: req.body.id_process,
                        },
                    });
                    if (!durationClass) {
                        throw "No se ha registro el calendario academico La Fecha de inicio y Fin";
                    }
                    const startDateClass = moment(durationClass.date_start);
                    const endDateClass = moment(durationClass.date_end);
                    let totalDayClass = endDateClass.diff(
                        startDateClass,
                        "days"
                    );
                    let incrementDay = Math.round(totalDayClass / totalPension);

                    //REGISTRAMOS LOS CONCEPTOS DE PENSION
                    let tempIncrementDay = moment(startDateClass).add(
                        incrementDay,
                        "days"
                    );
                    if (
                        req.body.type === "Regular" ||
                        req.body.type === "Extemporánea"
                    ) {
                        for (let i = 1; i <= totalPension; i++) {
                            let pensionCreate = await Payment.create(
                                {
                                    id: maxPaymentID + 1 + i,
                                    id_student: req.body.id_student,
                                    id_program: req.body.id_program,
                                    id_organic_unit: req.body.id_organic_unit,
                                    id_registration: registration.id,
                                    id_concept: pensionCost.id_concept,
                                    id_semester: req.body.id_process,
                                    type: "Pendiente",
                                    //PENDIENTE DE ACTUALIZACION PARA FIJAR FECHA DE PAGO
                                    payment_date:
                                        moment(tempIncrementDay).format(
                                            "YYYY-MM-DD"
                                        ),
                                    order_number: _orderNumberPension + i,
                                    denomination: "Pensión",
                                    amount: pensionCostAmount,
                                },
                                { transaction: t }
                            );
                            tempPension.push(pensionCreate);
                            tempIncrementDay = moment(tempIncrementDay).add(
                                incrementDay,
                                "days"
                            );
                        }

                        // throw "No ha registrado correctamente los costos de admisión" + totalDayClass;
                        await Promise.all(tempPension);
                    }

                    //REGISTRAMOS LOS CURSOS

                    let dataCourse = JSON.parse(req.body.courses);
                    let tempRegistrationCourse = [];
                    for (let i = 0; i < dataCourse.length; i++) {
                        let maxRegistrationCourseID =
                            await Registration_course.max(
                                "id",
                                { paranoid: false },
                                { transaction: t }
                            );

                        let state =
                            dataCourse[i].note >= 14
                                ? "Aprobado"
                                : "Desaprobado";
                        let typeCourse =
                            req.body.type === "Regular" ||
                            req.body.type === "Extemporánea" ||
                            req.body.type === "Curso desaprobado por Credito"
                                ? "R"
                                : req.body.type === "Curso dirigido Tesis" ||
                                  req.body.type === "Curso dirigido Otros"
                                ? "D"
                                : "A";

                        let registrationCourseCreate =
                            await Registration_course.create(
                                {
                                    id: maxRegistrationCourseID + 1 + i,
                                    id_registration: registration.id,
                                    id_schedule: dataCourse[i].id_schedule,
                                    id_course: dataCourse[i].id,
                                    type_course: typeCourse,
                                    note: dataCourse[i].note,
                                    state: state,
                                },
                                { transaction: t }
                            );
                        tempRegistrationCourse.push(registrationCourseCreate);
                    }
                    await Promise.all(tempRegistrationCourse);
                }
            });
            res.status(200).send({ message: message.REGISTERED_OK });
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    updateRegistration: async (req, res) => {
        try {
            let registrationCourseCreate;
            let registartionData;
            let course;
            let paymentData;
            let paymentDataPension;
            let tempRegistrationCourse = [];
            let arrayPension = [];
            await ST.transaction(async (t) => {
                registartionData = await Model.findByPk(req.params.id);
                await registartionData.update(
                    {
                        id_semester: req.body.id_process,
                        type: req.body.type,
                    },
                    { transaction: t }
                );

                //actualizamos el concepto en la tabla payment de matricula
                paymentData = await Payment.findOne({
                    where: {
                        id_registration: req.params.id,
                        denomination: "Matrícula",
                    },
                });
                await paymentData.update(
                    {
                        id_concept: req.body.id_concept,
                        id_semester: req.body.id_process,
                        type: "Pendiente",
                        amount: req.body.amount,
                    },
                    { transaction: t }
                );

                //actualizamos el concepto en la tabla payment de matricula
                paymentDataPension = await Payment.findAll(
                    {
                        where: {
                            id_registration: req.params.id,
                            denomination: "Pensión",
                        },
                    },
                    { transaction: t }
                );

                let pensionData = paymentDataPension.length;
                let tempPension;
                for (let i = 0; i < pensionData; i++) {
                    tempPension = await paymentDataPension[i].update(
                        {
                            id_semester: req.body.id_process,
                        },
                        { transaction: t }
                    );
                    arrayPension.push(tempPension);
                }
                await Promise.all(arrayPension);
                //CURSOS ACTUALIZACION
                let dataCourse = JSON.parse(req.body.courses);

                for (let i = 0; i < dataCourse.length; i++) {
                    course = await Registration_course.findOne({
                        where: {
                            id_registration: req.params.id,
                            id_course: dataCourse[i].id,
                        },
                    });
                    let state =
                        dataCourse[i].note >= 14 ? "Aprobado" : "Desaprobado";

                    registrationCourseCreate = await course.update(
                        {
                            note: dataCourse[i].note,
                            state: state,
                        },
                        { transaction: t }
                    );
                    tempRegistrationCourse.push(registrationCourseCreate);
                }
                await Promise.all(tempRegistrationCourse);
            });
            res.status(200).send({ message: message.UPDATED_OK });
            // res.status(200).send(courseDestroy);
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    destroyRegistration: async (req, res) => {
        try {
            let registartionData;
            let coursesData;
            let tempDeleteCourse;

            await ST.transaction(async (t) => {
                //Buscamo si en algun curso ya se genero el acta de notas
                let acta = await Registration_course.findAll(
                    {
                        where: { id_registration: req.params.id },
                        include: {
                            model: Schedule,
                            as: "Schedule",
                            include: {
                                model: Acta_book,
                                as: "Acta_book",
                            },
                        },
                    },
                    { transaction: t }
                );
                for (let i = 0; i < acta.length; i++) {
                    if (acta[i].Schedule) {
                        if (acta[i].Schedule.Acta_book)
                            throw {
                                message:
                                    "No se puede Eliminar, Ya se genero acta del curso " +
                                    acta[i].id,
                            };
                    }
                }
                await Model.destroy(
                    { where: { id: req.params.id } },
                    { transaction: t }
                );
                await Registration_course.destroy(
                    { where: { id_registration: req.params.id } },
                    { transaction: t }
                );
                await Payment.destroy(
                    {
                        where: {
                            id_registration: req.params.id,
                            denomination: "Matrícula",
                        },
                    },
                    { transaction: t }
                );
                await Payment.destroy(
                    {
                        where: {
                            id_registration: req.params.id,
                            denomination: "Pensión",
                        },
                    },
                    { transaction: t }
                );

                // res.status(200).send(acta);
            });

            res.status(200).send({ message: message.DELETED_OK });
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    leaveRegistration: async (req, res) => {
        try {
            let registrationData;
            let registrationCourseData;
            // let payment;
            let tempArrayCourse = [];
            await ST.transaction(async (t) => {
                registrationData = await Model.findOne(
                    { where: { id: req.params.id } },
                    { transaction: t }
                );
                registrationCourseData = await Registration_course.findAll(
                    { where: { id_registration: req.params.id } },
                    { transaction: t }
                );
                // payment = await Payment.findOne({where: {id_registration: req.params.id}}, {transaction: t});

                await registrationData.update(
                    { state: "Retirado" },
                    { transaction: t }
                );

                // await payment.update({type: "Retirado"}, {transaction: t});

                for (let i = 0; i < registrationCourseData.length; i++) {
                    let temp = await registrationCourseData[i].update(
                        { state: "Retirado" },
                        { transaction: t }
                    );
                    tempArrayCourse.push(temp);
                }
                await Promise.all(tempArrayCourse);

                // ID = 6 RETIRO Y RESERVA DE MATRICULA
                let concept = await Concept.findByPk(6);
                let uit = await Uit.findOne({ where: { state: true } });
                let amount = Math.round((uit.amount * concept.percent) / 100);

                let maxPaymentID = await Payment.max(
                    "id",
                    { paranoid: false },
                    { transaction: t }
                );
                await Payment.create(
                    {
                        id: maxPaymentID + 1,
                        id_student: registrationData.id_student,
                        id_registration: req.params.id,
                        id_concept: 6,
                        type: "Pendiente",
                        payment_date: "",
                        orderNumber: 1,
                        denomination: "Retiro y reseva de Matrícula",
                        amount: amount,
                    },
                    { transaction: t }
                );
            });

            res.status(200).send({ message: message.UPDATED_OK });
            // res.status(200).send(courseDestroy);
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    createNoRegistration: async (req, res) => {
        try {
            let data;
            await ST.transaction(async (t) => {
                let maxRegistrationID = await Model.max(
                    "id",
                    { paranoid: false },
                    { transaction: t }
                );
                let studentData = await Student.findByPk(req.body.id_student);
                await studentData.update(
                    { type: req.body.type },
                    { transaction: t }
                );
                await Model.create(
                    {
                        id: maxRegistrationID + 1,
                        id_semester: req.body.id_semester,
                        id_student: req.body.id_student,
                        type: req.body.type,
                        id_program: req.body.id_program,
                        id_organic_unit: req.body.id_organic_unit,
                        state: req.body.type,
                    },
                    { transaction: t }
                );
            });

            res.status(200).send({ message: message.REGISTERED_OK });
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    updateStateRegistration: async (req, res) => {
        console.log(req.params.id_registration);
        try {
            await ST.transaction(async (t) => {
                let registrationCurses = JSON.parse(
                    req.body.registrationCurses
                );
                let tempData = [];
                for (let i = 0; i < registrationCurses.length; i++) {
                    let data = await Registration_course.findByPk(
                        registrationCurses[i].id
                    );
                    let dataTemp = await data.update(
                        {
                            state: registrationCurses[i].state,
                        },
                        { transaction: t }
                    );
                    tempData.push(dataTemp);
                }
                await Promise.all(tempData);
            });
            res.status(200).send({ message: message.UPDATED_OK });
            // res.status(200).send(courseDestroy);
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },

    listRegistrationCourseByProgramAndSemester: async (req, res) => {
        try {
            let records = [];
            let registrationCourse = [];
            let tempCourse = [];
            await ST.transaction(async (t) => {
                records = await Model.findAll(
                    {
                        where: {
                            id_semester: req.params.id_academic_semester,
                        },
                        include: {
                            // attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('Registration_course.id_course')), 'id']],
                            // attributes: [Sequelize.literal('DISTINCT ON("Registration_course"."id_course") 1'), '*'],
                            required: true,
                            model: Registration_course,
                            as: "Registration_course",
                            include: {
                                required: true,
                                model: Course,
                                as: "Course",
                                include: {
                                    required: true,
                                    model: Ciclo,
                                    as: "Ciclo",
                                    include: {
                                        required: true,
                                        where: {
                                            id_program: req.params.id_program,
                                        },
                                        model: Plan,
                                        as: "Plan",
                                    },
                                },
                            },
                        },
                    },
                    { transaction: t }
                );

                if (records.length > 0) {
                    for (let i = 0; i < records.length; i++) {
                        tempCourse = tempCourse.concat(
                            records[i].Registration_course
                        );
                    }

                    // registrationCourse = tempCourse.filter((item, index) => {
                    //     console.log(item.id_course)
                    //     return registrationCourse.indexOf(item.id_course) === item.id_course;
                    // })
                    const setObj = new Set(); // create key value pair from array of array

                    registrationCourse = tempCourse.reduce((acc, item) => {
                        if (!setObj.has(item.id_course)) {
                            setObj.add(item.id_course, item);
                            acc.push({
                                id: item.Course.id,
                                denomination: item.Course.denomination,
                                ciclo: item.Course.Ciclo.ciclo,
                                credits: item.Course.credits,
                                order: item.Course.order,
                                type: item.Course.type,
                            });
                        }
                        return acc;
                    }, []);
                }
            });
            res.status(200).send(registrationCourse);
        } catch (e) {
            console.log(e);
            res.status(444).send(e);
        }
    },
    listRegistrationStudentByCourseAndSemester: async (req, res) => {
        try {
            let records = [];

            await ST.transaction(async (t) => {
                records = await Registration_course.findAll(
                    {
                        attributes: ["id", "note", "state"],
                        where: {
                            id_course: req.params.id_course,
                            state: {
                                [Op.ne]: "Retirado",
                            },
                        },
                        include: {
                            required: true,
                            attributes: ["id", "type", "state", "created_at"],
                            where: {
                                id_semester: req.params.id_academic_semester,
                                state: {
                                    [Op.ne]: "Pendiente",
                                    [Op.ne]: "No Matrículado",
                                },
                            },

                            model: Model,
                            as: "Registration",
                            include: {
                                attributes: ["id"],
                                model: Student,
                                as: "Student",
                                include: {
                                    attributes: [
                                        "id",
                                        "document_number",
                                        "email",
                                        "photo",
                                        [
                                            Fn(
                                                "CONCAT",
                                                Col("paternal"),
                                                " ",
                                                Col("maternal"),
                                                " ",
                                                Col("name")
                                            ),
                                            "name",
                                        ],
                                    ],
                                    model: Person,
                                    as: "Person",
                                },
                            },
                        },
                        order: [
                            [
                                { model: Model, as: "Registration" },
                                { model: Student, as: "Student" },
                                {
                                    model: Person,
                                    as: "Person",
                                },
                                "paternal",
                                "asc",
                            ],
                        ],
                    },
                    { transaction: t }
                );
            });
            res.status(200).send(records);
        } catch (e) {
            console.log(e);
            res.status(444).send(e);
        }
    },
    updateRegistrationCourse: async (req, res) => {
        try {
            let registrationCourseCreate;
            let registartionData;
            let course;
            let paymentData;
            let tempRegistrationCourse = [];
            await ST.transaction(async (t) => {
                let dataCourse = JSON.parse(req.body.courses);
                for (let i = 0; i < dataCourse.length; i++) {
                    course = await Registration_course.findByPk(
                        dataCourse[i].id
                    );
                    let state =
                        dataCourse[i].note >= 14 ? "Aprobado" : "Desaprobado";
                    registrationCourseCreate = await course.update(
                        {
                            note: dataCourse[i].note,
                            state: state,
                        },
                        { transaction: t }
                    );
                    tempRegistrationCourse.push(registrationCourseCreate);
                }
                await Promise.all(tempRegistrationCourse);
            });
            res.status(200).send(message.UPDATED_OK);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    updateRegistrationCourseNote: async (req, res) => {
        try {
            await ST.transaction(async (t) => {
                let data = await Registration_course.findByPk(req.body.id);
                let state = req.body.note >= 14 ? "Aprobado" : "Desaprobado";
                await data.update(
                    {
                        note: req.body.note,
                        state: state,
                    },
                    { transaction: t }
                );
            });
            res.status(200).send({ message: message.UPDATED_OK });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    //OLD FUNCTIONS REGISTRATION

    list: function (req, res) {
        return Model.findAll()
            .then((records) => res.status(200).send(records))
            .catch((error) => res.status(400).send(error));
    },
    listRegistrationStundent: function (req, res) {
        return Semester_activity.findAll({
            attributes: ["id"],
            include: [
                {
                    attributes: ["id", "denomination"],
                    model: Academic_semester,
                    as: "AS",
                    include: [
                        {
                            attributes: ["id", "denomination"],
                            model: Academic_calendar,
                            as: "AC",
                        },
                        {
                            attributes: ["id", "denomination"],
                            model: Semester,
                            as: "Semester",
                        },
                    ],
                },
                {
                    attributes: ["id", "note", "state"],
                    where: {
                        id_student: req.params.id_student,
                    },
                    model: Model,
                    as: "Registration",
                    include: {
                        attributes: [
                            "id",
                            "denomination",
                            "order",
                            "credits",
                            "type",
                        ],
                        model: Course,
                        as: "Course",
                        include: {
                            attributes: ["id", "semester"],
                            model: Semester_mention,
                            as: "Semester_mention",
                        },
                    },
                },
            ],
            order: [
                ["created_at", "desc"],
                [
                    { model: Model, as: "Registration" },
                    { model: Course, as: "Course" },
                    "order",
                    "asc",
                ],
            ],
        })
            .then((records) => {
                res.status(200).send(records);
            })
            .catch((error) => res.status(400).send(error));
    },
    updateGradeStudentCourse: async (req, res) => {
        try {
            let registration;
            let updateRegistration;
            let result = await ST.transaction(async (t) => {
                registration = await Model.findOne(
                    {
                        where: {
                            id: req.params.id_registration,
                        },
                    },
                    { transaction: t }
                );
                if (registration) {
                    updateRegistration = await registration.update(
                        {
                            note: req.body.note,
                            state: req.body.state,
                        },
                        { transaction: t }
                    );
                    // if (updateRegistration) {
                    //
                    // }
                } else {
                    return "No se actualizaron los datos";
                }
                return registration;
            });
            res.status(200).send(result);
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    updateRemoveStudentCourse: async (req, res) => {
        try {
            let registration;
            let updateRegistration;
            let result = await ST.transaction(async (t) => {
                registration = await Model.findOne(
                    {
                        where: {
                            id: req.params.id_registration,
                        },
                    },
                    { transaction: t }
                );
                if (registration) {
                    updateRegistration = await registration.update(
                        {
                            note: 0,
                            state: "Retirado",
                        },
                        { transaction: t }
                    );
                    // if (updateRegistration) {
                    //
                    // }
                } else {
                    return "No se actualizaron los datos";
                }
                return registration;
            });
            res.status(200).send(result);
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    updateRegistrationRetirement: async (req, res) => {
        try {
            let payment;
            let registration;
            let registrationCourse;
            let updateRegistration;
            let updateRegistrationCourse = [];
            let updatePayment;
            await ST.transaction(async (t) => {
                registration = await Model.findOne(
                    { where: { id: req.body.id_registration } },
                    { transaction: t }
                );
                if (!registration) throw "Matricula no encontrada";
                updateRegistration = await registration.update(
                    { type: registration.type + "-Retirado" },
                    { transaction: t }
                );

                registrationCourse = await Registration_course.findAll(
                    { where: { id_registration: req.body.id_registration } },
                    { transaction: t }
                );
                if (!registrationCourse) throw "Curso no encontrado";
                for (let i = 0; i < registrationCourse.length; i++) {
                    let tempRegistrationCourse = await registrationCourse[
                        i
                    ].update(
                        {
                            note: 0,
                            state: "Retirado",
                        },
                        { transaction: t }
                    );
                    updateRegistrationCourse.push(tempRegistrationCourse);
                }
                await Promise.all(updateRegistrationCourse);

                payment = await Payment.findOne(
                    { where: { id: req.body.id_concept } },
                    { transaction: t }
                );
                if (!payment) throw "Concepto no encontrado";
                updatePayment = await payment.update(
                    { state: true },
                    { transaction: t }
                );
                //
                // return registration;
            });
            res.status(200).send({ message: message.UPDATED_OK });
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },

    retrieve: function (req, res) {
        return Model.findOne({
            where: {
                id: {
                    [Op.eq]: req.params.id,
                },
            },
        })
            .then((record) => {
                if (!record)
                    return res
                        .status(404)
                        .send({ message: message.RECORD_NOT_FOUND });
                return res.status(200).send(record);
            })
            .catch((error) => res.status(400).send(error));
    },

    destroyNoRegistration: async (req, res) => {
        try {
            let noRegistration = await Model.findByPk(req.params.id);
            await noRegistration.destroy();
            res.status(200).send({ message: message.DELETED_OK });
        } catch (err) {
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
};
