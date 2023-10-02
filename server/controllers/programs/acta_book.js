const Sequelize = require("sequelize");
const message = require("../../messages");

const Op = Sequelize.Op;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const abox = require("../Abox");
const Model = require("../../models").Acta_book;
const Course = require("../../models").Course;
const Person = require("../../models").Person;
const Academic_semester = require("../../models").Academic_semester;
const Academic_calendar = require("../../models").Academic_calendar;
const Program = require("../../models").Programs;
const Schedule = require("../../models").Schedule;
const Admission_plan = require("../../models").Admission_plan;
const Teacher = require("../../models").Teacher;
const Plan = require("../../models").Plan;

const ST = Model.sequelize;
module.exports = {
    createActaBook: async (req, res) => {
        try {
            let records;
            await ST.transaction(async (t) => {
                //COGEMOS EL ULTIMO REGISTRO SEGUN EL ID CONCEPT
                let codePlan = await Plan.findOne(
                    {
                        attributes: ["code"],
                        where: {
                            id_program: req.body.id_program,
                            valid: "t",
                        },
                    },
                    { transaction: t }
                );
                let codeCourse = await Course.findOne(
                    {
                        attributes: ["code"],
                        where: {
                            id: req.body.id_course,
                        },
                    },
                    { transaction: t }
                );
                // let codeSchedule = await Schedule.findOne(
                //     {
                //         attributes: ["group_class"],
                //         where: {
                //             id: req.body.id_schedule,
                //         },
                //     },
                //     { transaction: t }
                // );
                let codeAcademicSemester = await Academic_semester.findOne(
                    {
                        attributes: ["denomination"],
                        where: {
                            id: req.body.id_process,
                        },
                        include: {
                            attributes: ["denomination"],
                            model: Academic_calendar,
                            as: "Academic_calendar",
                        },
                    },
                    { transaction: t }
                );
                let semester =
                    codeAcademicSemester.denomination.substr(-2) == " I"
                        ? "1"
                        : "2";

                let digi =
                    // codeSchedule.group_class +
                    codePlan.code +
                    codeAcademicSemester.Academic_calendar.denomination.substr(
                        -2
                    ) +
                    semester +
                    codeCourse.code +
                    req.body.type;

                //validadmos si existe
                let existActa = await Model.findOne({
                    where: { correlative: digi },
                });
                if (existActa) {
                    throw {
                        message: "Ya se ha generado un acta con este codigo",
                    };
                }
                let max = await Model.max(
                    "id",
                    { paranoid: false },
                    { transaction: t }
                );
                await Model.create(
                    {
                        id: max + 1,
                        id_course: req.body.id_course,
                        id_program: req.body.id_program,
                        id_schedule: req.body.id_schedule,
                        id_process: req.body.id_process,
                        id_teacher: req.body.id_teacher,
                        correlative: digi,
                        type: req.body.type,
                        state: false,
                    },
                    { transaction: t }
                );
            });

            // In this case, an instance of Model

            res.status(200).send(message.REGISTERED_OK);
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    closeActaBook: async (req, res) => {
        try {
            await ST.transaction(async (t) => {
                let data = await Model.findByPk(req.params.id_acta);
                await data.update({ state: true }, { transaction: t });
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
    listActaBookBySchedule: async (req, res) => {
        try {
            let code_acta;
            let id_acta_book;
            let state_acta;
            await ST.transaction(async (t) => {
                let corre = await Model.findOne(
                    {
                        // attributes: ['id', 'id_student', 'type', 'correlative', 'observation', 'created_at'],
                        where: {
                            id_schedule: req.params.id_schedule,
                        },
                    },
                    { transaction: t }
                );

                code_acta = corre.correlative;
                state_acta = corre.state;
                id_acta_book = corre ? corre.id : "";
            });

            // In this case, an instance of Model

            res.status(200).send({ id_acta_book, code_acta, state_acta });
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    listActaBook: async (req, res) => {
        try {
            let data;
            let id_acta_book;
            await ST.transaction(async (t) => {
                data = await Model.findAll(
                    {
                        // attributes: ['id', 'id_student', 'type', 'correlative', 'observation', 'created_at'],
                        where: {
                            id_process: req.params.id_process,
                        },
                        include: [
                            {
                                attributes: ["description"],
                                model: Program,
                                as: "Program",
                            },
                            {
                                attributes: [
                                    "group_class",
                                    "start_date",
                                    "start_date",
                                ],
                                model: Schedule,
                                as: "Schedule",
                                include: {
                                    attributes: ["denomination"],
                                    model: Course,
                                    as: "Course",
                                },
                            },
                            {
                                attributes: ["description"],
                                model: Admission_plan,
                                as: "Admission_plan",
                            },
                            {
                                attributes: ["id"],
                                model: Teacher,
                                as: "Teacher",
                                include: {
                                    attributes: [
                                        "document_number",
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
                        ],
                    },
                    { transaction: t }
                );
            });

            // In this case, an instance of Model

            res.status(200).send(data);
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
};
