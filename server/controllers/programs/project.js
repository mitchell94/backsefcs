const Sequelize = require('sequelize');
const message = require('../../messages');
const {Organic_unit, Campus} = require("../../models");
const {promises: fs} = require("fs");
const {URL_PLUBLIC} = require("../Abox");


const Model = require('../../models').Project,
    Student = require('../../models').Student,
    Program = require('../../models').Programs,
    Person = require('../../models').Person;
const ST = Model.sequelize;
const Semester_mention = require('../../models').Semester_mention;

const Registration = require('../../models').Registration;

const Concepts = require('../../models').Concepts;
const Course = require('../../models').Course;
const Cost = require('../../models').Cost;
const Ciclo = require('../../models').Ciclo;


const Plan = require('../../models').Plan;
const Op = Sequelize.Op;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const ubication_project = URL_PLUBLIC + 'project/';
module.exports = {
    listProject: function (req, res) {
        return Model
            .findAll({
                where: {id_programs: {[Op.eq]: req.params.id}},
                attributes: [['id', 'value'], ['denomination', 'label']]
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    listProjectByOrganicUnitID: async (req, res) => {
        try {
            let records = await Model.findAll({
                where: {
                    id_organic_unit: req.params.id
                },
                // attributes: ['id', 'project_name', 'resolution_name', 'resolution_file', 'resolution_file_state', 'observation', 'state', 'created_at'],
                include: [
                    {
                        required: true,
                        attributes: ['description'],
                        model: Program,
                        as: 'Program'
                    },
                    {
                        required: true,
                        attributes: ['id'],
                        model: Student,
                        as: 'Student',
                        include: {
                            attributes: ['id', 'document_number', 'email', 'name', 'paternal', 'maternal'],
                            model: Person,
                            as: 'Person'
                        }
                    },
                    {
                        required: true,
                        attributes: ['id', 'document_number', 'email', 'name', 'paternal', 'maternal'],
                        model: Person,
                        as: 'Adviser'
                    },
                    {
                        // required: true,
                        attributes: ['id', 'document_number', 'email', 'name', 'paternal', 'maternal'],
                        model: Person,
                        as: 'President'
                    },
                    {
                        // required: true,
                        attributes: ['id', 'document_number', 'email', 'name', 'paternal', 'maternal'],
                        model: Person,
                        as: 'Secretary'
                    },
                    {
                        // required: true,
                        attributes: ['id', 'document_number', 'email', 'name', 'paternal', 'maternal'],
                        model: Person,
                        as: 'Vocal'
                    }
                ],

            });
            let data = [];
            for (let i = 0; i < records.length; i++) {
                data.push({
                    id_project: records[i].id,
                    id_program: records[i].id_program,
                    project_name: records[i].project_name,
                    project_file: records[i].project_file,


                    // resolution_project: records[i].resolution_project,
                    // resolution_project_file: records[i].resolution_project_file,
                    // resolution_project_date: records[i].resolution_project_date,


                    resolution_jury: records[i].resolution_jury,
                    resolution_jury_file: records[i].resolution_jury_file,
                    resolution_jury_date: records[i].resolution_jury_date,

                    observation: records[i].observation,
                    state: records[i].state,
                    created_at: records[i].created_at,
                    program: records[i].Program.description,


                    id_student: records[i].id_student,
                    student_document: records[i].Student.Person.document_number,
                    student_name: records[i].Student.Person.name + ' ' + records[i].Student.Person.paternal + ' ' + records[i].Student.Person.maternal,
                    student_email: records[i].Student.Person.email,

                    id_adviser: records[i].id_adviser,
                    adviser_document: records[i].Adviser.document_number,
                    adviser_name: records[i].Adviser.name + ' ' + records[i].Adviser.paternal + ' ' + records[i].Adviser.maternal,
                    adviser_email: records[i].Adviser.email,

                    id_president: records[i].id_president && records[i].id_president,
                    president_document: records[i].id_president && records[i].President.document_number,
                    president_name: records[i].id_president && records[i].President.name + ' ' + records[i].President.paternal + ' ' + records[i].President.maternal,
                    president_email: records[i].id_president && records[i].President.email,

                    id_secretary: records[i].id_secretary,
                    secretary_document: records[i].id_secretary && records[i].Secretary.document_number,
                    secretary_name: records[i].id_secretary && records[i].Secretary.name + ' ' + records[i].Secretary.paternal + ' ' + records[i].Secretary.maternal,
                    secretary_email: records[i].id_secretary && records[i].Secretary.email,

                    id_vocal: records[i].id_vocal,
                    vocal_document: records[i].id_vocal && records[i].Vocal.document_number,
                    vocal_name: records[i].id_vocal && records[i].Vocal.name + ' ' + records[i].Vocal.paternal + ' ' + records[i].Vocal.maternal,
                    vocal_email: records[i].id_vocal && records[i].Vocal.email


                })
            }
            res.status(200).send(data)
        } catch (e) {
            console.log(e)
            res.status(444).send(e)
        }

    },

    createProjectTesis: async (req, res) => {

        try {


            await ST.transaction(async (t) => {

                let archive = "";
                let tmp_path = "";
                try {

                    archive = req.body.file_name_resolution_jury + '.' + req.files.file_resolution_jury.name.split('.').pop();
                    tmp_path = req.files.file_resolution_jury.path;
                    let target_path = ubication_project + archive;

                    // delete temp file
                    await fs.copyFile(tmp_path, target_path);
                    await fs.unlink(tmp_path);
                } catch (e) {
                    await fs.unlink(tmp_path);
                    res.status(444).send(e)
                }
                let archive2 = "";
                let tmp_path2 = "";
                try {

                    archive2 = req.body.file_name_project + '.' + req.files.file_project.name.split('.').pop();
                    tmp_path2 = req.files.file_project.path;
                    let target_path = ubication_project + archive2;

                    // delete temp file
                    await fs.copyFile(tmp_path2, target_path);
                    await fs.unlink(tmp_path2);
                } catch (e) {
                    await fs.unlink(tmp_path2);
                    res.status(444).send(e)
                }
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                const data = await Model.create({

                    id: max + 1,
                    id_student: req.body.id_student,
                    id_adviser: req.body.id_adviser,
                    id_president: req.body.id_president,
                    id_secretary: req.body.id_secretary,
                    id_vocal: req.body.id_vocal,
                    // id_organic_unit: req.body.id_organic_unit,
                    id_organic_unit: req.body.id_organic_unit,

                    resolution_jury: req.body.resolution_jury_name,
                    resolution_jury_date: req.body.resolution_jury_date,
                    resolution_jury_file: archive,

                    id_program: req.body.id_program,
                    project_name: req.body.project_name,
                    project_file: archive2,


                    observation: req.body.observation,
                    state: 'Proyecto con jurado asignado',


                }, {transaction: t})

            });

            // In this case, an instance of Model

            res.status(200).send('algo')
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err)
            res.status(445).send(err)
        }
    },
    updateProjectTesis: async (req, res) => {

        try {


            await ST.transaction(async (t) => {

                let archive = "";
                let tmp_path = "";
                if (req.files.file_resolution_jury) {
                    try {

                        archive = req.body.file_name_resolution_jury + '.' + req.files.file_resolution_jury.name.split('.').pop();
                        tmp_path = req.files.file_resolution_jury.path;
                        let target_path = ubication_project + archive;

                        // delete temp file
                        await fs.copyFile(tmp_path, target_path);
                        await fs.unlink(tmp_path);
                    } catch (e) {
                        await fs.unlink(tmp_path);
                        res.status(444).send(e)
                    }
                }

                let archive2 = "";
                let tmp_path2 = "";
                if (req.files.file_project) {
                    try {

                        archive2 = req.body.file_name_project + '.' + req.files.file_project.name.split('.').pop();
                        tmp_path2 = req.files.file_project.path;
                        let target_path = ubication_project + archive2;

                        // delete temp file
                        await fs.copyFile(tmp_path2, target_path);
                        await fs.unlink(tmp_path2);
                    } catch (e) {
                        await fs.unlink(tmp_path2);
                        res.status(444).send(e)
                    }
                }

                const project = await Model.findByPk(req.params.id, {transaction: t});


                await project.update({
                    id_student: req.body.id_student,
                    id_adviser: req.body.id_adviser,
                    id_president: req.body.id_president,
                    id_secretary: req.body.id_secretary,
                    id_vocal: req.body.id_vocal,
                    // id_organic_unit: req.body.id_organic_unit,


                    resolution_jury: req.body.resolution_jury_name,
                    resolution_jury_date: req.body.resolution_jury_date,

                    resolution_jury_file: req.files.file_resolution_jury ? archive : project.resolution_jury_file,

                    id_program: req.body.id_program,
                    project_name: req.body.project_name,
                    project_file: req.files.file_project ? archive2 : project.project_file,


                    observation: req.body.observation,
                    state: 'Proyecto con jurado asignado',


                }, {transaction: t})

            });

            // In this case, an instance of Model

            res.status(200).send('algo')
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err)
            res.status(445).send(err)
        }
    },
    updateCourse: async (req, res) => {
        try {
            let courseData = [];
            await ST.transaction(async (t) => {

                courseData = await Model.findOne({where: {id: req.params.id}}, {transaction: t});
                if (courseData) {
                    let parseR = JSON.parse(req.body.requirements)
                    let requeriment = parseR.length > 0 ? req.body.requirements : null;
                    courseData = await courseData.update({
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
                    }, {transaction: t});
                }


            });

            // In this case, an instance of Model

            res.status(200).send({courseData})
        } catch (err) {
            // Rollback transaction if any errors were encountered

            res.status(445).send(err)
        }


    },


    disableCourse: function (req, res) {
        return Model
            .update(
                {state: req.body.state},
                {
                    where: {
                        id: {
                            [Op.eq]: req.params.id
                        }
                    },
                })
            .then(records => res.status(200).send(records))
            .catch((error) => res.status(400).send(error));
    },


    searchCourse: async (req, res) => {
        try {
            let record = await Model.findAll({
                // attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: {

                    [Op.or]: [
                        {denomination: {[Op.iLike]: '%' + req.params.parameter + '%'}},

                    ],

                },
                include: {
                    required: true,
                    model: Ciclo,
                    as: 'Ciclo',
                    include: {
                        required: true,
                        where: {id: req.body.id_study_plan},
                        model: Plan,
                        as: 'Plan'
                    }

                }


            });

            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
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
                            attributes: ['id', 'id_semester_mention', 'denomination', 'requirements', 'code', 'abbreviation', 'area', 'order', 'credits', 'practical_hours', 'hours', 'type', 'state'],

                            include: [
                                {
                                    attributes: ['id', 'semester'],
                                    model: Semester_mention,
                                    as: "Semester_mention"
                                },
                                {
                                    attributes: ['id', 'id_payment', 'id_course', 'id_semester', 'id_student', 'note', 'approved', 'state'],
                                    required: true,
                                    where: {
                                        id_student: req.params.id_student,
                                        id_semester: req.body.id_academic_semester,
                                    },
                                    model: Registration,
                                    as: "Registration_one"
                                }
                            ],
                            order: [["order", 'asc']],
                        }, {transaction: t});
                    pulledCourse = await Cost.findOne(
                        {
                            attributes: ['code'],
                            where: {id_mention: req.body.id_mention},
                            include: {
                                attributes: ['amount'],
                                model: Concepts,
                                as: "Concepts",
                                include: {
                                    attributes: ['denomination'],
                                    where: {denomination: "CURSO A CARGO"},
                                    model: Concepts,
                                    as: "Concepts_parent"
                                }
                            }

                        }, {transaction: t});

                    if (semesterActualCourses.length > 0) {
                        //AÑADIMOS LOS CURSOS
                        arrayTemp = semesterActualCourses;

                    } else {
                        //BUSCAMOS LOS CURSOS DE LA ULTIMA MATRICULA SEGUN EL ULTIMO ID DE PAGO id_payment

                        previousSemester = await Registration.max('id_payment', {
                            where: {id_student: req.params.id_student}
                        }, {transaction: t});


                        //CARGAMOS TODOS LOS CURSOS
                        allCourses = await Semester_mention.findAll({
                            attributes: ['id', 'id_mention', 'semester'],
                            where: {
                                id_mention: req.body.id_mention
                            },
                            include: {
                                attributes: ['id', 'id_semester_mention', 'denomination', 'requirements', 'code', 'abbreviation', 'area', 'order', 'credits', 'practical_hours', 'hours', 'type', 'state'],
                                model: Course,
                                as: "Course",
                                include: {
                                    attributes: ['id', 'semester'],
                                    model: Semester_mention,
                                    as: "Semester_mention"
                                },
                            },
                            order: [[{model: Course, as: 'Course'}, 'order', 'asc']],

                        }, {transaction: t});

                        if (previousSemester) {
                            //LISTAMOS TODOS LOS CURSOS DE LA MENCION SEGUN EL ULTIMO PAGO DE SEMESTRE  Y EL ID DE ESTUDIANTE
                            previusSemesterCourse = await Model.findAll(
                                {
                                    attributes: ['id', 'id_semester_mention', 'denomination', 'requirements', 'code', 'abbreviation', 'area', 'order', 'credits', 'practical_hours', 'hours', 'type', 'state'],
                                    include:
                                        [
                                            {
                                                attributes: ['id', 'semester'],
                                                model: Semester_mention,
                                                as: "Semester_mention"
                                            },
                                            {
                                                attributes: ['id', 'id_payment', 'id_course', 'id_semester', 'id_student', 'note', 'approved', 'state'],
                                                required: true,
                                                where: {
                                                    id_student: req.params.id_student,
                                                    id_payment: previousSemester,
                                                },
                                                model: Registration,
                                                as: "Registration_one"
                                            }
                                        ],
                                    order: [["order", 'asc']],
                                }, {transaction: t});

                            if (previusSemesterCourse) {

                                for (let i = 0; i < previusSemesterCourse.length; i++) {
                                    //PUSHEAMOS LOS CURSOS JALADOS COMO NUEVOS
                                    if (previusSemesterCourse[i].Registration_one.approved === false) {
                                        arrayTemp.push(
                                            {
                                                "id": previusSemesterCourse[i].id,
                                                "id_semester_mention": previusSemesterCourse[i].id_semester_mention,
                                                "denomination": previusSemesterCourse[i].denomination,
                                                "requirements": previusSemesterCourse[i].requirements,
                                                "code": previusSemesterCourse[i].code,
                                                "abbreviation": previusSemesterCourse[i].abbreviation,
                                                "area": previusSemesterCourse[i].area,
                                                "order": previusSemesterCourse[i].order,
                                                "credits": previusSemesterCourse[i].credits,
                                                "practical_hours": previusSemesterCourse[i].practical_hours,
                                                "hours": previusSemesterCourse[i].hours,
                                                "pulled": pulledCourse.Concepts[0].amount,
                                                "type": previusSemesterCourse[i].type,
                                                "state": false,
                                                "Semester_mention": {
                                                    "id": previusSemesterCourse[i].Semester_mention.id,
                                                    "semester": previusSemesterCourse[i].Semester_mention.semester,
                                                },
                                                "Registration_one": null
                                            },
                                        )
                                    } else {
                                        //BUSCAMOS LOS CURSOS QUE TIENEN COMO PRE-REQUISITO LOS CURSOS APROBADOS Y PUSHEAMOS
                                        for (let k = 0; k < allCourses.length; k++) {
                                            for (let j = 0; j < allCourses[k].Course.length; j++) {
                                                let temp = JSON.parse(allCourses[k].Course[j].requirements);
                                                if (temp) {
                                                    if (previusSemesterCourse[i].id === temp[0].value) {
                                                        arrayTemp.push(
                                                            {
                                                                "id": allCourses[k].Course[j].id,
                                                                "id_semester_mention": allCourses[k].Course[j].id_semester_mention,
                                                                "denomination": allCourses[k].Course[j].denomination,
                                                                "requirements": allCourses[k].Course[j].requirements,
                                                                "code": allCourses[k].Course[j].code,
                                                                "abbreviation": allCourses[k].Course[j].abbreviation,
                                                                "area": allCourses[k].Course[j].area,
                                                                "order": allCourses[k].Course[j].order,
                                                                "credits": allCourses[k].Course[j].credits,
                                                                "practical_hours": allCourses[k].Course[j].practical_hours,
                                                                "hours": allCourses[k].Course[j].hours,
                                                                "type": allCourses[k].Course[j].type,
                                                                "state": false,
                                                                "Semester_mention": {
                                                                    "id": allCourses[k].Course[j].Semester_mention.id,
                                                                    "semester": allCourses[k].Course[j].Semester_mention.semester,
                                                                },
                                                                "Registration_one": null
                                                            }
                                                        )
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
                                for (let j = 0; j < allCourses[k].Course.length; j++) {
                                    let temp = JSON.parse(allCourses[k].Course[j].requirements);
                                    if (temp) {
                                        continue
                                    } else {
                                        arrayTemp.push(
                                            {
                                                "id": allCourses[k].Course[j].id,
                                                "id_semester_mention": allCourses[k].Course[j].id_semester_mention,
                                                "denomination": allCourses[k].Course[j].denomination,
                                                "requirements": allCourses[k].Course[j].requirements,
                                                "code": allCourses[k].Course[j].code,
                                                "abbreviation": allCourses[k].Course[j].abbreviation,
                                                "area": allCourses[k].Course[j].area,
                                                "order": allCourses[k].Course[j].order,
                                                "credits": allCourses[k].Course[j].credits,
                                                "practical_hours": allCourses[k].Course[j].practical_hours,
                                                "hours": allCourses[k].Course[j].hours,
                                                "type": allCourses[k].Course[j].type,
                                                "state": false,
                                                "Semester_mention": {
                                                    "id": allCourses[k].Course[j].Semester_mention.id,
                                                    "semester": allCourses[k].Course[j].Semester_mention.semester,
                                                },
                                                "Registration_one": null
                                            }
                                        )
                                    }

                                }
                            }
                        }


                    }
                    //AÑADIMOS LOS CURSOS JALADOS

                }
            )


            res.status(200).send(arrayTemp)
        } catch (err) {
            // Rollback transaction if any errors were encountered

            res.status(445).send(err)
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
                if (!record) return res.status(404).send({message: message.RECORD_NOT_FOUND});
                return record
                    .update({
                        state: !record.state
                    })
                    .then(updated => {
                        res.status(200).send({
                            message: message.UPDATED_OK,
                            record: updated
                        });
                    })
                    .catch((error) => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
};
