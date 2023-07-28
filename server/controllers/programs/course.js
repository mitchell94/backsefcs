const Sequelize = require("sequelize");
const message = require("../../messages");

const Op = Sequelize.Op;
const Fn = Sequelize.fn;
const Col = Sequelize.col;

const Model = require("../../models").Course;
const ST = Model.sequelize;
const Semester_mention = require("../../models").Semester_mention;
const Open_course = require("../../models").Open_course;
const Registration = require("../../models").Registration;
const Payment = require("../../models").Payment;
const Concepts = require("../../models").Concepts;
const Course = require("../../models").Course;
const Cost = require("../../models").Cost;
const Ciclo = require("../../models").Ciclo;
const Admission_plan = require("../../models").Admission_plan;
const Plan = require("../../models").Plan;

module.exports = {
    createCourse: async (req, res) => {
        try {
            let courseData = [];
            let parseR = [];
            let mentionCourseData = [];
            let requeriment = null;

            await ST.transaction(async (t) => {
                if (req.body.requirements !== undefined) {
                    parseR = JSON.parse(req.body.requirements);
                    requeriment =
                        parseR.length > 0 ? req.body.requirements : null;
                }
                let max = await Model.max(
                    "id",
                    { paranoid: false },
                    { transaction: t }
                );
                courseData = await Model.create(
                    {
                        id: max + 1,
                        id_ciclo: req.body.id_ciclo,
                        code: req.body.code,
                        denomination: req.body.denomination,
                        abbreviation: req.body.abbreviation,
                        order: req.body.order,
                        area: req.body.area,
                        credits: req.body.credits,
                        practical_hours: req.body.practical_hours,
                        hours: req.body.hours,
                        requirements: requeriment,
                        type: req.body.type,
                    },
                    { transaction: t }
                );
            });
            // In this case, an instance of Model
            res.status(200).send({ courseData, mentionCourseData });
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    updateCourse: async (req, res) => {
        try {
            let courseData = [];
            await ST.transaction(async (t) => {
                courseData = await Model.findOne(
                    { where: { id: req.params.id } },
                    { transaction: t }
                );
                if (courseData) {
                    let parseR = JSON.parse(req.body.requirements);
                    let requeriment =
                        parseR.length > 0 ? req.body.requirements : null;
                    courseData = await courseData.update(
                        {
                            area: req.body.area,
                            code: req.body.code,
                            denomination: req.body.denomination,
                            abbreviation: req.body.abbreviation,
                            credits: req.body.credits,
                            practical_hours: req.body.practical_hours,
                            hours: req.body.hours,
                            type: req.body.type,
                            order: req.body.order,
                            requirements: requeriment,
                        },
                        { transaction: t }
                    );
                }
            });
            // In this case, an instance of Model
            res.status(200).send({ courseData });
        } catch (err) {
            // Rollback transaction if any errors were encountered
            res.status(445).send(err);
        }
    },
    listCourse: function (req, res) {
        return Model.findAll({
            where: { id_programs: { [Op.eq]: req.params.id } },
            attributes: [
                ["id", "value"],
                ["denomination", "label"],
            ],
        })
            .then((records) => res.status(200).send(records))
            .catch((error) => res.status(400).send(error));
    },

    disableCourse: function (req, res) {
        return Model.update(
            { state: req.body.state },
            {
                where: {
                    id: {
                        [Op.eq]: req.params.id,
                    },
                },
            }
        )
            .then((records) => res.status(200).send(records))
            .catch((error) => res.status(400).send(error));
    },

    searchCourse: async (req, res) => {
        try {
            let record = await Model.findAll({
                // attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: {
                    [Op.or]: [
                        {
                            denomination: {
                                [Op.iLike]: "%" + req.params.parameter + "%",
                            },
                        },
                    ],
                },
                include: {
                    required: true,
                    model: Ciclo,
                    as: "Ciclo",
                    include: {
                        required: true,
                        where: { id: req.body.id_study_plan },
                        model: Plan,
                        as: "Plan",
                    },
                },
            });

            res.status(200).send(record);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.RECORD_NOT_FOUND,
                err: err,
            });
        }
    },
    // B-CURSOS-MATRICULADOS-ESTUDIANTE
    listCourseRegistration: async (req, res) => {
        let allCourses = [];
        let arrayTemp = [];
        let previousSemester = "";

        let previusSemesterCourse;
        let pulledCourse;
        let semesterActualCourses = [];
        try {
            await ST.transaction(async (t) => {
                //LISTAMOS LOS CURSOS DEL SEMESTRE ACTUAL
                semesterActualCourses = await Model.findAll(
                    {
                        attributes: [
                            "id",
                            "id_semester_mention",
                            "denomination",
                            "requirements",
                            "code",
                            "abbreviation",
                            "area",
                            "order",
                            "credits",
                            "practical_hours",
                            "hours",
                            "type",
                            "state",
                        ],

                        include: [
                            {
                                attributes: ["id", "semester"],
                                model: Semester_mention,
                                as: "Semester_mention",
                            },
                            {
                                attributes: [
                                    "id",
                                    "id_payment",
                                    "id_course",
                                    "id_semester",
                                    "id_student",
                                    "note",
                                    "approved",
                                    "state",
                                ],
                                required: true,
                                where: {
                                    id_student: req.params.id_student,
                                    id_semester: req.body.id_academic_semester,
                                },
                                model: Registration,
                                as: "Registration_one",
                            },
                        ],
                        order: [["order", "asc"]],
                    },
                    { transaction: t }
                );
                pulledCourse = await Cost.findOne(
                    {
                        attributes: ["code"],
                        where: { id_mention: req.body.id_mention },
                        include: {
                            attributes: ["amount"],
                            model: Concepts,
                            as: "Concepts",
                            include: {
                                attributes: ["denomination"],
                                where: { denomination: "CURSO A CARGO" },
                                model: Concepts,
                                as: "Concepts_parent",
                            },
                        },
                    },
                    { transaction: t }
                );

                if (semesterActualCourses.length > 0) {
                    //AÑADIMOS LOS CURSOS
                    arrayTemp = semesterActualCourses;
                } else {
                    //BUSCAMOS LOS CURSOS DE LA ULTIMA MATRICULA SEGUN EL ULTIMO ID DE PAGO id_payment

                    previousSemester = await Registration.max(
                        "id_payment",
                        {
                            where: { id_student: req.params.id_student },
                        },
                        { transaction: t }
                    );

                    //CARGAMOS TODOS LOS CURSOS
                    allCourses = await Semester_mention.findAll(
                        {
                            attributes: ["id", "id_mention", "semester"],
                            where: {
                                id_mention: req.body.id_mention,
                            },
                            include: {
                                attributes: [
                                    "id",
                                    "id_semester_mention",
                                    "denomination",
                                    "requirements",
                                    "code",
                                    "abbreviation",
                                    "area",
                                    "order",
                                    "credits",
                                    "practical_hours",
                                    "hours",
                                    "type",
                                    "state",
                                ],
                                model: Course,
                                as: "Course",
                                include: {
                                    attributes: ["id", "semester"],
                                    model: Semester_mention,
                                    as: "Semester_mention",
                                },
                            },
                            order: [
                                [
                                    { model: Course, as: "Course" },
                                    "order",
                                    "asc",
                                ],
                            ],
                        },
                        { transaction: t }
                    );

                    if (previousSemester) {
                        //LISTAMOS TODOS LOS CURSOS DE LA MENCION SEGUN EL ULTIMO PAGO DE SEMESTRE  Y EL ID DE ESTUDIANTE
                        previusSemesterCourse = await Model.findAll(
                            {
                                attributes: [
                                    "id",
                                    "id_semester_mention",
                                    "denomination",
                                    "requirements",
                                    "code",
                                    "abbreviation",
                                    "area",
                                    "order",
                                    "credits",
                                    "practical_hours",
                                    "hours",
                                    "type",
                                    "state",
                                ],
                                include: [
                                    {
                                        attributes: ["id", "semester"],
                                        model: Semester_mention,
                                        as: "Semester_mention",
                                    },
                                    {
                                        attributes: [
                                            "id",
                                            "id_payment",
                                            "id_course",
                                            "id_semester",
                                            "id_student",
                                            "note",
                                            "approved",
                                            "state",
                                        ],
                                        required: true,
                                        where: {
                                            id_student: req.params.id_student,
                                            id_payment: previousSemester,
                                        },
                                        model: Registration,
                                        as: "Registration_one",
                                    },
                                ],
                                order: [["order", "asc"]],
                            },
                            { transaction: t }
                        );

                        if (previusSemesterCourse) {
                            for (
                                let i = 0;
                                i < previusSemesterCourse.length;
                                i++
                            ) {
                                //PUSHEAMOS LOS CURSOS JALADOS COMO NUEVOS
                                if (
                                    previusSemesterCourse[i].Registration_one
                                        .approved === false
                                ) {
                                    arrayTemp.push({
                                        id: previusSemesterCourse[i].id,
                                        id_semester_mention:
                                            previusSemesterCourse[i]
                                                .id_semester_mention,
                                        denomination:
                                            previusSemesterCourse[i]
                                                .denomination,
                                        requirements:
                                            previusSemesterCourse[i]
                                                .requirements,
                                        code: previusSemesterCourse[i].code,
                                        abbreviation:
                                            previusSemesterCourse[i]
                                                .abbreviation,
                                        area: previusSemesterCourse[i].area,
                                        order: previusSemesterCourse[i].order,
                                        credits:
                                            previusSemesterCourse[i].credits,
                                        practical_hours:
                                            previusSemesterCourse[i]
                                                .practical_hours,
                                        hours: previusSemesterCourse[i].hours,
                                        pulled: pulledCourse.Concepts[0].amount,
                                        type: previusSemesterCourse[i].type,
                                        state: false,
                                        Semester_mention: {
                                            id: previusSemesterCourse[i]
                                                .Semester_mention.id,
                                            semester:
                                                previusSemesterCourse[i]
                                                    .Semester_mention.semester,
                                        },
                                        Registration_one: null,
                                    });
                                } else {
                                    //BUSCAMOS LOS CURSOS QUE TIENEN COMO PRE-REQUISITO LOS CURSOS APROBADOS Y PUSHEAMOS
                                    for (
                                        let k = 0;
                                        k < allCourses.length;
                                        k++
                                    ) {
                                        for (
                                            let j = 0;
                                            j < allCourses[k].Course.length;
                                            j++
                                        ) {
                                            let temp = JSON.parse(
                                                allCourses[k].Course[j]
                                                    .requirements
                                            );
                                            if (temp) {
                                                if (
                                                    previusSemesterCourse[i]
                                                        .id === temp[0].value
                                                ) {
                                                    arrayTemp.push({
                                                        id: allCourses[k]
                                                            .Course[j].id,
                                                        id_semester_mention:
                                                            allCourses[k]
                                                                .Course[j]
                                                                .id_semester_mention,
                                                        denomination:
                                                            allCourses[k]
                                                                .Course[j]
                                                                .denomination,
                                                        requirements:
                                                            allCourses[k]
                                                                .Course[j]
                                                                .requirements,
                                                        code: allCourses[k]
                                                            .Course[j].code,
                                                        abbreviation:
                                                            allCourses[k]
                                                                .Course[j]
                                                                .abbreviation,
                                                        area: allCourses[k]
                                                            .Course[j].area,
                                                        order: allCourses[k]
                                                            .Course[j].order,
                                                        credits:
                                                            allCourses[k]
                                                                .Course[j]
                                                                .credits,
                                                        practical_hours:
                                                            allCourses[k]
                                                                .Course[j]
                                                                .practical_hours,
                                                        hours: allCourses[k]
                                                            .Course[j].hours,
                                                        type: allCourses[k]
                                                            .Course[j].type,
                                                        state: false,
                                                        Semester_mention: {
                                                            id: allCourses[k]
                                                                .Course[j]
                                                                .Semester_mention
                                                                .id,
                                                            semester:
                                                                allCourses[k]
                                                                    .Course[j]
                                                                    .Semester_mention
                                                                    .semester,
                                                        },
                                                        Registration_one: null,
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        //SI NO EXISTE NINGUN REGISTRO SE ENVIAN LOS CURSOS QUE NO TIENEN REQUERIMIENTOS
                        for (let k = 0; k < allCourses.length; k++) {
                            for (
                                let j = 0;
                                j < allCourses[k].Course.length;
                                j++
                            ) {
                                let temp = JSON.parse(
                                    allCourses[k].Course[j].requirements
                                );
                                if (temp) {
                                    continue;
                                } else {
                                    arrayTemp.push({
                                        id: allCourses[k].Course[j].id,
                                        id_semester_mention:
                                            allCourses[k].Course[j]
                                                .id_semester_mention,
                                        denomination:
                                            allCourses[k].Course[j]
                                                .denomination,
                                        requirements:
                                            allCourses[k].Course[j]
                                                .requirements,
                                        code: allCourses[k].Course[j].code,
                                        abbreviation:
                                            allCourses[k].Course[j]
                                                .abbreviation,
                                        area: allCourses[k].Course[j].area,
                                        order: allCourses[k].Course[j].order,
                                        credits:
                                            allCourses[k].Course[j].credits,
                                        practical_hours:
                                            allCourses[k].Course[j]
                                                .practical_hours,
                                        hours: allCourses[k].Course[j].hours,
                                        type: allCourses[k].Course[j].type,
                                        state: false,
                                        Semester_mention: {
                                            id: allCourses[k].Course[j]
                                                .Semester_mention.id,
                                            semester:
                                                allCourses[k].Course[j]
                                                    .Semester_mention.semester,
                                        },
                                        Registration_one: null,
                                    });
                                }
                            }
                        }
                    }
                }
                //AÑADIMOS LOS CURSOS JALADOS
            });
            res.status(200).send(arrayTemp);
        } catch (err) {
            // Rollback transaction if any errors were encountered
            res.status(445).send(err);
        }
    },

    destroy: function (req, res) {
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
                return record
                    .update({
                        state: !record.state,
                    })
                    .then((updated) => {
                        res.status(200).send({
                            message: message.UPDATED_OK,
                            record: updated,
                        });
                    })
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },
};
