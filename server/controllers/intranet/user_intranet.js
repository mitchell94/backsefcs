const nodemailer = require("nodemailer");
const moment = require("moment");

const Sequelize = require("sequelize");
const message = require("../../messages");
const bcrypt = require("bcryptjs");
const fs = require("fs").promises;
const Op = Sequelize.Op;
const uuid = require("uuid");

const crypt = require("node-cryptex");
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
const jwt = require("jsonwebtoken");

const Model = require("../../models").User_intranet;
const Uit = require("../../models").Uit;
const Organic_unit = require("../../models").Organic_unit;
const Student = require("../../models").Student;
const Person = require("../../models").Person;
const Ciclo = require("../../models").Ciclo;
const Program = require("../../models").Programs;
const Document_book = require("../../models").Document_book;
const Requeriment_delivered = require("../../models").Requeriment_delivered;
const Plan = require("../../models").Plan;
const ActaBook = require("../../models").Acta_book;
const Payment = require("../../models").Payment;
const Academic_semester = require("../../models").Academic_semester;
const Concept = require("../../models").Concept;
const Academic_calendar = require("../../models").Academic_calendar;
const Movement = require("../../models").Movement;
const Teacher = require("../../models").Teacher;
const Course = require("../../models").Course;
const Schedule = require("../../models").Schedule;
const Registration = require("../../models").Registration;
const Registration_course = require("../../models").Registration_course;
const Admission_plan = require("../../models").Admission_plan;
const District = require("../../models").District;
const Province = require("../../models").Province;
const Department = require("../../models").Department;
const Country = require("../../models").Country;
const Requeriment = require("../../models").Requeriment;
const System_configuration = require("../../models").System_configuration;
// MPT
const Campus = require("../../models").Campus;

const ST = Model.sequelize;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const Li = Sequelize.literal;
const abox = require("../Abox");
const { serialize } = require("v8");
const URL_PLUBLIC = require("../Abox").URL_PLUBLIC;
const url_person_voucher = URL_PLUBLIC + "person/voucher/";
module.exports = {
    createUserIntranet: async (req, res) => {
        try {
            // let passWord = await abox.generateCode(5);
            // let hashCode = await abox.encrytedPass(passWord[0]);
            // let passWord = "44249693";
            // let hashCode = await abox.encrytedPass(passWord);

            await ST.transaction(async (t) => {
                //codigo pass contraseña
                // if (!hashCode) throw { message: "Algo salio mal." };

                //Añadimos el estado a persona segun el tipo
                let person = await Person.findByPk(req.body.id_person);
                if (req.body.type === "Docente") {
                    await person.update(
                        { teacher_state: true },
                        { transaction: t }
                    );
                } else {
                    await person.update(
                        { student_state: true },
                        { transaction: t }
                    );
                }
                //verificamos si el usuario ya existe
                let user = await Model.findOne(
                    {
                        where: {
                            id_person: req.body.id_person,
                            type: req.body.type,
                        },
                    },
                    { transaction: t }
                );
                /**
                 * BUSCAMOS LA MAYOR FECHA DE REGISTRO DE NOTAS EN LOS CURSOS
                 * YA QUE HASTA ESA FECHA TENDRA ACCESO
                 * @type {*}
                 */
                let endDate = "";
                if (req.body.type === "Docente") {
                    let endDates = await Teacher.findAll({
                        where: { id_person: req.body.id_person },
                        include: { model: Schedule, as: "Schedule" },
                    });

                    endDates.map((date) => {
                        if (date.Schedule.end_date > endDate) {
                            endDate = date.Schedule.end_date;
                        }
                    });
                }
                // CREA O REINICIA EL PASSWORD ORIGINAL
                let passWord = person.document_number;
                let hashCode = await abox.encrytedPass(passWord);
                if (user) {
                    /*Si encuentra usuario lo actualiza*/
                    let out = await abox.templateSendUserCredential(
                        person.name +
                            " " +
                            person.paternal +
                            " " +
                            person.maternal,
                        person.document_number,
                        passWord
                    );
                    const mailOptions = {
                        // from: "mitper94@gmail.com",
                        from: "usefcs@unsm.edu.pe",
                        to: person.email,
                        subject: "USE/FCS-UNSM: Credenciales de acceso.",
                        html: out,
                    };
                    let sendMail = await abox.wrapedSendMail(mailOptions);
                    if (!sendMail) {
                        await user.update(
                            { pass: hashCode },
                            { transaction: t }
                        );
                    } else {
                        throw { message: "No se puede enviar a ese correo" };
                    }
                } else {
                    /*Creamos nuevo usuario*/
                    let out = await abox.templateSendUserCredential(
                        person.name +
                            " " +
                            person.paternal +
                            " " +
                            person.maternal,
                        person.document_number,
                        passWord
                    );
                    const mailOptions = {
                        // from: "mitper94@gmail.com",
                        from: "usefcs@unsm.edu.pe",
                        to: person.email,
                        subject: "USE/FCS-UNSM: Credenciales de acceso.",
                        html: out,
                    };
                    let sendMail = await abox.wrapedSendMail(mailOptions);
                    if (!sendMail) {
                        await Model.create(
                            {
                                id: uuid(),
                                id_person: req.body.id_person,
                                user: person.document_number,
                                pass: hashCode,
                                end_date: endDate,
                                type: req.body.type,
                                god: false,
                            },
                            { transaction: t }
                        );
                    } else {
                        throw { message: "No se puede enviar a ese correo" };
                    }
                }
            });
            res.status(200).send({ message: message.REGISTERED_EMAIL });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    validUserIntranet: async (req, res) => {
        try {
            let data = {};
            let token = "";
            await ST.transaction(async (t) => {
                //consulto dni y para genearar un secreteOrPrivatekey
                // const pass = crypt.decrypt(req.body.pass, k, v);
                const pass = req.body.pass;
                const valid = await Model.findOne({
                    // where: { user: req.body.user, type: "Estudiante" },
                    where: { user: req.body.user },

                    // include: {
                    //     model: Person,
                    //     as: "Person",
                    //     include: {
                    //         where: { type: "Estudiante" },
                    //         model: Student,
                    //         as: "Students",
                    //     },
                    // },
                });
                const validPass = await abox.validatePass(valid.pass, pass);
                if (!validPass)
                    throw { message: "Contraseña o usuario incorrecto" };
                token = jwt.sign(
                    {
                        id: valid.id,
                        // id_student: valid.Person.Student.id,
                        id_person: valid.id_person,
                        // AGREGADO PARA TIPO ESTUDIANTES Y DOCENTE
                        // type: valid.type
                    },
                    "mysecretkey",
                    {
                        expiresIn: 10800,
                    }
                );
                data = {
                    message: "Access",
                    info: true,
                    token: token,
                    mode: valid.type,
                };
            });
            res.status(200).send(data);
        } catch (err) {
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    // MPT
    changePassword: async (req, res) => {
        try {
            let hashPass = await abox.encrytedPass(req.body.password);
            await ST.transaction(async (t) => {
                let user = await Model.findOne({
                    where: { id: req.userId },
                });

                await user.update({ pass: hashPass }, { transaction: t });
            });
            res.status(200).send({ message: "Contraseña cambiada" });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    //DASHBOARD
    retrivePersonProfileIntranet: async (req, res) => {
        try {
            const user = await Model.findOne({
                where: { id: req.userId },
            });

            let data = await Person.findOne({
                where: { id: user.id_person },
                include: [
                    {
                        attributes: ["id", "description"],
                        model: District,
                        as: "Districts_birth",
                        include: {
                            attributes: ["id", "description"],
                            model: Province,
                            as: "Province",
                            include: {
                                attributes: ["id", "description"],
                                model: Department,
                                as: "Department",
                                include: {
                                    attributes: ["id", "description"],
                                    model: Country,
                                    as: "Country",
                                },
                            },
                        },
                    },
                    {
                        attributes: ["id", "description"],
                        model: District,
                        as: "Districts_reside",
                        include: {
                            attributes: ["id", "description"],
                            model: Province,
                            as: "Province",
                            include: {
                                attributes: ["id", "description"],
                                model: Department,
                                as: "Department",
                                include: {
                                    attributes: ["id", "description"],
                                    model: Country,
                                    as: "Country",
                                },
                            },
                        },
                    },
                ],
            });

            res.status(200).send(data);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    retriveDataAdministrativeIntranet: async (req, res) => {
        try {
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: [
                    "id",
                    "description",
                    "description_document",
                    "abbreviation",
                ],
                where: { state: true },
            });

            let managers1 = [
                {
                    id: "1",
                    unit: "--",
                    sede: "--",
                    name: "--",
                    number: "---",
                    email: "....",
                },
            ];
            let managers2 = [
                {
                    id: "1",
                    unit: "Segunda Especialidad",
                    sede: "Tarapoto",
                    name: "Sandra Melissa Grandez Alva",
                    number: "941 839 919",
                    email: "941 839 919",
                },
            ];

            if (principalOrganicUnit.id == 1) {
                res.status(200).send(managers1);
            } else {
                res.status(200).send(managers2);
            }
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    retriveDataDocumentSolicited: async (req, res) => {
        try {
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: [
                    "id",
                    "description",
                    "description_document",
                    "abbreviation",
                ],
                where: { state: true },
            });

            let managers1 = [
                {
                    id: "1",
                    type: "Maestria",
                    description: "Solicitud Grado de Maestria",
                    url: "https://drive.google.com/file/d/1xCgt3MkSTOpq5EzxZrp7Gcy95KktIFvF/view?usp=sharing",
                },
                {
                    id: "2",
                    type: "Doctorado",
                    description: "Solicitud Grado de Doctorado",
                    url: "https://drive.google.com/file/d/119Zqi9xOR8H2RI9DR4jvajQvIQU_kHvG/view?usp=sharing",
                },
            ];
            let managers2 = [
                // {
                //     id: '2',
                //     type: 'Segunda especialidad',
                //     description: 'Solicitud Grado de Doctorado',
                //     ulr: 'https://drive.google.com/file/d/119Zqi9xOR8H2RI9DR4jvajQvIQU_kHvG/view?usp=sharing',
                //
                // },
            ];

            if (principalOrganicUnit.id == 1) {
                res.status(200).send(managers1);
            } else {
                res.status(200).send(managers2);
            }
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    //PAGOS
    listStudentProgramIntranet: async (req, res) => {
        try {
            // const user = await Model.findOne({
            //     where: { id: req.userId },
            // });

            const data = await Student.findOne({
                attributes: ["id", "id_program", "id_organic_unit", "type"],
                where: { id: req.studentId },
                include: {
                    attributes: [
                        "id",
                        "id_academic_degree",
                        "denomination",
                        "description",
                    ],
                    model: Program,
                    as: "Program",
                },
            });

            res.status(200).send(data);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    // MPT
    listStudentPrograms: async (req, res) => {
        try {
            const user = await Model.findOne({
                where: { id: req.userId },
            });

            const data = await Student.findAll({
                attributes: ["id", "id_program"],
                where: { id_person: user.id_person },
                include: {
                    attributes: ["id", "abbreviation"],
                    model: Program,
                    as: "Program",
                },
            });

            res.status(200).send(data);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    listStudentPaymentIntranet: async (req, res) => {
        try {
            const data = await Payment.findAll({
                where: { id_student: req.studentId },
                include: [
                    {
                        model: Concept,
                        as: "Concept",
                    },
                    {
                        model: Academic_semester,
                        as: "Academic_semester",
                        include: {
                            model: Academic_calendar,
                            as: "Academic_calendar",
                        },
                    },
                ],
                order: [["created_at", "asc"]],
            });
            let _data = [];
            data.map((r) => {
                _data.push({
                    id: r.id,
                    concept: r.Concept.denomination,
                    amount: r.amount,
                    process:
                        r.Academic_semester.Academic_calendar.denomination.substr(
                            -4
                        ) +
                        " - " +
                        // r.Academic_semester.denomination.substr(-1),
                        r.Academic_semester.denomination.split(" ", 2)[1],
                    type: r.type,
                });
            });

            res.status(200).send(_data);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    listStudentMovementIntranet: async (req, res) => {
        try {
            const data = await Movement.findAll({
                where: { id_student: req.studentId },

                order: [["created_at", "asc"]],
            });

            res.status(200).send(data);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    listStudentRequeriment: async (req, res) => {
        try {
            const data = await Requeriment_delivered.findAll({
                attributes: ["state"],
                where: { id_student: req.params.id_student },
                include: {
                    attributes: ["description"],
                    model: Requeriment,
                    as: "Requeriment",
                },
            });
            res.status(200).send(data);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    createMovementIntranet: async (req, res) => {
        let archive = "";
        let tmp_path = "";
        let nameFile = req.body.voucher_code;
        let nameFile2 = req.body.id_student + moment();

        try {
            archive = nameFile + "." + req.files.file.name.split(".").pop();
            tmp_path = req.files.file.path;
            let target_path = url_person_voucher + archive;
            let movement = await Movement.findOne({
                where: { voucher_code: nameFile },
            });
            if (movement) {
                await fs.unlink(tmp_path);
            } else {
                await fs.rename(tmp_path, target_path);
            }
        } catch (e) {
            await fs.unlink(tmp_path);
            res.status(444).send(e);
        }

        try {
            await ST.transaction(async (t) => {
                let movement = await Movement.findOne({
                    where: { voucher_code: nameFile },
                });
                if (movement) throw "Ya se ha registrado ese número de voucher";
                let maxMovementID = await Movement.max(
                    "id",
                    { paranoid: false },
                    { transaction: t }
                );
                await Movement.create(
                    {
                        id: maxMovementID + 1,
                        id_student: req.body.id_student,
                        id_program: req.body.id_program,
                        id_organic_unit: req.body.id_organic_unit,
                        voucher_code: nameFile2,
                        voucher_url: archive,
                        type: "Deposíto",
                        state: "Registrado",
                    },
                    { transaction: t }
                );
            });
            res.status(200).send({ message: message.REGISTERED_OK });
        } catch (err) {
            console.log(err);
            res.status(445).send(err);
        }
    },
    //CALIFICACIONES
    listTeacherScheduleIntranet: async (req, res) => {
        try {
            const user = await Model.findOne({
                where: { id: req.userId },
            });
            const data = await Teacher.findAll({
                // attributes: ['id', 'type'],
                where: { id_person: user.id_person },
                include: {
                    model: Schedule,
                    as: "Schedule",
                    include: [
                        {
                            model: Course,
                            as: "Course",
                        },
                        {
                            model: Program,
                            as: "Program",
                        },
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
                    ],
                },

                // order: [['created_at', 'asc']],
            });
            let array = [];
            for (let i = 0; i < data.length; i++) {
                array.push({
                    id_teacher: data[i].id_teacher,
                    id_schedule: data[i].id_schedule,
                    start_date_schedule: data[i].Schedule.start_date,
                    end_date_schedule: data[i].Schedule.end_date,
                    end_date_acta_schedule: data[i].Schedule.end_date_acta,
                    id_course: data[i].Schedule.id_course,
                    course: data[i].Schedule.Course.denomination,
                    id_program: data[i].Schedule.id_program,
                    program: data[i].Schedule.Program.description,
                    id_process: data[i].Schedule.id_process,
                    type_registration: data[i].Schedule.type_registration,
                    process:
                        data[
                            i
                        ].Schedule.Academic_semester.Academic_calendar.denomination.substr(
                            -4
                        ) +
                        "-" +
                        data[i].Schedule.Academic_semester.denomination.substr(
                            -2
                        ),
                });
            }
            res.status(200).send(array);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    listTeacherScheduleAdmissionPlan: async (req, res) => {
        try {
            let registration = [];
            let data = [];
            let teacher;
            let schedule;
            await ST.transaction(async (t) => {
                let registrationData = await Registration_course.findAll(
                    {
                        where: { id_schedule: req.params.id_schedule },
                        include: {
                            required: true,
                            attributes: ["id", "type", "created_at"],
                            model: Registration,
                            as: "Registration",
                            include: {
                                required: true,
                                attributes: ["id", "id_admission_plan"],
                                model: Student,
                                as: "Student",
                                include: [
                                    {
                                        attributes: ["id", "description"],
                                        model: Admission_plan,
                                        as: "Admission_plan",
                                    },
                                    {
                                        required: true,
                                        attributes: [
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
                                ],
                            },
                        },
                        order: [
                            [
                                { model: Registration, as: "Registration" },
                                { model: Student, as: "Student" },
                                { model: Person, as: "Person" },
                                "paternal",
                                "asc",
                            ],
                        ],
                    },
                    { transaction: t }
                );
                teacher = await Teacher.findOne(
                    {
                        where: {
                            id_schedule: req.params.id_schedule,
                            principal: true,
                        },
                        include: {
                            attributes: [
                                "id",
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
                    },
                    { transaction: t }
                );
                schedule = await Schedule.findOne(
                    { where: { id: req.params.id_schedule } },
                    { transaction: t }
                );
                for (let i = 0; i < registrationData.length; i++) {
                    registration.push({
                        id_admission_plan:
                            registrationData[i].Registration.Student
                                .Admission_plan.id,
                        admission_plan:
                            registrationData[i].Registration.Student
                                .Admission_plan.description,
                    });
                }
            });
            let set = new Set(registration.map(JSON.stringify));
            let plan = Array.from(set).map(JSON.parse);

            data = {
                end_date: schedule.end_date ? schedule.end_date : "No Def.",
                id_teacher: teacher ? teacher.id : "",
                teacher:
                    teacher && teacher.Person ? teacher.Person.name : "No Def.",
                plan: plan,
            };

            res.status(200).send(data);
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    listTeacherScheduleStundent: async (req, res) => {
        try {
            let registrationData = [];
            let registration = [];
            await ST.transaction(async (t) => {
                registrationData = await Registration_course.findAll(
                    {
                        where: { id_schedule: req.params.id_schedule },
                        include: {
                            required: true,
                            attributes: ["id", "type", "created_at"],
                            model: Registration,
                            as: "Registration",
                            include: {
                                required: true,
                                where: {
                                    id_admission_plan:
                                        req.params.id_admission_plan,
                                },
                                attributes: ["id", "id_admission_plan"],
                                model: Student,
                                as: "Student",
                                include: [
                                    {
                                        required: true,
                                        attributes: [
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
                                ],
                            },
                        },
                        order: [
                            [
                                { model: Registration, as: "Registration" },
                                { model: Student, as: "Student" },
                                { model: Person, as: "Person" },
                                "paternal",
                                "asc",
                            ],
                        ],
                    },
                    { transaction: t }
                );
                for (let i = 0; i < registrationData.length; i++) {
                    registration.push({
                        id_registration_course: registrationData[i].id,
                        registration_course_type: registrationData[i].type,
                        registration_course_note: registrationData[i].note,
                        registration_course_note_letter:
                            await abox.numberToLetter(registrationData[i].note),
                        registration_course_state:
                            registrationData[i].state === "Sin nota"
                                ? true
                                : false,
                        id_registration: registrationData[i].Registration.id,
                        registration_type:
                            registrationData[i].Registration.type,
                        registration_created_at:
                            registrationData[i].Registration.created_at,
                        id_student: registrationData[i].Registration.Student.id,
                        id_person:
                            registrationData[i].Registration.Student.Person.id,
                        document_number:
                            registrationData[i].Registration.Student.Person
                                .document_number,
                        email: registrationData[i].Registration.Student.Person
                            .email,
                        name: registrationData[i].Registration.Student.Person
                            .name,
                        photo: registrationData[i].Registration.Student.Person
                            .photo,
                    });
                }
            });
            let set = new Set(registration.map(JSON.stringify));
            let arrSinDuplicaciones = Array.from(set).map(JSON.parse);
            res.status(200).send(arrSinDuplicaciones);
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    listTeacherActaBookBySchedule: async (req, res) => {
        try {
            let code_acta;
            let id_acta_book;
            await ST.transaction(async (t) => {
                let corre = await ActaBook.findOne(
                    {
                        // attributes: ['id', 'id_student', 'type', 'correlative', 'observation', 'created_at'],
                        where: {
                            id_schedule: req.params.id_schedule,
                            id_admission_plan: req.params.id_admission_plan,
                        },
                        include: {
                            required: true,
                            attributes: ["denomination"],
                            model: Academic_semester,
                            as: "Academic_semester",
                            include: {
                                required: true,
                                attributes: ["denomination"],
                                model: Academic_calendar,
                                as: "Academic_calendar",
                            },
                        },
                    },
                    { transaction: t }
                );

                let temp = corre
                    ? corre.Academic_semester.Academic_calendar.denomination.substr(
                          -4
                      ) +
                      "" +
                      corre.Academic_semester.denomination.substr(-1) +
                      "" +
                      corre.id_course +
                      "" +
                      corre.id_program +
                      "" +
                      corre.id_admission_plan +
                      "" +
                      corre.type +
                      "-" +
                      corre.correlative
                    : "";
                code_acta = temp;
                id_acta_book = corre ? corre.id : "";
            });

            // In this case, an instance of Model

            res.status(200).send({ id_acta_book, code_acta });
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err);
        }
    },
    reportTeacherActa: async (req, res) => {
        try {
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: [
                    "description",
                    "description_document",
                    "abbreviation",
                ],
                where: { state: true },
            });
            const acta = await Acta_book.findOne({
                // attributes: ['id'],
                where: {
                    id: req.params.id_acta_book,
                },
                include: [
                    {
                        required: true,
                        attributes: ["denomination"],
                        model: Program,
                        as: "Program",
                        include: [
                            {
                                attributes: ["id", "denomination"],
                                model: Organic_unit,
                                as: "Organic_unit_register",
                                include: {
                                    attributes: ["denomination"],
                                    model: Campus,
                                    as: "Campu",
                                },
                            },
                            {
                                attributes: ["id", "denomination"],
                                model: Organic_unit,
                                as: "Organic_unit_origin",
                                include: {
                                    attributes: ["denomination"],
                                    model: Campus,
                                    as: "Campu",
                                },
                            },
                        ],
                    },
                    {
                        required: true,
                        attributes: ["denomination", "type", "credits"],
                        model: Course,
                        as: "Course",
                    },
                    {
                        required: true,
                        attributes: ["denomination"],
                        model: Academic_semester,
                        as: "Academic_semester",
                        include: {
                            required: true,
                            attributes: ["denomination"],
                            model: Academic_calendar,
                            as: "Academic_calendar",
                        },
                    },
                ],
            });
            const teacher = await Teacher.findOne({
                attributes: ["id"],
                where: { id_schedule: acta.id_schedule, principal: true },
                model: Teacher,
                as: "Teacher",
                include: {
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
            });

            const studentsTemp = await Registration_course.findAll({
                where: { id_schedule: acta.id_schedule },

                include: {
                    required: true,
                    attributes: ["id"],
                    model: Registration,
                    as: "Registration",
                    include: {
                        required: true,
                        attributes: ["id"],
                        where: { id_admission_plan: acta.id_admission_plan },
                        model: Student,
                        as: "Student",
                        include: {
                            required: true,
                            attributes: [
                                "document_number",
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
                    },
                },
            });

            const acta_date = acta.created_at;
            let correlative = acta
                ? acta.Academic_semester.Academic_calendar.denomination.substr(
                      -4
                  ) +
                  "" +
                  acta.Academic_semester.denomination.substr(-1) +
                  "" +
                  acta.id_course +
                  "" +
                  acta.id_program +
                  "" +
                  acta.id_admission_plan +
                  "" +
                  acta.type +
                  "-" +
                  acta.correlative
                : "";
            const campus =
                acta.Program.Organic_unit_register.Campu.denomination.toUpperCase();
            const program = acta.Program.denomination.toUpperCase();
            const faculty =
                acta.Program.Organic_unit_origin.denomination.toUpperCase();
            let students = [];
            let approvedStudent = 0;
            let desaprovedStudent = 0;
            let totalStudent = studentsTemp.length;
            for (let i = 0; i < studentsTemp.length; i++) {
                students.push([
                    i + 1,
                    studentsTemp[i].Registration.Student.Person.name,
                    studentsTemp[i].Registration.Student.Person.document_number,
                    await abox.numberToLetter(studentsTemp[i].note),
                    studentsTemp[i].note,
                ]);
                if (studentsTemp[i].note >= 14) {
                    approvedStudent++;
                } else {
                    desaprovedStudent++;
                }
            }

            const data = {
                acta_date,
                principalOrganicUnit,
                campus,
                faculty,
                program,
                correlative,
                teacher: teacher ? teacher.Person.name : "No def.",
                semester:
                    acta.Academic_semester.Academic_calendar.denomination.substr(
                        -4
                    ) +
                    "-" +
                    acta.Academic_semester.denomination.substr(-1),
                Course: {
                    denomination: acta.Course.denomination.toUpperCase(),
                    type: acta.Course.type.toUpperCase(),
                    credits: acta.Course.credits,
                },
                students,
                totalStudent,
                approvedStudent,
                desaprovedStudent,
            };
            res.status(200).send(data);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    //TRAMITES
    listConceptIntranet: async (req, res) => {
        try {
            let program = await Student.findOne({
                attributes: ["id"],
                where: { id: req.params.id },
                include: [
                    {
                        attributes: ["id", "id_academic_degree"],
                        model: Program,
                        as: "Program",
                    },
                    {
                        attributes: ["id"],
                        required: true,
                        model: Plan,
                        as: "Plan",
                        include: {
                            attributes: ["id"],
                            required: true,
                            where: { state: true },
                            model: Ciclo,
                            as: "Ciclos",
                        },
                    },
                ],
            });
            let totalCiclos =
                program && program.Plan && program.Plan.Ciclos.length;

            let id = [];
            let type = "";
            if (
                program.Program.id_academic_degree == 2 ||
                program.Program.id_academic_degree == 3
            ) {
                type = "Maestría";
                id = [2, 18, 36, 111, 59, 48, 38, 86, 6, 125];
            } else if (program.Program.id_academic_degree == 4) {
                type = "Doctorado";
                id = [1, 18, 117, 120, 119, 47, 37, 86, 6, 121];
            } else if (program.Program.id_academic_degree == 5) {
                type = "Especialista";
                id = [98, 115, 113, 102, 103, 122];
            }

            let actualUit = await Uit.findOne({ where: { state: true } });
            let records = await Concept.findAll({
                attributes: ["id", "denomination", "type", "percent", "state"],
                where: {
                    type: "Ingreso",
                    id: { [Op.or]: id },
                },

                order: [["order", "asc"]],
            });
            let data = [];
            let total = 0;
            for (let i = 0; i < records.length; i++) {
                total = Math.round(
                    (parseFloat(records[i].percent) *
                        parseFloat(actualUit.amount)) /
                        100
                );
                if (
                    records[i].id == 59 ||
                    records[i].id == 102 ||
                    records[i].id == 120
                ) {
                    total = parseFloat(total) * parseFloat(totalCiclos);
                }
                data.push({
                    id: records[i].id,
                    denomination: records[i].denomination,
                    state: false,
                    percent: total,
                });
            }

            res.status(200).send(data);
        } catch (err) {
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    listConceptOperation: async (req, res) => {
        try {
            let program = await Student.findOne({
                attributes: ["id"],
                where: { id: req.params.id },
                include: [
                    {
                        attributes: ["id", "id_academic_degree"],
                        model: Program,
                        as: "Program",
                    },
                    {
                        attributes: ["id"],
                        required: true,
                        model: Plan,
                        as: "Plan",
                        include: {
                            attributes: ["id"],
                            required: true,
                            where: { state: true },
                            model: Ciclo,
                            as: "Ciclos",
                        },
                    },
                ],
            });
            let totalCiclos =
                program && program.Plan && program.Plan.Ciclos.length;

            let id = [];
            let type = "";
            if (
                program.Program.id_academic_degree == 2 ||
                program.Program.id_academic_degree == 3
            ) {
                type = "Maestría";
                id = [2, 18, 36, 111, 59, 48, 38, 86, 6, 125, 13, 52, 57, 17];
            } else if (program.Program.id_academic_degree == 4) {
                type = "Doctorado";
                id = [1, 18, 117, 120, 119, 47, 37, 86, 6, 121, 12, 53, 57, 17];
            } else if (program.Program.id_academic_degree == 5) {
                type = "Especialista";
                id = [
                    115, 102, 113, 39, 86, 98, 6, 122, 108, 107, 106, 17, 110,
                    126, 116, 128, 109, 129, 130, 131, 132, 133, 112, 105,
                ];
            }

            let actualUit = await Uit.findOne({ where: { state: true } });
            let records = await Concept.findAll({
                attributes: ["id", "denomination", "type", "percent", "state"],
                where: {
                    type: "Ingreso",
                    id: { [Op.or]: id },
                },

                order: [["order", "asc"]],
            });
            let data = [];
            let total = 0;
            for (let i = 0; i < records.length; i++) {
                total = Math.round(
                    (parseFloat(records[i].percent) *
                        parseFloat(actualUit.amount)) /
                        100
                );
                if (
                    records[i].id == 59 ||
                    records[i].id == 102 ||
                    records[i].id == 120
                ) {
                    total = parseFloat(total) * parseFloat(totalCiclos);
                }
                data.push({
                    id: records[i].id,
                    denomination: records[i].denomination,
                    state: false,
                    percent: total,
                });
            }

            res.status(200).send(data);
        } catch (err) {
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    listStudentConceptValidIntranet: async (req, res) => {
        try {
            //tengo que avanzar rapido tal vez no sea la mejor opccion pero tengo que terminar
            // solo valido de acuerdo a la deuda de inscripcion o matricula

            //buscamos los requisitos pendientes
            let requeriment = [];
            let pendientRequeriment = false;
            requeriment = await Requeriment_delivered.findAll({
                // attributes: ['id', 'type'],
                where: {
                    id_student: req.params.id_student,
                },
            });
            requeriment.map((r) => {
                if (r.state === false) {
                    pendientRequeriment = true;
                }
            });

            const dataOne = await Payment.findAll({
                // attributes: ['id', 'type'],
                where: {
                    id_student: req.params.id_student,
                    denomination: { [Op.or]: ["Inscripción", "Matrícula"] },
                },
                include: [
                    {
                        model: Concept,
                        as: "Concept",
                    },
                    {
                        model: Academic_semester,
                        as: "Academic_semester",
                        include: {
                            model: Academic_calendar,
                            as: "Academic_calendar",
                        },
                    },
                ],
                order: [["created_at", "asc"]],
            });
            // listo todos los pagos
            const dataTwo = await Payment.findAll({
                // attributes: ['id', 'type'],
                where: {
                    id_student: req.params.id_student,
                    denomination: {
                        [Op.or]: ["Inscripción", "Matrícula", "Pensión"],
                    },
                },
                include: [
                    {
                        model: Concept,
                        as: "Concept",
                    },
                    {
                        model: Academic_semester,
                        as: "Academic_semester",
                        include: {
                            model: Academic_calendar,
                            as: "Academic_calendar",
                        },
                    },
                ],
                order: [["created_at", "asc"]],
            });

            let payments = [];
            let pendientPayment = false;

            dataOne.map((r) => {
                if (r.type === "Pendiente") {
                    pendientPayment = true;
                }
            });

            dataTwo.map((r) => {
                payments.push({
                    id: r.id,
                    id_concept: r.Concept.id,
                    concept: r.Concept.denomination,
                    amount: r.amount,
                    process:
                        r.Academic_semester.Academic_calendar.denomination.substr(
                            -4
                        ) +
                        " - " +
                        r.Academic_semester.denomination.substr(-1),
                    type: r.type,
                });
            });
            res.status(200).send({
                payments,
                pendientPayment,
                pendientRequeriment,
            });
        } catch (err) {
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    createProcedureStudentIntranet: async (req, res) => {
        let temp = JSON.parse(req.body.concepts);
        try {
            await ST.transaction(async (t) => {
                let student = await Student.findByPk(req.body.id_student);
                let actualUit = await Uit.findOne({
                    attributes: ["id", "amount"],
                    where: { state: true },
                });
                let actualSemester = await Academic_semester.findOne({
                    attributes: ["id"],
                    where: { actual: true },
                });
                let payments = [];
                for (let i = 0; i < temp.length; i++) {
                    let maxPaymnetID = await Payment.max(
                        "id",
                        { paranoid: false },
                        { transaction: t }
                    );
                    //listamos los conceptos de acuerdo a lo que selecciona el estudiante
                    let concept = await Concept.findByPk(temp[i]);
                    let amountActual = Math.round(
                        (parseFloat(concept.percent) *
                            parseFloat(actualUit.amount)) /
                            100
                    );
                    let tempPayment = await Payment.create(
                        {
                            id: maxPaymnetID + 1 + i,
                            id_student: student.id,
                            id_program: student.id_program,
                            id_organic_unit: student.id_organic_unit,
                            id_semester: actualSemester.id,
                            id_concept: concept.id,
                            denomination: concept.denomination,
                            amount: amountActual,
                            type: "Pendiente",
                            generate: 1,
                            state: false,
                        },
                        { transaction: t }
                    );
                    payments.push(tempPayment);
                }
                await Promise.all(payments);
            });
            res.status(200).send({ message: message.REGISTERED_OK });
        } catch (err) {
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    listProcedureStudentIntranet: async (req, res) => {
        try {
            let records = await Payment.findAll({
                attributes: [
                    "id",
                    "amount",
                    "denomination",
                    "type",
                    "generate",
                    "state",
                    "created_at",
                ],
                where: {
                    [Op.or]: [{ id_student: req.params.id }],
                    [Op.and]: [
                        { denomination: { [Op.ne]: "Inscripción" } },
                        { denomination: { [Op.ne]: "Matrícula" } },
                        { denomination: { [Op.ne]: "Pensión" } },
                    ],
                },
                include: {
                    attributes: ["file", "state_upload"],
                    model: Document_book,
                    as: "Document_book",
                },
                order: [["created_at", "asc"]],
            });

            res.status(200).send(records);
        } catch (err) {
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    createComprobanteProcedureIntranet: async (req, res) => {
        let archive = "";
        let target_path = "";
        let tmp_path = "";
        let nameFile = req.body.id_student + "-" + moment();
        let nameFile2 = req.body.id_student + "-" + req.body.voucher_code;
        try {
            archive = nameFile + "." + req.files.file.name.split(".").pop();
            tmp_path = req.files.file.path;
            target_path = url_person_voucher + archive;
            let movement = await Movement.findOne({
                where: { voucher_code: nameFile2 },
            });

            if (movement) {
                throw "Ya se ha registrado el codigo de comprobante!";
            } else {
                //copy file in new route
                await fs.copyFile(tmp_path, target_path);
            }
            // delete temp file
            await fs.unlink(tmp_path);
        } catch (e) {
            await fs.unlink(tmp_path);
            res.status(444).send(e);
        }

        try {
            await ST.transaction(async (t) => {
                let programData = await Student.findOne({
                    where: { id: req.body.id_student },
                    include: {
                        model: Program,
                        as: "Program",
                    },
                });
                let movement = await Movement.findOne({
                    where: { voucher_code: nameFile2 },
                });
                if (movement)
                    throw "Ya se ha registrado el codigo de comprobante !!";
                let maxMovementID = await Movement.max(
                    "id",
                    { paranoid: false },
                    { transaction: t }
                );
                await Movement.create(
                    {
                        id: maxMovementID + 1,
                        id_student: req.body.id_student,
                        id_program: programData.Program.id,
                        id_organic_unit:
                            programData.Program.id_unit_organic_register,
                        voucher_code: nameFile2,
                        voucher_url: archive,
                        type: "Deposíto",
                        state: "Registrado",
                    },
                    { transaction: t }
                );
            });
            res.status(200).send({ message: message.REGISTERED_OK });
        } catch (err) {
            await fs.unlink(target_path);

            res.status(445).send(err);
        }
    },
    // MPT
    reportAcademicRecord: async (req, res) => {
        let registration = [];
        try {
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: ["description", "abbreviation"],
                where: { state: true },
            });

            const studentData = await Student.findOne({
                attributes: ["id", "id_plan", "id_program", "type"],
                where: {
                    id: req.studentId,
                },
                include: [
                    {
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
                    {
                        attributes: ["description"],
                        model: Admission_plan,
                        as: "Admission_plan",
                    },
                    {
                        attributes: ["denomination"],
                        model: Program,
                        as: "Program",
                        include: {
                            attributes: ["denomination"],
                            model: Organic_unit,
                            as: "Organic_unit_register",
                            include: {
                                attributes: ["denomination"],
                                model: Campus,
                                as: "Campu",
                            },
                        },
                    },
                ],
            });

            let registrationData = await Registration.findAll({
                attributes: [
                    "id",
                    "id_semester",
                    "type",
                    "state",
                    "deleted_at",
                ],
                where: { id_student: req.studentId },
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
                        required: true,
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
                    ["created_at", "asc"],
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
            });
            for (let i = 0; i < registrationData.length; i++) {
                registration.push({
                    id: registrationData[i].id,
                    id_semester: registrationData[i].id_semester,
                    type: registrationData[i].type,
                    state: registrationData[i].state,
                    deleted_at: registrationData[i].deleted_at,
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

                    Registration_course: [],
                });
                for (
                    let j = 0;
                    j < registrationData[i].Registration_course.length;
                    j++
                ) {
                    registration[i].Registration_course.push({
                        id: registrationData[i].Registration_course[j].Course
                            .id,
                        denomination:
                            registrationData[i].Registration_course[j].Course
                                .denomination,
                        order: registrationData[i].Registration_course[j].Course
                            .order,
                        credits:
                            registrationData[i].Registration_course[j].Course
                                .credits,
                        type_course:
                            registrationData[i].Registration_course[j].Course
                                .type,
                        ciclo: registrationData[i].Registration_course[j].Course
                            .Ciclo.ciclo,
                        state: true,
                        note_state:
                            registrationData[i].Registration_course[j].state ===
                            "Sin nota"
                                ? true
                                : false, //genero este estado para poder manejar mejor en la vista
                        //registration table
                        id_registration:
                            registrationData[i].Registration_course[j].id,
                        id_schedule:
                            registrationData[i].Registration_course[j]
                                .id_schedule,
                        note: registrationData[i].Registration_course[j].note,
                        type: registrationData[i].Registration_course[j].state,
                        // MPT
                        code: registrationData[i].Registration_course[j].Course
                            .code,
                    });
                }
            }

            res.status(200).send({
                principalOrganicUnit,
                studentData,
                registration,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },

    listStudentDocuments: async (req, res) => {
        try {
            let documents = await Document_book.findAll({
                attributes: [
                    "id",
                    "id_concept",
                    "id_student",
                    "file",
                    "state_upload",
                    "state",
                    "created_at",
                ],
                where: {
                    id_student: req.studentId,
                    // state_upload: true
                    // file: {
                    //     [Op.not]: null,
                    // },
                },
                include: {
                    attributes: ["denomination"],
                    model: Concept,
                    as: "Concept",
                },
                order: [["created_at", "asc"]],
            });

            res.status(200).send(documents);
        } catch (err) {
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
};
