const Sequelize = require("sequelize");
const appRoot = require("app-root-path");
const Fn = Sequelize.fn;
const fs = require("fs");
const Col = Sequelize.col;
const message = require("../../messages");
const Op = Sequelize.Op;
const Student = require("../../models").Student;
const ST = Student.sequelize;
const moment = require("moment");
const abox = require("../Abox");
const _ = require("lodash");
const Movement = require("../../models").Movement;
const Admission_plan = require("../../models").Admission_plan;
const Program = require("../../models").Programs;
const Organic_unit = require("../../models").Organic_unit;
const Egress = require("../../models").Egress;
const Campus = require("../../models").Campus;
const Person = require("../../models").Person;
const Plan = require("../../models").Plan;
const District = require("../../models").District;
const Province = require("../../models").Province;
const Department = require("../../models").Department;
const Academic_semester = require("../../models").Academic_semester;
const Academic_calendar = require("../../models").Academic_calendar;
const Concept = require("../../models").Concept;
const Academic_degree = require("../../models").Academic_degree;
const Registration = require("../../models").Registration;
const Registration_course = require("../../models").Registration_course;
const Course = require("../../models").Course;
const Horary = require("../../models").Horary;
const Ciclo = require("../../models").Ciclo;
const Acta_book = require("../../models").Acta_book;
const Schedule = require("../../models").Schedule;
const Authority = require("../../models").Authority;
const Teacher = require("../../models").Teacher;
const System_configuration = require("../../models").System_configuration;
const Payment = require("../../models").Payment;
const Requeriment_delivered = require("../../models").Requeriment_delivered;
const Document_book = require("../../models").Document_book;
const Cost_admission_plan = require("../../models").Cost_admission_plan;
const Requeriment = require("../../models").Requeriment;

moment.locale("es-mx");
module.exports = {
    reportPaymentProgramAdmision: async (req, res) => {
        try {
            let movements = [];
            let info = "";
            let _tempTotal = 0;
            await ST.transaction(async (t) => {
                movements = await Student.findAll(
                    {
                        where: {
                            id_admission_plan: req.params.id_admission_plan,
                        },
                        attributes: ["id"],
                        include: [
                            {
                                required: true,
                                where: { state: "Aceptado" },
                                attributes: [
                                    "voucher_code",
                                    "voucher_amount",
                                    "voucher_date",
                                    "voucher_url",
                                    "observation",
                                    "type",
                                    "state",
                                    "created_at",
                                    "updated_at",
                                ],
                                model: Movement,
                                as: "Movement",
                            },
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
                        ],
                    },
                    { transaction: t }
                );
                let data = await Admission_plan.findOne(
                    {
                        where: { id: req.params.id_admission_plan },
                        attributes: ["description"],
                        include: {
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
                    },
                    { transaction: t }
                );
                info = {
                    admission_plan_denomination: data.description.toUpperCase(),
                    program_denomination:
                        data.Program.denomination.toUpperCase(),
                    organic_unit_denomination:
                        data.Program.Organic_unit_register.denomination.toUpperCase(),
                    sede_denomination:
                        data.Program.Organic_unit_register.Campu.denomination.toUpperCase(),
                };
            });

            res.status(200).send({ movements: movements, info: info });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },

    reportInscription: async (req, res) => {
        try {
            let inscriptions = [];
            let info = "";
            await ST.transaction(async (t) => {
                inscriptions = await Student.findAll(
                    {
                        where: { id_program: req.params.id_program },
                        attributes: ["id", "type", "created_at", "updated_at"],
                        include: [
                            {
                                attributes: [
                                    "id",
                                    "document_number",
                                    "address",
                                    "gender",
                                    "birth_date",
                                    "phone",
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
                                    "updated_at",
                                ],
                                model: Person,
                                as: "Person",
                            },
                            {
                                attributes: ["description"],
                                model: Plan,
                                as: "Plan",
                            },
                            {
                                attributes: ["description"],
                                model: Admission_plan,
                                as: "Admission_plan",
                            },
                        ],
                    },
                    { transaction: t }
                );

                // let data = await Admission_plan.findOne({
                //     where: {id: req.params.id_admission_plan},
                //     attributes: ['description'],
                //     include: {
                //
                //         attributes: ['denomination'],
                //         model: Program,
                //         as: "Program",
                //         include: {
                //             attributes: ['denomination'],
                //             model: Organic_unit,
                //             as: "Organic_unit_register",
                //             include: {
                //                 attributes: ['denomination'],
                //                 model: Campus,
                //                 as: "Campu"
                //             }
                //         }
                //     }
                // }, {transaction: t});
                // info = {
                //     admission_plan_denomination: data.description.toUpperCase(),
                //     program_denomination: data.Program.denomination.toUpperCase(),
                //     organic_unit_denomination: data.Program.Organic_unit_register.denomination.toUpperCase(),
                //     sede_denomination: data.Program.Organic_unit_register.Campu.denomination.toUpperCase(),
                // }
            });
            res.status(200).send({ inscriptions: inscriptions, info: info });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },

    reportSuneduEntry: async (req, res) => {
        try {
            let students = [];
            let data = [];
            await ST.transaction(async (t) => {
                students = await Student.findAll(
                    {
                        attributes: [
                            "id",
                            "type_entry",
                            "study_modality",
                            "id_organic_unit",
                        ],
                        include: [
                            {
                                required: true,
                                where: { id_process: req.params.id_process },
                                attributes: [
                                    "description",
                                    "type_process",
                                    "date_start",
                                ],
                                model: Admission_plan,
                                as: "Admission_plan",
                                include: [
                                    {
                                        attributes: ["denomination"],
                                        model: Academic_semester,
                                        as: "Process",
                                        include: {
                                            attributes: ["denomination"],
                                            model: Academic_calendar,
                                            as: "Academic_calendar",
                                        },
                                    },
                                    {
                                        required: true,
                                        attributes: [
                                            "code",
                                            "denomination",
                                            "description",
                                        ],
                                        model: Program,
                                        as: "Program",
                                        include: [
                                            {
                                                required: true,
                                                attributes: ["denomination"],
                                                where: {
                                                    denomination:
                                                        req.params
                                                            .academic_degree,
                                                },
                                                model: Academic_degree,
                                                as: "Academic_degree",
                                            },
                                            {
                                                required: true,
                                                attributes: [
                                                    "denomination",
                                                    "code_local",
                                                    "code_faculty_unit",
                                                ],
                                                model: Organic_unit,
                                                as: "Organic_unit_register",
                                                include: {
                                                    attributes: [
                                                        "code",
                                                        "denomination",
                                                    ],
                                                    model: Campus,
                                                    as: "Campu",
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                required: true,
                                attributes: [
                                    "id_identification_document",
                                    "id_ubigeo_birth",
                                    "id_ubigeo_resident",
                                    "id_nationality",
                                    "document_number",
                                    "name",
                                    "paternal",
                                    "maternal",
                                    "gender",
                                    "birth_date",
                                    "just_last_name",
                                ],
                                model: Person,
                                as: "Person",
                            },
                            {
                                attributes: ["id", "denomination"],
                                model: Concept,
                                as: "Concept",
                            },
                        ],
                    },
                    { transaction: t }
                );

                let tipoingresante,
                    tipodocumento,
                    tipoproceso,
                    codigosedefilial,
                    numerodocumento,
                    nombres,
                    primerapellido,
                    segundoapellido,
                    sexo,
                    modalidadeingresotemp,
                    fechanacimiento,
                    paisnacimiento,
                    nacionality,
                    ubigeonacimiento,
                    ubigeoreisdencia,
                    codigofacultadunidad,
                    codigoprograma,
                    fechaingreso,
                    modalidadeingreso,
                    modalidadestudio,
                    process,
                    year,
                    programa;
                for (let i = 0; i < students.length; i++) {
                    tipodocumento = students[i].Person
                        ? students[i].Person.id_identification_document
                        : null;
                    codigosedefilial =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Program &&
                        students[i].Admission_plan.Program
                            .Organic_unit_register &&
                        students[i].Admission_plan.Program.Organic_unit_register
                            .Campu
                            ? students[i].Admission_plan.Program
                                  .Organic_unit_register.Campu.code
                            : null;
                    tipoproceso = students[i].Admission_plan
                        ? students[i].Admission_plan.type_process
                        : null;
                    numerodocumento = students[i].Person
                        ? students[i].Person.document_number
                        : null;
                    nombres = students[i].Person
                        ? students[i].Person.name
                        : null;
                    primerapellido = students[i].Person
                        ? students[i].Person.paternal
                        : null;
                    segundoapellido = students[i].Person
                        ? students[i].Person.maternal
                        : null;
                    segundoapellido = students[i].Person
                        ? students[i].Person.maternal
                        : null;
                    sexo = students[i].Person
                        ? students[i].Person.gender
                        : null;
                    fechanacimiento = students[i].Person
                        ? students[i].Person.birth_date
                        : null;
                    nacionality = students[i].Person
                        ? students[i].Person.id_nationality
                        : null;
                    ubigeonacimiento = students[i].Person
                        ? students[i].Person.id_ubigeo_birth
                        : null;
                    ubigeoreisdencia = students[i].Person
                        ? students[i].Person.id_ubigeo_resident
                        : null;
                    codigofacultadunidad =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Program &&
                        students[i].Admission_plan.Program.Organic_unit_register
                            ? students[i].Admission_plan.Program
                                  .Organic_unit_register.code_faculty_unit
                            : null;
                    codigoprograma =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Program
                            ? students[i].Admission_plan.Program.code
                            : null;

                    fechaingreso = students[i].Admission_plan
                        ? students[i].Admission_plan.date_start
                        : null;
                    tipoingresante =
                        moment(fechaingreso).format("L") >= 2020 ? 1 : 2; // NUEVO INGRESANTE (1) --- ANTES DE 2020 (2)
                    modalidadestudio =
                        moment(fechaingreso).format("L") >= 2020 ? 3 : 1;

                    modalidadeingresotemp = students[i].Concept
                        ? students[i].Concept.id
                        : 81;
                    modalidadeingreso =
                        modalidadeingresotemp === 81
                            ? 8
                            : modalidadeingresotemp === 82
                            ? 2
                            : 3;

                    process =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Process
                            ? students[i].Admission_plan.Process.denomination
                            : null;
                    year =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Process &&
                        students[i].Admission_plan.Process.Academic_calendar
                            ? students[i].Admission_plan.Process
                                  .Academic_calendar.denomination
                            : null;
                    programa =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Program
                            ? students[i].Admission_plan.Program.description
                            : "No def";

                    data.push({
                        TIPO_INGRESANTE: tipoingresante,
                        CODIGO_SEDE_FILIAL: codigosedefilial,
                        TIPO_PROCESO: tipoingresante === 1 ? 1 : null,
                        PROCESO_ADMISION_PERIODO_INGRESO:
                            year.substr(-4) + "-" + process.substr(-1), //aqui falta
                        TIPO_DOCUMENTO: tipodocumento,
                        NRO_DOCUMENTO: numerodocumento,
                        NOMBRES: nombres,
                        PRIMER_APELLIDO: primerapellido,
                        SEGUNDO_APELLIDO: segundoapellido,
                        APELLIDO_CASADA: null,
                        SOLO_UN_APELLIDO: 0, // INDICA QUE TIENE LOS DOS APELLIDOS (0)  INDICA QUE SOLO TIENE UN APELLIDO (1)
                        SEXO: sexo === "Masculino" ? 1 : 2,
                        FECHA_NACIMIENTO: moment(fechanacimiento).format("L"),
                        PAIS_NACIMIENTO: 9233,
                        NACIONALIDAD: nacionality,
                        UBIGEO_NACIMIENTO: ubigeonacimiento,
                        UBIGEO_DOMICILIO: ubigeoreisdencia,
                        LENGUA_NATIVA: null, // NO REQUIRIDO
                        IDIOMA_EXTRANJERO: null, // NO REQUIRIDO
                        CONDICION_DISCAPACIDAD: null, // NO REQUIRIDO
                        CODIGO_FACULTAD_UNIDAD: codigofacultadunidad,
                        CODIGO_PROGRAMA: codigoprograma,
                        FECHA_INGRESO: moment(fechaingreso).format("L"),
                        MODALIDAD_INGRESO: modalidadeingreso, //2=>82	Traslados Internos		3=83,84	Traslados Externos		8 =>81	Ordinarios
                        OTRA_MODALIDAD_INGRESO: null, // NO REQUIRIDO
                        MODALIDAD_ESTUDIO: modalidadestudio, // 1	PresenciaL   2	Semi-Presencial   3	A distancia  (Pendiente)
                        CODIGO_ORCID: null, // NO REQUIRIDO
                        UNIDAD_ORGANICA_POS: students[i].id_organic_unit,
                        ID_STUDENT: students[i].id,
                        PROGRAMA: programa,
                    });
                }
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
    reportExecelEntry: async (req, res) => {
        try {
            let students = [];
            let data = [];
            await ST.transaction(async (t) => {
                students = await Student.findAll(
                    {
                        attributes: ["id", "type_entry", "study_modality"],
                        include: [
                            {
                                required: true,
                                where: { id_process: req.params.id_process },
                                attributes: [
                                    "description",
                                    "type_process",
                                    "date_start",
                                ],
                                model: Admission_plan,
                                as: "Admission_plan",
                                include: [
                                    {
                                        attributes: ["denomination"],
                                        model: Academic_semester,
                                        as: "Process",
                                        include: {
                                            attributes: ["denomination"],
                                            model: Academic_calendar,
                                            as: "Academic_calendar",
                                        },
                                    },
                                    {
                                        required: true,
                                        attributes: ["code", "denomination"],
                                        model: Program,
                                        as: "Program",
                                        include: [
                                            {
                                                required: true,
                                                attributes: ["denomination"],
                                                where: {
                                                    denomination:
                                                        req.params
                                                            .academic_degree,
                                                },
                                                model: Academic_degree,
                                                as: "Academic_degree",
                                            },
                                            {
                                                required: true,
                                                attributes: [
                                                    "denomination",
                                                    "code_local",
                                                    "code_faculty_unit",
                                                ],
                                                model: Organic_unit,
                                                as: "Organic_unit_register",
                                                include: {
                                                    attributes: [
                                                        "code",
                                                        "denomination",
                                                    ],
                                                    model: Campus,
                                                    as: "Campu",
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                required: true,
                                attributes: [
                                    "id_identification_document",
                                    "id_ubigeo_birth",
                                    "id_ubigeo_resident",
                                    "id_nationality",
                                    "document_number",
                                    "name",
                                    "paternal",
                                    "maternal",
                                    "gender",
                                    "birth_date",
                                    "just_last_name",
                                ],
                                model: Person,
                                as: "Person",
                            },
                            {
                                required: true,
                                attributes: ["id", "denomination"],
                                model: Concept,
                                as: "Concept",
                            },
                        ],
                    },
                    { transaction: t }
                );
                let estado,
                    planadmision,
                    fechainicio,
                    process,
                    year,
                    programa,
                    unidadorganica,
                    sede,
                    documento,
                    nombre,
                    apellidopaterno,
                    apellidomaterno,
                    modalidad;
                for (let i = 0; i < students.length; i++) {
                    estado = students[i].state;
                    planadmision = students[i].Admission_plan
                        ? students[i].Admission_plan.denomination
                        : null;
                    fechainicio = students[i].Admission_plan
                        ? students[i].Admission_plan.date_start
                        : null;
                    // proceso = students[i].Admission_plan ? students[i].Admission_plan.date_start : null;
                    programa =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Program
                            ? students[i].Admission_plan.Program.denomination
                            : null;
                    unidadorganica =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Program &&
                        students[i].Admission_plan.Program.Organic_unit_register
                            ? students[i].Admission_plan.Program
                                  .Organic_unit_register.denomination
                            : null;
                    sede =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Program &&
                        students[i].Admission_plan.Program
                            .Organic_unit_register &&
                        students[i].Admission_plan.Program.Organic_unit_register
                            .Campu
                            ? students[i].Admission_plan.Program
                                  .Organic_unit_register.Campu.denomination
                            : null;
                    documento = students[i].Person
                        ? students[i].Person.document_number
                        : null;
                    nombre = students[i].Person
                        ? students[i].Person.name
                        : null;
                    apellidopaterno = students[i].Person
                        ? students[i].Person.paternal
                        : null;
                    apellidomaterno = students[i].Person
                        ? students[i].Person.maternal
                        : null;
                    modalidad = students[i].Concept
                        ? students[i].Concept.denomination
                        : null;
                    process =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Process
                            ? students[i].Admission_plan.Process.denomination
                            : null;
                    year =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Process &&
                        students[i].Admission_plan.Process.Academic_calendar
                            ? students[i].Admission_plan.Process
                                  .Academic_calendar.denomination
                            : null;

                    data.push({
                        SEDE: sede,
                        "UNIDAD ORGANICA": unidadorganica,
                        PROCESO: year.substr(-4) + "-" + process.substr(-1), //aqui falta
                        ESTADO: estado,
                        "PLAN DE ADMISION": planadmision,
                        "FECHA INICIO": fechainicio,
                        PROGRAMA: programa,
                        DOCUMENTO: documento,
                        NOMBRE: students[i].state,
                        "APELLIDO PATERNO": apellidopaterno,
                        "APELLIDO MATERNO": apellidomaterno,
                        MODALIDAD: modalidad,
                    });
                }
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
    reportExecelEntryOrganicUnit: async (req, res) => {
        try {
            let students = [];
            let data = [];
            await ST.transaction(async (t) => {
                students = await Student.findAll(
                    {
                        attributes: ["id", "type_entry", "study_modality"],
                        include: [
                            {
                                required: true,
                                where: { id_process: req.params.id_process },
                                attributes: [
                                    "description",
                                    "type_process",
                                    "date_start",
                                ],
                                model: Admission_plan,
                                as: "Admission_plan",
                                include: [
                                    {
                                        attributes: ["denomination"],
                                        model: Academic_semester,
                                        as: "Process",
                                        include: {
                                            attributes: ["denomination"],
                                            model: Academic_calendar,
                                            as: "Academic_calendar",
                                        },
                                    },
                                    {
                                        required: true,
                                        attributes: ["code", "denomination"],
                                        model: Program,
                                        as: "Program",
                                        include: [
                                            {
                                                attributes: ["denomination"],
                                                model: Academic_degree,
                                                as: "Academic_degree",
                                            },
                                            {
                                                attributes: [
                                                    "denomination",
                                                    "code_local",
                                                    "code_faculty_unit",
                                                ],
                                                where: {
                                                    id: req.params
                                                        .id_organic_unit,
                                                },
                                                model: Organic_unit,
                                                as: "Organic_unit_register",
                                                include: {
                                                    attributes: [
                                                        "code",
                                                        "denomination",
                                                    ],
                                                    model: Campus,
                                                    as: "Campu",
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                required: true,
                                attributes: [
                                    "id_identification_document",
                                    "id_ubigeo_birth",
                                    "id_ubigeo_resident",
                                    "id_nationality",
                                    "document_number",
                                    "name",
                                    "paternal",
                                    "maternal",
                                    "gender",
                                    "birth_date",
                                    "just_last_name",
                                ],
                                model: Person,
                                as: "Person",
                            },
                            {
                                attributes: ["id", "denomination"],
                                model: Concept,
                                as: "Concept",
                            },
                        ],
                    },
                    { transaction: t }
                );
                let estado,
                    planadmision,
                    fechainicio,
                    process,
                    year,
                    programa,
                    unidadorganica,
                    sede,
                    documento,
                    nombre,
                    apellidopaterno,
                    apellidomaterno,
                    modalidad;
                for (let i = 0; i < students.length; i++) {
                    estado = students[i].state;
                    planadmision = students[i].Admission_plan
                        ? students[i].Admission_plan.denomination
                        : null;
                    fechainicio = students[i].Admission_plan
                        ? students[i].Admission_plan.date_start
                        : null;
                    // proceso = students[i].Admission_plan ? students[i].Admission_plan.date_start : null;
                    programa =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Program
                            ? students[i].Admission_plan.Program.denomination
                            : null;
                    unidadorganica =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Program &&
                        students[i].Admission_plan.Program.Organic_unit_register
                            ? students[i].Admission_plan.Program
                                  .Organic_unit_register.denomination
                            : null;
                    sede =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Program &&
                        students[i].Admission_plan.Program
                            .Organic_unit_register &&
                        students[i].Admission_plan.Program.Organic_unit_register
                            .Campu
                            ? students[i].Admission_plan.Program
                                  .Organic_unit_register.Campu.denomination
                            : null;
                    documento = students[i].Person
                        ? students[i].Person.document_number
                        : null;
                    nombre = students[i].Person
                        ? students[i].Person.name
                        : null;
                    apellidopaterno = students[i].Person
                        ? students[i].Person.paternal
                        : null;
                    apellidomaterno = students[i].Person
                        ? students[i].Person.maternal
                        : null;
                    modalidad = students[i].Concept
                        ? students[i].Concept.denomination
                        : null;
                    process =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Process
                            ? students[i].Admission_plan.Process.denomination
                            : null;
                    year =
                        students[i].Admission_plan &&
                        students[i].Admission_plan.Process &&
                        students[i].Admission_plan.Process.Academic_calendar
                            ? students[i].Admission_plan.Process
                                  .Academic_calendar.denomination
                            : null;

                    data.push({
                        SEDE: sede,
                        "UNIDAD ORGANICA": unidadorganica,
                        PROCESO: year.substr(-4) + "-" + process.substr(-1), //aqui falta
                        ESTADO: estado,
                        "PLAN DE ADMISION": planadmision,
                        "FECHA INICIO": fechainicio,
                        PROGRAMA: programa,
                        DOCUMENTO: documento,
                        NOMBRE: nombre,
                        "APELLIDO PATERNO": apellidopaterno,
                        "APELLIDO MATERNO": apellidomaterno,
                        MODALIDAD: modalidad,
                    });
                }
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
    reportExecelRegistrionOrganicUnit: async (req, res) => {
        let data = [];
        try {
            const students = await Registration.findAll({
                attributes: ["id", "id_student"],
                where: {
                    id_semester: req.params.id_process,
                    type: "Regular",
                    id_organic_unit: req.params.id_organic_unit,
                },
                include: {
                    required: true,
                    attributes: ["study_modality"],
                    model: Student,
                    as: "Student",
                    include: [
                        {
                            attributes: [
                                "denomination",
                                "code_local",
                                "code_faculty_unit",
                            ],
                            // where: {id: req.params.id_organic_unit},
                            model: Organic_unit,
                            as: "Organic_unit_register",
                            include: {
                                attributes: ["code", "denomination"],
                                model: Campus,
                                as: "Campu",
                            },
                        },
                        {
                            required: true,
                            attributes: ["code", "denomination"],
                            model: Program,
                            as: "Program",
                            include: {
                                attributes: ["denomination"],
                                model: Academic_degree,
                                as: "Academic_degree",
                            },
                        },
                        {
                            required: true,
                            attributes: [
                                "id_identification_document",
                                "document_number",
                                "name",
                                "paternal",
                                "maternal",
                                "gender",
                                "birth_date",
                            ],
                            model: Person,
                            as: "Person",
                        },
                        {
                            required: true,
                            attributes: ["description"],
                            model: Admission_plan,
                            as: "Admission_plan",
                        },
                    ],
                },
            });
            let programa,
                unidadorganica,
                sede,
                documento,
                nombre,
                apellidopaterno,
                admission,
                apellidomaterno;
            for (let i = 0; i < students.length; i++) {
                programa =
                    students[i].Student && students[i].Student.Program
                        ? students[i].Student.Program.denomination
                        : null;
                unidadorganica =
                    students[i].Student &&
                    students[i].Student.Organic_unit_register
                        ? students[i].Student.Organic_unit_register.denomination
                        : null;
                sede =
                    students[i].Student &&
                    students[i].Student.Organic_unit_register &&
                    students[i].Student.Organic_unit_register.Campu
                        ? students[i].Student.Organic_unit_register.Campu
                              .denomination
                        : null;
                documento =
                    students[i].Student && students[i].Student.Person
                        ? students[i].Student.Person.document_number
                        : null;
                nombre =
                    students[i].Student && students[i].Student.Person
                        ? students[i].Student.Person.name
                        : null;
                apellidopaterno =
                    students[i].Student && students[i].Student.Person
                        ? students[i].Student.Person.paternal
                        : null;
                apellidomaterno =
                    students[i].Student && students[i].Student.Person
                        ? students[i].Student.Person.maternal
                        : null;
                admission =
                    students[i].Student && students[i].Student.Admission_plan
                        ? students[i].Student.Admission_plan.description
                        : null;

                data.push({
                    ID: students[i].id,
                    SEDE: sede,
                    "UNIDAD ORGANICA": unidadorganica,
                    PROGRAMA: programa,
                    DOCUMENTO: documento,
                    NOMBRE: nombre,
                    "APELLIDO PATERNO": apellidopaterno,
                    "APELLIDO MATERNO": apellidomaterno,
                    ADMISIÓN: admission,
                });
            }

            res.status(200).send(data);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    reportSuneduRegistration: async (req, res) => {
        let data = [];
        try {
            const _data = await Registration.findAll({
                where: { id_semester: req.params.id_process, type: "Regular" },
                include: [
                    {
                        required: true,
                        attributes: ["denomination"],
                        model: Academic_semester,
                        as: "Academic_semester",
                        include: {
                            attributes: ["denomination"],
                            model: Academic_calendar,
                            as: "Academic_calendar",
                        },
                    },
                    {
                        required: true,
                        attributes: ["code", "denomination", "description"],
                        model: Program,
                        as: "Program",
                        include: {
                            required: true,
                            attributes: ["denomination"],
                            where: { denomination: req.params.academic_degree },
                            model: Academic_degree,
                            as: "Academic_degree",
                        },
                    },
                    {
                        required: true,
                        attributes: [
                            "denomination",
                            "code_local",
                            "code_faculty_unit",
                        ],
                        model: Organic_unit,
                        as: "Organic_unit_register",
                        include: {
                            attributes: ["code", "denomination"],
                            model: Campus,
                            as: "Campu",
                        },
                    },
                    {
                        required: true,
                        attributes: ["study_modality"],
                        model: Student,
                        as: "Student",
                        include: [
                            {
                                required: true,
                                attributes: [
                                    "description",
                                    "type_process",
                                    "date_start",
                                ],
                                model: Admission_plan,
                                as: "Admission_plan",
                            },
                            {
                                required: true,
                                attributes: [
                                    "id_identification_document",
                                    "document_number",
                                    "name",
                                    "paternal",
                                    "maternal",
                                    "gender",
                                    "birth_date",
                                    "just_last_name",
                                ],
                                model: Person,
                                as: "Person",
                            },
                        ],
                    },
                ],
            });

            let codeLocal,
                peridoLectivo,
                tipoPeriodo,
                periodoAcademico,
                codeFacultadUnidad,
                codePrograma,
                codeProgramaAnterior,
                fechaCambioAnteior,
                cambioPrograma,
                tipoDocumento,
                nroDocumento,
                cicloAcademico,
                modalidaEstudio,
                fechaMatricula;
            for (let i = 0; i < _data.length; i++) {
                codeLocal = _data[i].Organic_unit_register
                    ? _data[i].Organic_unit_register.code_local
                    : null;

                peridoLectivo = 1; // 1 semestral
                tipoPeriodo = 1; //1 regular
                periodoAcademico =
                    _data[
                        i
                    ].Academic_semester.Academic_calendar.denomination.substr(
                        -4
                    ) +
                    "-" +
                    _data[i].Academic_semester.denomination.substr(-2);
                codeFacultadUnidad = _data[i].Organic_unit_register
                    ? _data[i].Organic_unit_register.code_faculty_unit
                    : null;
                codePrograma = _data[i].Program ? _data[i].Program.code : null;
                cambioPrograma = 0;
                codeProgramaAnterior = null;
                fechaCambioAnteior = null;
                tipoDocumento =
                    _data[i].Student && _data[i].Student.Person
                        ? _data[i].Student.Person.id_identification_document
                        : null;
                nroDocumento =
                    _data[i].Student && _data[i].Student.Person
                        ? _data[i].Student.Person.document_number
                        : null;
                cicloAcademico = _data[i].number_registration;
                modalidaEstudio = _data[i].Student
                    ? _data[i].Student.study_modality
                    : null;
                tempFechaRegistration =
                    _data[i].Academic_semester.denomination.substr(-2) === "II"
                        ? "15/08/"
                        : "15/04/";
                fechaMatricula =
                    tempFechaRegistration +
                    _data[
                        i
                    ].Academic_semester.Academic_calendar.denomination.substr(
                        -4
                    );
                admissionPlan =
                    _data[i].Student &&
                    _data[i].Student.Admission_plan &&
                    _data[i].Student.Admission_plan.description
                        ? _data[i].Student.Admission_plan.description.substr(8)
                        : "No def";
                data.push({
                    CODIGO_LOCAL: codeLocal,
                    PERIODO_LECTIVO: peridoLectivo,
                    TIPO_PERIODO: tipoPeriodo,
                    PERIDODO_ACADEMICO: periodoAcademico,
                    CODIGO_FACULTAD_UNIDAD: codeFacultadUnidad,
                    CODIGO_PROGRAMA: codePrograma,
                    CAMBIO_PROGRAMA: cambioPrograma,
                    CODIGO_PROGRAMA_ANTERIOR: codeProgramaAnterior,
                    FECHA_CAMBIO_PROGRAMA: fechaCambioAnteior,
                    TIPO_DOCUMENTO: tipoDocumento,
                    NRO_DOCUMENTO: nroDocumento,
                    CODIGO_ESTUDIANTE: nroDocumento,
                    CICLO_ACADEMICO: cicloAcademico,
                    MODALIDAD_ESTUDIO:
                        modalidaEstudio === "Presencial"
                            ? 1
                            : modalidaEstudio === "Semi-Presencial"
                            ? 2
                            : 3,
                    FECHA_MATRICULA: fechaMatricula,
                    CODIGO_ESCALA_PAGO: "",
                    PORCENTAJE_DESCUENTO: "",
                    TIENE_BECA: null,
                    TIPO_BECA: null,
                    OTRA_BECA: null,
                    PORCENTAJE_CUBIERTO: null,
                    ID: _data[i].id,
                    UNIDAD_ORGANICA_POS: _data[i].id_organic_unit,
                    PROGRAMA: _data[i].Program.description,
                    ADMISSION_PROCESS: admissionPlan,
                });
            }

            res.status(200).send(data);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    reportExcelRegistration: async (req, res) => {
        let data = [];
        try {
            const students = await Registration.findAll({
                attributes: ["id", "id_student"],
                where: {
                    type: "Regular",
                    id_semester: req.params.id_process,
                },
                include: {
                    required: true,
                    attributes: ["study_modality"],
                    model: Student,
                    as: "Student",
                    include: [
                        {
                            attributes: [
                                "denomination",
                                "code_local",
                                "code_faculty_unit",
                            ],
                            model: Organic_unit,
                            as: "Organic_unit_register",
                            include: {
                                attributes: ["code", "denomination"],
                                model: Campus,
                                as: "Campu",
                            },
                        },
                        {
                            required: true,
                            attributes: ["code", "denomination"],
                            model: Program,
                            as: "Program",
                            include: {
                                attributes: ["denomination"],
                                where: {
                                    denomination: req.params.academic_degree,
                                },
                                model: Academic_degree,
                                as: "Academic_degree",
                            },
                        },
                        {
                            required: true,
                            attributes: [
                                "id_identification_document",
                                "document_number",
                                "name",
                                "paternal",
                                "maternal",
                                "gender",
                                "birth_date",
                            ],
                            model: Person,
                            as: "Person",
                        },
                    ],
                },
            });
            let programa,
                unidadorganica,
                sede,
                documento,
                nombre,
                apellidopaterno,
                apellidomaterno;
            for (let i = 0; i < students.length; i++) {
                programa =
                    students[i].Student && students[i].Student.Program
                        ? students[i].Student.Program.denomination
                        : null;
                unidadorganica =
                    students[i].Student &&
                    students[i].Student.Organic_unit_register
                        ? students[i].Student.Organic_unit_register.denomination
                        : null;
                sede =
                    students[i].Student &&
                    students[i].Student.Organic_unit_register &&
                    students[i].Student.Organic_unit_register.Campu
                        ? students[i].Student.Organic_unit_register.Campu
                              .denomination
                        : null;
                documento =
                    students[i].Student && students[i].Student.Person
                        ? students[i].Student.Person.document_number
                        : null;
                nombre =
                    students[i].Student && students[i].Student.Person
                        ? students[i].Student.Person.name
                        : null;
                apellidopaterno =
                    students[i].Student && students[i].Student.Person
                        ? students[i].Student.Person.paternal
                        : null;
                apellidomaterno =
                    students[i].Student && students[i].Student.Person
                        ? students[i].Student.Person.maternal
                        : null;

                data.push({
                    ID: students[i].id,
                    SEDE: sede,
                    "UNIDAD ORGANICA": unidadorganica,
                    PROGRAMA: programa,
                    DOCUMENTO: documento,
                    NOMBRE: nombre,
                    "APELLIDO PATERNO": apellidopaterno,
                    "APELLIDO MATERNO": apellidomaterno,
                });
            }

            res.status(200).send(data);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    reportExecelMovementStudentByRangeDate: async (req, res) => {
        let organicUnitDenomination = "";
        let principalOrganit = "";
        let startDate = req.body.start_movement;
        let endDate = req.body.end_movement;
        let dataExcel = [];
        let dataPdf = [];
        let totalAmount = 0;
        try {
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: ["description", "abbreviation"],
                where: { state: true },
            });

            const organictUnit = await Organic_unit.findOne({
                where: { id: req.body.id_organict_unit },
                include: {
                    model: Campus,
                    as: "Campu",
                },
            });
            organicUnitDenomination =
                organictUnit.denomination +
                "-" +
                organictUnit.Campu.denomination;
            principalOrganit = principalOrganicUnit.description;
            const movements = await Movement.findAll({
                attributes: [
                    "state",
                    "type",
                    "voucher_amount",
                    "voucher_code",
                    "voucher_date",
                    "voucher_url",
                    "denomination",
                    "observation",
                ],
                where: {
                    voucher_date: {
                        [Op.between]: [startDate, endDate],
                    },
                    id_organic_unit: req.body.id_organict_unit,
                },
                include: [
                    {
                        attributes: ["id"],
                        model: Student,
                        as: "Student",
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
                        ],
                    },
                ],
                order: [["voucher_date", "asc"]],
            });
            let voucherCode,
                voucherDate,
                dni,
                person,
                voucherAmount,
                admisionPlan,
                voucherUrl,
                denomination,
                observation;
            for (let i = 0; i < movements.length; i++) {
                (voucherDate = movements[i].voucher_date),
                    (voucherCode = movements[i].voucher_code),
                    (voucherAmount = parseFloat(movements[i].voucher_amount)),
                    (voucherUrl = movements[i].voucher_url),
                    (denomination = movements[i].denomination),
                    (observation = movements[i].observation),
                    (dni = movements[i].Student.Person.document_number),
                    (person = movements[i].Student.Person.name),
                    (admisionPlan =
                        movements[i].Student.Admission_plan.description),
                    (totalAmount = totalAmount + voucherAmount),
                    dataPdf.push({
                        ID: i + 1,
                        VOUCHER_CODIGO: voucherCode,
                        VOUCHER_FECHA: voucherDate,
                        VOUCHER_STATE: movements[i].state,
                        VOUCHER_TYPE: movements[i].type,
                        DNI: dni,
                        NOMBRE: person,
                        MONTO: voucherAmount,
                        ADMISION: admisionPlan.substr(8),
                        VOUCHER_URL: voucherUrl,
                        DENOMINACION: denomination,
                        OBSERVACION: observation,
                    });
                dataExcel.push({
                    ID: i + 1,
                    "VOUCHER CODIGO": voucherCode,
                    "VOUCHER FECHA": voucherDate,
                    DNI: dni,
                    "APELLIDOS Y NOMBRES": person,
                    MONTO: voucherAmount,
                    ADMISIÓN: admisionPlan.substr(8),
                });
            }

            res.status(200).send({
                dataExcel,
                dataPdf,
                organicUnitDenomination,
                principalOrganit,
                startDate,
                endDate,
                totalAmount,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },

    reportDataMovementStudentByRangeDateRegistrationVoucher: async (
        req,
        res
    ) => {
        let dataExcel = [];
        let dataPdf = [];
        let totalAmount = 0;
        let organicUnitDenomination = "";
        let principalOrganit = "";
        let startDate = req.body.start_movement;
        let endDate = req.body.end_movement;
        try {
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: ["description", "abbreviation"],
                where: { state: true },
            });

            const organictUnit = await Organic_unit.findOne({
                where: { id: req.body.id_organict_unit },
                include: {
                    model: Campus,
                    as: "Campu",
                },
            });
            organicUnitDenomination =
                organictUnit.denomination +
                "-" +
                organictUnit.Campu.denomination;
            principalOrganit = principalOrganicUnit.description;
            const movements = await Movement.findAll({
                attributes: [
                    "state",
                    "type",
                    "voucher_amount",
                    "voucher_code",
                    ["created_at", "voucher_date"],
                    "voucher_url",
                    "denomination",
                    "observation",
                ],
                where: {
                    state: "Aceptado",
                    created_at: {
                        [Op.between]: [
                            req.body.start_movement,
                            req.body.end_movement,
                        ],
                    },
                    id_organic_unit: req.body.id_organict_unit,
                },
                include: [
                    {
                        required: true,
                        attributes: ["id"],
                        model: Student,
                        as: "Student",
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
                        ],
                    },
                ],
                order: [["voucher_date", "asc"]],
            });
            let voucherCode,
                voucherDate,
                dni,
                person,
                voucherAmount,
                admisionPlan,
                voucherUrl,
                denomination,
                observation;
            for (let i = 0; i < movements.length; i++) {
                (voucherDate = movements[i].voucher_date),
                    (voucherCode = movements[i].voucher_code),
                    (voucherAmount = parseFloat(movements[i].voucher_amount)),
                    (voucherUrl = movements[i].voucher_url),
                    (denomination = movements[i].denomination),
                    (observation = movements[i].observation),
                    (dni = movements[i].Student.Person.document_number),
                    (person = movements[i].Student.Person.name),
                    (admisionPlan =
                        movements[i].Student.Admission_plan.description),
                    (totalAmount = totalAmount + voucherAmount),
                    dataPdf.push({
                        ID: i + 1,
                        VOUCHER_CODIGO: voucherCode,
                        VOUCHER_FECHA: voucherDate,
                        VOUCHER_STATE: movements[i].state,
                        VOUCHER_TYPE: movements[i].type,
                        DNI: dni,
                        NOMBRE: person,
                        MONTO: voucherAmount,
                        ADMISION: admisionPlan.slice(17, 25),
                        VOUCHER_URL: voucherUrl,
                        DENOMINACION: denomination,
                        OBSERVACION: observation,
                    });
                dataExcel.push({
                    ID: i + 1,
                    "VOUCHER CODIGO": voucherCode,
                    "VOUCHER FECHA": moment(voucherDate).format("DD-MM-YYYY"),
                    DNI: dni,
                    "APELLIDOS Y NOMBRES": person,
                    MONTO: voucherAmount,
                    OBSERVACIÓN: observation,
                    ADMISIÓN: admisionPlan.slice(17, 25),
                });
            }

            res.status(200).send({
                dataExcel,
                dataPdf,
                organicUnitDenomination,
                principalOrganit,
                startDate,
                endDate,
                totalAmount,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    //DATOS DOCUMENT BOOK////////////////////////////////////////////////////
    reportCertyStudy2: async (req, res) => {
        let dataExcel = [];
        let dataRegistration = [];
        let totalCredit = 0;
        let date = "";
        let observation = "";
        let leterNote = "";
        let correlative = "";
        let averageScore = 0;
        let totalCourse = 0;
        try {
            const documentBook = await Document_book.findByPk(
                req.params.id_document_book
            );
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: [
                    "description",
                    "description_document",
                    "abbreviation",
                ],
                where: { state: true },
            });
            const authorityTypeA = await Authority.findOne({
                attributes: ["person", "charge"],
                where: { state: true, type: "A" },
            });
            const authorityTypeG = await Authority.findOne({
                attributes: ["person", "charge"],
                where: { state: true, type: "G" },
            });
            const studentData = await Student.findOne({
                attributes: ["id", "id_plan", "id_program", "type"],
                where: {
                    id: req.params.id_student,
                },
                include: [
                    {
                        attributes: [
                            "document_number",
                            "photo",
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
                        attributes: ["description"],
                        model: Admission_plan,
                        as: "Admission_plan",
                    },
                    {
                        attributes: ["denomination"],
                        model: Program,
                        as: "Program",
                    },
                ],
            });
            const _dataRegistration = await Ciclo.findAll({
                attributes: ["ciclo"],
                where: { id_plan: studentData.id_plan },
                include: {
                    required: true,
                    attributes: ["id", "denomination", "credits", "order"],
                    model: Course,
                    as: "Course",
                    include: {
                        model: Registration_course,
                        as: "R_c",
                        required: true,
                        where: { state: "Aprobado" },
                        attributes: ["id", "note", "state"],
                        include: {
                            required: true,
                            attributes: ["type"],
                            where: { id_student: req.params.id_student },
                            model: Registration,
                            as: "Registration",
                            include: [
                                {
                                    required: true,
                                    attributes: ["denomination"],
                                    model: Academic_semester,
                                    as: "A_s",
                                    include: {
                                        required: true,
                                        attributes: ["denomination"],
                                        model: Academic_calendar,
                                        as: "A_c",
                                    },
                                },
                            ],
                        },
                    },
                },
                order: [
                    ["ciclo", "asc"],
                    [{ model: Course, as: "Course" }, "order", "asc"],
                ],
            });
            let course,
                cicle,
                _cicle,
                process,
                _process,
                order,
                year,
                credit,
                note = "";
            if (_dataRegistration.length > 0) {
                for (let i = 0; i < _dataRegistration.length; i++) {
                    cicle = _dataRegistration[i].ciclo + " CICLO";
                    dataRegistration.push([cicle, "", "", ""]);

                    for (
                        let j = 0;
                        j < _dataRegistration[i].Course.length;
                        j++
                    ) {
                        course = _dataRegistration[i].Course[j].denomination;
                        order = _dataRegistration[i].Course[j].order;
                        credit = _dataRegistration[i].Course[j].credits;
                        note = _dataRegistration[i].Course[j].R_c.note;
                        leterNote = await abox.numberToLetter(
                            _dataRegistration[i].Course[j].R_c.note
                        );
                        year =
                            _dataRegistration[i].Course[j] &&
                            _dataRegistration[i].Course[j].R_c.Registration.A_s
                                .A_c.denomination;

                        process =
                            _dataRegistration[i].Course[j].R_c.Registration.A_s
                                .denomination;
                        _process = process.substr(8) == "I" ? "I" : "II";
                        totalCredit = totalCredit + credit;
                        totalCourse = totalCourse + 1;
                        averageScore = averageScore + parseFloat(note);
                        dataRegistration.push([
                            course,
                            credit,
                            note + " " + leterNote,
                            year.substr(-4) + "-" + _process,
                        ]);
                    }
                }
            } else {
                dataRegistration = ["", "", "", ""];
            }

            let temp = Math.round((averageScore / totalCourse) * 100) / 100;
            averageScore = temp ? temp : 0;
            correlative =
                documentBook.correlative +
                "-" +
                moment(documentBook.created_at).year();
            observation = documentBook.observation
                ? documentBook.observation
                : "";
            date = moment(documentBook.created_at).format("LL");

            res.status(200).send({
                principalOrganicUnit,
                authorityTypeA,
                authorityTypeG,
                studentData,
                dataRegistration,
                totalCourse,
                totalCredit,
                averageScore,
                correlative,
                observation,
                date,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    reportConstancyStudy: async (req, res) => {
        let date = "";
        let correlative = "";
        let ciclo = "";
        try {
            const documentBook = await Document_book.findByPk(
                req.params.id_document_book
            );
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: ["description", "abbreviation"],
                where: { state: true },
            });

            const authorityTypeG = await Authority.findOne({
                attributes: ["person", "charge"],
                where: { state: true, type: "G" },
            });
            const studentData = await Student.findOne({
                attributes: ["id", "id_plan", "id_program", "type"],
                where: {
                    id: req.params.id_student,
                },
                include: [
                    {
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

            const _dataRegistration = await Ciclo.findAll({
                attributes: ["ciclo"],
                where: { id_plan: studentData.id_plan },
                include: {
                    required: true,
                    attributes: ["id", "denomination", "credits", "order"],
                    model: Course,
                    as: "Course",
                    include: {
                        model: Registration_course,
                        as: "R_c",
                        required: true,
                        attributes: ["id", "note", "state"],
                        include: {
                            required: true,
                            attributes: ["type"],
                            where: { id_student: req.params.id_student },
                            model: Registration,
                            as: "Registration",
                        },
                    },
                },
                order: [
                    ["ciclo", "desc"],
                    [{ model: Course, as: "Course" }, "order", "asc"],
                ],
            });

            ciclo =
                _dataRegistration.length > 0 ? _dataRegistration[0].ciclo : "?";
            correlative =
                documentBook.correlative +
                "-" +
                moment(documentBook.created_at).year();
            date = moment(documentBook.created_at).format("LL");
            res.status(200).send({
                principalOrganicUnit,
                authorityTypeG,
                ciclo,
                studentData,
                correlative,
                date,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    reportConstancyEntry: async (req, res) => {
        let date = "";
        let correlative = "";
        try {
            const documentBook = await Document_book.findByPk(
                req.params.id_document_book
            );
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: ["description", "abbreviation"],
                where: { state: true },
            });

            const authorityTypeG = await Authority.findOne({
                attributes: ["person", "charge"],
                where: { state: true, type: "G" },
            });
            const studentData = await Student.findOne({
                attributes: ["id", "id_plan", "id_program", "type"],
                where: {
                    id: req.params.id_student,
                },
                include: [
                    {
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
                    {
                        attributes: ["description", "duration", "date_class"],
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

            correlative =
                documentBook.correlative +
                "-" +
                moment(documentBook.created_at).year();
            // correlative = "NNNN";
            date = moment(documentBook.created_at).format("LL");
            res.status(200).send({
                principalOrganicUnit,
                authorityTypeG,
                studentData,
                correlative,
                date,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    reportConstancyExpedito: async (req, res) => {
        let date = "";
        let correlative = "";
        let firtsRegister = "NO DEFINIDO";
        let lastRegister = "NO DEFINIDO";
        try {
            const documentBook = await Document_book.findByPk(
                req.params.id_document_book
            );
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: ["description", "abbreviation"],
                where: { state: true },
            });

            const authorityTypeG = await Authority.findOne({
                attributes: ["person", "charge"],
                where: { state: true, type: "G" },
            });
            const studentData = await Student.findOne({
                attributes: ["id", "id_plan", "id_program", "type"],
                where: {
                    id: req.params.id_student,
                },
                include: [
                    {
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
                    {
                        attributes: ["description", "duration", "date_class"],
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
            let studentRegister = [];
            studentRegister = await Registration.findAll({
                // attributes: ['id', 'id_plan', 'id_program', 'type'],
                where: {
                    id_student: req.params.id_student,
                },
                include: {
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
            });
            firtsRegister =
                studentRegister[0] &&
                studentRegister[0].Academic_semester.Academic_calendar.denomination.substr(
                    -4
                ) +
                    "-" +
                    studentRegister[0].Academic_semester.denomination.substr(
                        -2
                    );
            lastRegister =
                studentRegister[studentRegister.length - 1] &&
                studentRegister[
                    studentRegister.length - 1
                ].Academic_semester.Academic_calendar.denomination.substr(-4) +
                    "-" +
                    studentRegister[
                        studentRegister.length - 1
                    ].Academic_semester.denomination.substr(-2);
            correlative =
                documentBook.correlative +
                "-" +
                moment(documentBook.created_at).year();
            date = moment(documentBook.created_at).format("LL");
            res.status(200).send({
                principalOrganicUnit,
                authorityTypeG,
                studentData,
                correlative,
                firtsRegister,
                lastRegister,
                date,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    reportConstancyEgress: async (req, res) => {
        let date = "";
        let correlative = "";
        let firtsRegister = "NO DEFINIDO";
        let lastRegister = "NO DEFINIDO";
        try {
            const documentBook = await Document_book.findByPk(
                req.params.id_document_book
            );
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: ["description", "abbreviation"],
                where: { state: true },
            });

            const authorityTypeG = await Authority.findOne({
                attributes: ["person", "charge"],
                where: { state: true, type: "G" },
            });
            //get first and ultimate registration for student
            let studentRegister = [];
            studentRegister = await Registration.findAll({
                // attributes: ['id', 'id_plan', 'id_program', 'type'],
                where: {
                    id_student: req.params.id_student,
                },
                include: {
                    required: true,
                    //attributes: ['id', 'denomination'],
                    model: Registration_course,
                    as: "Registration_course",
                    include: {
                        //attributes: ['id', 'denomination'],
                        model: Schedule,
                        as: "Schedule",
                    },
                },
                order: [
                    ["created_at", "asc"],
                    [
                        {
                            model: Registration_course,
                            as: "Registration_course",
                        },
                        "created_at",
                        "asc",
                    ],
                ],
            });

            const studentData = await Student.findOne({
                attributes: ["id", "id_plan", "id_program", "type"],
                where: {
                    id: req.params.id_student,
                },
                include: [
                    {
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
                    {
                        attributes: ["description", "duration", "date_class"],
                        model: Admission_plan,
                        as: "Admission_plan",
                        include: [
                            {
                                attributes: ["credit_required"],
                                model: Plan,
                                as: "Plan",
                            },
                        ],
                    },
                    {
                        attributes: ["denomination"],
                        model: Program,
                        as: "Program",
                    },
                ],
            });
            correlative =
                documentBook.correlative +
                "-" +
                moment(documentBook.created_at).year();
            date = moment(documentBook.created_at).format("LL");
            let tempDates = [];
            let tempDatesEnd = [];
            for (let i = 0; i < studentRegister.length; i++) {
                for (
                    let j = 0;
                    j < studentRegister[i].Registration_course.length;
                    j++
                ) {
                    tempDates.push(
                        moment(
                            studentRegister[i].Registration_course[j].Schedule
                                .start_date
                        )
                    );
                    tempDatesEnd.push(
                        moment(
                            studentRegister[i].Registration_course[j].Schedule
                                .end_date
                        )
                    );
                }
            }
            lastRegister = moment.max(tempDatesEnd).format("DD-MM-YYYY");
            firtsRegister = moment.min(tempDates).format("DD-MM-YYYY");

            res.status(200).send({
                principalOrganicUnit,
                authorityTypeG,
                studentData,
                correlative,
                date,
                firtsRegister,
                lastRegister,
                studentRegister,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    reportConstancyAdeudar: async (req, res) => {
        let date = "";
        let correlative = "";
        let firtsRegister = "NO DEFINIDO";
        let lastRegister = "NO DEFINIDO";
        try {
            const documentBook = await Document_book.findByPk(
                req.params.id_document_book
            );
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: ["description", "abbreviation"],
                where: { state: true },
            });

            const authorityTypeG = await Authority.findOne({
                attributes: ["person", "charge"],
                where: { state: true, type: "G" },
            });
            //get first and ultimate registration for student
            let studentRegister = [];
            studentRegister = await Registration.findAll({
                // attributes: ['id', 'id_plan', 'id_program', 'type'],
                where: {
                    id_student: req.params.id_student,
                },
                include: {
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
            });
            const studentData = await Student.findOne({
                attributes: ["id", "id_plan", "id_program", "type"],
                where: {
                    id: req.params.id_student,
                },
                include: [
                    {
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
                    {
                        attributes: ["description", "duration", "date_class"],
                        model: Admission_plan,
                        as: "Admission_plan",
                        include: [
                            {
                                attributes: ["credit_required"],
                                model: Plan,
                                as: "Plan",
                            },
                        ],
                    },
                    {
                        attributes: ["denomination"],
                        model: Program,
                        as: "Program",
                    },
                ],
            });
            correlative =
                documentBook.correlative +
                "-" +
                moment(documentBook.created_at).year();
            date = moment(documentBook.created_at).format("LL");
            firtsRegister =
                studentRegister[0] &&
                studentRegister[0].Academic_semester.Academic_calendar.denomination.substr(
                    -4
                ) +
                    "-" +
                    studentRegister[0].Academic_semester.denomination.substr(
                        -2
                    );
            lastRegister =
                studentRegister[studentRegister.length - 1] &&
                studentRegister[
                    studentRegister.length - 1
                ].Academic_semester.Academic_calendar.denomination.substr(-4) +
                    "-" +
                    studentRegister[
                        studentRegister.length - 1
                    ].Academic_semester.denomination.substr(-2);
            res.status(200).send({
                principalOrganicUnit,
                authorityTypeG,
                studentData,
                correlative,
                date,
                firtsRegister,
                lastRegister,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    reportConstancyOrdenMerito: async (req, res) => {
        let date = "";
        let correlative = "";
        let firtsRegister = "NO DEFINIDO";
        let lastRegister = "NO DEFINIDO";
        try {
            const documentBook = await Document_book.findByPk(
                req.params.id_document_book
            );
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: ["description", "abbreviation"],
                where: { state: true },
            });

            const authorityTypeG = await Authority.findOne({
                attributes: ["person", "charge"],
                where: { state: true, type: "G" },
            });

            const studentData = await Student.findOne({
                attributes: ["id", "id_admission_plan", "type"],
                where: {
                    id: req.params.id_student,
                },
                include: [
                    {
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
                    {
                        attributes: ["description"],
                        model: Admission_plan,
                        as: "Admission_plan",
                    },
                    {
                        attributes: ["denomination"],
                        model: Program,
                        as: "Program",
                    },
                ],
            });
            // obetenemos la lsita de esutiantes de por plan de admision con cursos estado aproado
            let students = [];
            students = await Student.findAll({
                attributes: ["id"],
                where: {
                    id_admission_plan: studentData.id_admission_plan,
                },
                include: [
                    {
                        attributes: [
                            "id",
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
                    {
                        attributes: ["id", "id_semester"],
                        model: Registration,
                        as: "Registration",
                        include: {
                            attributes: [
                                "id",
                                "id_course",
                                "id_schedule",
                                "type_course",
                                "note",
                                "state",
                            ],
                            where: { state: "Aprobado" },
                            model: Registration_course,
                            as: "Registration_course",
                        },
                    },
                ],
            });
            //Sacamos el promedio ponderado de cada uno de ellos
            let tempStudent = [];

            for (let i = 0; i < students.length; i++) {
                let promedy = 0;
                let totalCourse = 0;
                for (let j = 0; j < students[i].Registration.length; j++) {
                    for (
                        let k = 0;
                        k <
                        students[i].Registration[j].Registration_course.length;
                        k++
                    ) {
                        promedy =
                            promedy +
                            students[i].Registration[j].Registration_course[k]
                                .note;
                        totalCourse = totalCourse + 1;
                    }
                }
                let finalNote = (promedy / totalCourse).toFixed(3);
                tempStudent.push({
                    id_student: students[i].id,
                    note: parseFloat(finalNote),
                });
            }
            //ordenamos las notas de mayor a menor
            tempStudent.sort((a, b) =>
                parseFloat(a.note) < parseFloat(b.note) ? 1 : -1
            );
            // tempStudent.sort((a, b) => (a.price > b.price ? 1 : -1))

            //obtenemos las denominaciones y rangos
            let total = students.length;
            let tercio = parseInt(students.length / 3);
            let quinto = parseInt(students.length / 5);
            let decimo = parseInt(students.length / 10);
            let positionStudent = 0;

            let meritoStudent = "";
            let ponderado = 0;

            for (let i = 0; i < tempStudent.length; i++) {
                if (tempStudent[i].id_student == req.params.id_student) {
                    positionStudent = i + 1;
                    ponderado = tempStudent[i].note;
                }
            }

            if (positionStudent <= tercio) {
                meritoStudent = "Tercio Superior";
            }
            if (positionStudent <= quinto) {
                meritoStudent = "Quinto Superior";
            }
            if (positionStudent <= decimo) {
                meritoStudent = "Decimo Superior";
            }
            correlative =
                documentBook.correlative +
                "-" +
                moment(documentBook.created_at).year();
            date = moment(documentBook.created_at).format("LL");
            firtsRegister = "";
            lastRegister = "";
            res.status(200).send({
                principalOrganicUnit,
                authorityTypeG,
                correlative,
                date,
                studentData,
                positionStudent,
                meritoStudent,
                ponderado,
                total,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    reportConstancyDisciplinary: async (req, res) => {
        let date = "";
        let correlative = "";
        let firtsRegister = "NO DEFINIDO";
        let lastRegister = "NO DEFINIDO";
        try {
            const documentBook = await Document_book.findByPk(
                req.params.id_document_book
            );
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: ["description", "abbreviation"],
                where: { state: true },
            });

            const authorityTypeG = await Authority.findOne({
                attributes: ["person", "charge"],
                where: { state: true, type: "G" },
            });
            //get first and ultimate registration for student
            let studentRegister = [];
            studentRegister = await Registration.findAll({
                // attributes: ['id', 'id_plan', 'id_program', 'type'],
                where: {
                    id_student: req.params.id_student,
                },
                include: {
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
            });
            const studentData = await Student.findOne({
                attributes: ["id", "id_plan", "id_program", "type"],
                where: {
                    id: req.params.id_student,
                },
                include: [
                    {
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
                    {
                        attributes: ["description", "duration", "date_class"],
                        model: Admission_plan,
                        as: "Admission_plan",
                        include: [
                            {
                                attributes: ["credit_required"],
                                model: Plan,
                                as: "Plan",
                            },
                        ],
                    },
                    {
                        attributes: ["denomination"],
                        model: Program,
                        as: "Program",
                    },
                ],
            });
            correlative =
                documentBook.correlative +
                "-" +
                moment(documentBook.created_at).year();
            date = moment(documentBook.created_at).format("LL");
            firtsRegister =
                studentRegister[0] &&
                studentRegister[0].Academic_semester.Academic_calendar.denomination.substr(
                    -4
                ) +
                    "-" +
                    studentRegister[0].Academic_semester.denomination.substr(
                        -2
                    );
            lastRegister =
                studentRegister[studentRegister.length - 1] &&
                studentRegister[
                    studentRegister.length - 1
                ].Academic_semester.Academic_calendar.denomination.substr(-4) +
                    "-" +
                    studentRegister[
                        studentRegister.length - 1
                    ].Academic_semester.denomination.substr(-2);
            res.status(200).send({
                principalOrganicUnit,
                authorityTypeG,
                studentData,
                correlative,
                date,
                firtsRegister,
                lastRegister,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    reportConstancyRegistration: async (req, res) => {
        let date = "";
        let correlative = "";

        try {
            const documentBook = await Document_book.findByPk(
                req.params.id_document_book
            );
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: ["description", "abbreviation"],
                where: { state: true },
            });

            const authorityTypeG = await Authority.findOne({
                attributes: ["person", "charge"],
                where: { state: true, type: "G" },
            });

            const studentData = await Student.findOne({
                attributes: ["id", "id_plan", "id_program", "type"],
                where: {
                    id: req.params.id_student,
                },
                include: [
                    {
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
                    {
                        attributes: ["description", "duration", "date_class"],
                        model: Admission_plan,
                        as: "Admission_plan",
                        include: [
                            {
                                attributes: ["credit_required"],
                                model: Plan,
                                as: "Plan",
                            },
                        ],
                    },
                    {
                        attributes: ["denomination"],
                        model: Program,
                        as: "Program",
                    },
                ],
            });
            correlative =
                documentBook.correlative +
                "-" +
                moment(documentBook.created_at).year();
            date = moment(documentBook.created_at).format("LL");

            res.status(200).send({
                principalOrganicUnit,
                authorityTypeG,
                studentData,
                correlative,
                date,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    reportAcademicRecord: async (req, res) => {
        let dataExcel = [];
        let registration = [];
        let totalCredit = 0;
        let date = "";
        let observation = "";
        let leterNote = "";
        let correlative = "";
        let averageScore = 0;
        let totalCourse = 0;
        try {
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: ["description", "abbreviation"],
                where: { state: true },
            });

            const studentData = await Student.findOne({
                attributes: ["id", "id_plan", "id_program", "type"],
                where: {
                    id: req.params.id_student,
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
    reportAcademicFicha: async (req, res) => {
        let registration = [];

        try {
            const studentData = await Student.findOne({
                attributes: ["id"],
                where: {
                    id: req.params.id_student,
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
            const registration = await Registration.findOne({
                attributes: ["created_at"],
                where: { id: req.params.id_registration },
                include: {
                    required: true,
                    attributes: ["id", "denomination"],
                    model: Academic_semester,
                    as: "Academic_semester",
                    include: {
                        required: true,
                        attributes: ["id", "denomination"],
                        model: Academic_calendar,
                        as: "Academic_calendar",
                    },
                },
            });
            registrationData = await Registration_course.findAll({
                where: { id_registration: req.params.id_registration },
                attributes: ["id"],
                include: {
                    attributes: ["id", "denomination", "order", "credits"],
                    model: Course,
                    as: "Course",
                },
                order: [
                    ["created_at", "asc"],
                    [{ model: Course, as: "Course" }, "order", "asc"],
                ],
            });

            res.status(200).send({
                registration: {
                    created_at: registration.created_at,
                    process:
                        registration.Academic_semester.Academic_calendar.denomination.substr(
                            -4
                        ) +
                        " " +
                        registration.Academic_semester.denomination.substr(-2),
                },
                studentData,
                registrationData,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },

    reportActa: async (req, res) => {
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
                        include: [
                            {
                                required: true,
                                attributes: ["ciclo"],
                                model: Ciclo,
                                as: "Ciclo",
                            },
                        ],
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
                where: {
                    id_schedule: acta.id_schedule,
                    state: {
                        [Op.ne]: "Retirado",
                    },
                },

                include: {
                    required: true,
                    attributes: ["id"],
                    model: Registration,
                    as: "Registration",
                    include: {
                        required: true,
                        attributes: ["id"],
                        /* where: {
                            [Op.or]: [
                                {type: {[Op.eq]: "Estudiante"}},
                                {type: {[Op.eq]: "Egresado"}},
                            ]
                        },*/
                        model: Student,
                        as: "Student",
                        include: {
                            required: true,
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
            });

            const acta_date = acta.created_at;
            let correlative = acta.correlative;
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
                    acta.Academic_semester.denomination.substr(-2),
                Course: {
                    denomination: acta.Course.denomination.toUpperCase(),
                    type: acta.Course.type.toUpperCase(),
                    credits: acta.Course.credits,
                },
                students,
                totalStudent,
                approvedStudent,
                desaprovedStudent,
                // MPT
                ciclo: acta.Course.Ciclo.ciclo,
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
    reportStudyPlan: async (req, res) => {
        let dataExcel = [];
        let registration = [];
        let totalCredit = 0;
        let date = "";
        let observation = "";
        let leterNote = "";
        let correlative = "";
        let averageScore = 0;
        let totalCourse = 0;
        try {
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: ["description", "abbreviation"],
                where: { state: true },
            });
            const data = await Plan.findOne({
                attributes: [
                    "description",
                    "credit_required",
                    "credit_elective",
                ],
                where: { id: req.params.id_plan },
                include: {
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
            });
            const courses = await Ciclo.findAll({
                attributes: ["ciclo"],
                where: { id_plan: req.params.id_plan },
                include: {
                    attributes: [
                        "id",
                        "code",
                        "order",
                        "denomination",
                        "credits",
                        "type",
                        "practical_hours",
                        "hours",
                        "area",
                        "requirements",
                    ],
                    required: true,
                    model: Course,
                    as: "Course",
                },
                order: [
                    ["ciclo", "asc"],
                    [{ model: Course, as: "Course" }, "order", "asc"],
                ],
            });

            let array = [];
            for (let i = 0; i < courses.length; i++) {
                array.push({
                    ciclo: courses[i].ciclo,
                    Course: [],
                });
                console.log(array, "aquiiii");
                for (let j = 0; j < courses[i].Course.length; j++) {
                    let _array =
                        JSON.parse(courses[i].Course[j].requirements) || [];
                    let _array_order = "";
                    for (let k = 0; k < _array.length; k++) {
                        _array_order = _array[k].order + "," + _array_order;
                    }
                    array[i].Course.push({
                        id: courses[i].Course[j].id,
                        code: courses[i].Course[j].code,
                        order: courses[i].Course[j].order,
                        denomination: courses[i].Course[j].denomination,
                        credits: courses[i].Course[j].credits,
                        type: courses[i].Course[j].type,
                        practical_hours: courses[i].Course[j].practical_hours,
                        hours: courses[i].Course[j].hours,
                        area: courses[i].Course[j].area,
                        requirement: _array_order,
                    });
                }
            }

            res.status(200).send({
                principalOrganicUnit,
                data,
                array,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    ////////////////////////////////////////////////////

    //REPORTES DE CONTABILIDAD////////////////////////////////////////////////////
    reportExcelPaymentProgramAdmisionTotal: async (req, res) => {
        try {
            let dataExcel = [];
            let payments = [];
            let info = "";
            await ST.transaction(async (t) => {
                //OBTENEMOS INFO DE PAGOS
                let data = await Admission_plan.findOne(
                    {
                        where: { id: req.params.id_admission_plan },
                        attributes: ["description", "id_process"],
                        include: {
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
                    },
                    { transaction: t }
                );

                //CONSULTAMOS LOS COSTOS DE ADMISION - PENSION
                let pensionCost = await Cost_admission_plan.findOne(
                    {
                        where: {
                            id_admission_plan: req.params.id_admission_plan,
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
                            id_admission_plan: req.params.id_admission_plan,
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
                let totalPension = pensionCost.cant / matriculaCost.cant;

                //OBTENEMOS LOS PAGOS
                let _payments = await Student.findAll(
                    {
                        where: {
                            id_admission_plan: req.params.id_admission_plan,
                        },
                        attributes: ["id"],
                        include: [
                            {
                                where: {
                                    id_semester: req.params.id_semester,
                                    id_concept: {
                                        [Op.or]: [
                                            81, 82, 83, 84, 85, 3, 4, 94, 8, 92,
                                        ],
                                    },
                                },
                                required: true,
                                // attributes: ['voucher_code', 'voucher_amount', 'voucher_date', 'voucher_url', 'observation', 'type', 'state', 'created_at', 'updated_at'],
                                model: Payment,
                                as: "Payment",
                            },
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
                        ],
                        order: [
                            [
                                { model: Payment, as: "Payment" },
                                "created_at",
                                "asc",
                            ],
                        ],
                    },
                    { transaction: t }
                );
                //ORDENAMOS POR DNI
                payments = await _.groupBy(
                    _payments,
                    ({ Person: { document_number } }) => `${document_number}`
                );
                let claves = Object.keys(payments);
                let type = "Matrícula";
                if (data.id_process == req.params.id_semester) {
                    type = "Inscripción";
                }
                for (let i = 0; i < claves.length; i++) {
                    let clave = claves[i];
                    // COMO DETERMINAR CUANDO ES UNA MATRICULA Y CUANDO ES UNA INSCRIPCION

                    if (type === "Inscripción") {
                        dataExcel.push({
                            ID: i + 1,
                            ESTUDIANTE: payments[clave][0].Person.name,
                            INSCRIPCIÓN:
                                payments[clave][0] == null
                                    ? "Null"
                                    : payments[clave][0].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][0].Payment.amount
                                    : "-",
                            MATRÍCULA:
                                payments[clave][1] == null
                                    ? "Null"
                                    : payments[clave][1].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][1].Payment.amount
                                    : "-",
                            "COUTA 1":
                                payments[clave][2] == null
                                    ? "Null"
                                    : payments[clave][2].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][2].Payment.amount
                                    : "-",
                            "COUTA 2":
                                payments[clave][3] == null
                                    ? "Null"
                                    : payments[clave][3].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][3].Payment.amount
                                    : "-",
                            "COUTA 3":
                                payments[clave][4] == null
                                    ? "Null"
                                    : payments[clave][4].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][4].Payment.amount
                                    : "-",
                            "COUTA 4":
                                payments[clave][5] == null
                                    ? "Null"
                                    : payments[clave][5].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][5].Payment.amount
                                    : "-",
                            "COUTA 5":
                                payments[clave][6] == null
                                    ? "Null"
                                    : payments[clave][6].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][6].Payment.amount
                                    : "-",
                            "COUTA 6":
                                payments[clave][7] == null
                                    ? "Null"
                                    : payments[clave][7].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][7].Payment.amount
                                    : "-",
                            "COUTA 7":
                                payments[clave][8] == null
                                    ? "Null"
                                    : payments[clave][8].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][8].Payment.amount
                                    : "-",
                            "COUTA 8":
                                payments[clave][9] == null
                                    ? "Null"
                                    : payments[clave][9].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][9].Payment.amount
                                    : "-",

                            // 'COUTA 9': payments[clave][8].Payment.amount + '/' + payments[clave][8].Payment.type,
                        });
                    } else {
                        dataExcel.push({
                            ID: i + 1,
                            ESTUDIANTE: payments[clave][0].Person.name,
                            MATRÍCULA:
                                payments[clave][0] == null
                                    ? "Null"
                                    : payments[clave][0].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][0].Payment.amount
                                    : "-",
                            "COUTA 1":
                                payments[clave][1] == null
                                    ? "Null"
                                    : payments[clave][1].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][1].Payment.amount
                                    : "-",
                            "COUTA 2":
                                payments[clave][2] == null
                                    ? "Null"
                                    : payments[clave][2].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][2].Payment.amount
                                    : "-",
                            "COUTA 3":
                                payments[clave][3] == null
                                    ? "Null"
                                    : payments[clave][3].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][3].Payment.amount
                                    : "-",
                            "COUTA 4":
                                payments[clave][4] == null
                                    ? "Null"
                                    : payments[clave][4].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][4].Payment.amount
                                    : "-",
                            "COUTA 5":
                                payments[clave][5] == null
                                    ? "Null"
                                    : payments[clave][5].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][5].Payment.amount
                                    : "-",
                            "COUTA 6":
                                payments[clave][6] == null
                                    ? "Null"
                                    : payments[clave][6].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][6].Payment.amount
                                    : "-",
                            "COUTA 7":
                                payments[clave][7] == null
                                    ? "Null"
                                    : payments[clave][7].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][7].Payment.amount
                                    : "-",
                            "COUTA 8":
                                payments[clave][8] == null
                                    ? "Null"
                                    : payments[clave][8].Payment.type ===
                                      "Pagado"
                                    ? payments[clave][8].Payment.amount
                                    : "-",
                        });
                    }
                }

                info = {
                    admission_plan_denomination: data.description.toUpperCase(),
                    program_denomination:
                        data.Program.denomination.toUpperCase(),
                    organic_unit_denomination:
                        data.Program.Organic_unit_register.denomination.toUpperCase(),
                    sede_denomination:
                        data.Program.Organic_unit_register.Campu.denomination.toUpperCase(),
                    total_pension: totalPension,
                };
            });

            res.status(200).send({ dataExcel: dataExcel, info: info });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    reportLiquidationByAdmissionPlan: async (req, res) => {
        try {
            const principalOrganicUnit = await System_configuration.findOne({
                attributes: ["description", "abbreviation"],
                where: { state: true },
            });
            //INFORMACION DEL PROGRAMA DE ESTUDIO
            let dataInformation = await Admission_plan.findOne({
                where: { id: req.params.id_admission_plan },
                attributes: ["description"],
                include: {
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
            });
            //TOTAL INSCRIPTION
            let inscriptionData = await Student.findAll({
                where: {
                    id_admission_plan: req.params.id_admission_plan,
                },
                attributes: ["id"],
                include: [
                    {
                        attributes: ["amount"],
                        where: {
                            denomination: "Inscripción",
                            type: "Pagado",
                        },
                        required: true,
                        model: Payment,
                        as: "Payment",
                    },
                ],
            });
            let totalInscription = 0;
            inscriptionData.map((r) => {
                totalInscription =
                    parseFloat(r.Payment.amount) + totalInscription;
            });
            ////TOTAL REGISTRATION
            let dataRegistration = await Student.findAll({
                where: {
                    id_admission_plan: req.params.id_admission_plan,
                },
                attributes: ["id"],
                include: [
                    {
                        attributes: ["amount"],
                        where: {
                            denomination: "Matrícula",
                            type: "Pagado",
                        },
                        required: true,
                        model: Payment,
                        as: "Payment",
                    },
                ],
            });
            let totalRegistration = 0;
            dataRegistration.map((r) => {
                totalRegistration =
                    parseFloat(r.Payment.amount) + totalRegistration;
            });
            ////TOTAL PENSION
            let dataPension = await Student.findAll({
                where: {
                    id_admission_plan: req.params.id_admission_plan,
                },
                attributes: ["id"],
                include: [
                    {
                        attributes: ["amount"],
                        where: {
                            denomination: "Pensión",
                            type: "Pagado",
                        },
                        required: true,
                        model: Payment,
                        as: "Payment",
                    },
                ],
            });
            let totalPension = 0;
            dataPension.map((r) => {
                totalPension = parseFloat(r.Payment.amount) + totalPension;
            });
            ////TOTAL OTHER CONCEPTS
            let dataOther = await Student.findAll({
                where: {
                    id_admission_plan: req.params.id_admission_plan,
                },
                attributes: ["id"],
                include: [
                    {
                        attributes: ["id_concept", "amount", "denomination"],
                        required: true,
                        model: Payment,
                        as: "Payment",
                        where: {
                            type: "Pagado",
                            [Op.and]: [
                                { id_concept: { [Op.ne]: 81 } }, //Inscripción de postulante Ordinario
                                { id_concept: { [Op.ne]: 82 } }, //Inscripción por traslado Interno de postulante ordinario
                                { id_concept: { [Op.ne]: 83 } }, //Inscripción por traslado Externo Nacional
                                { id_concept: { [Op.ne]: 84 } }, //Inscripción por traslado Externo Internacional
                                { id_concept: { [Op.ne]: 4 } }, // Matrícula Maestria
                                { id_concept: { [Op.ne]: 3 } }, //Matrícula Doctorado
                                { id_concept: { [Op.ne]: 94 } }, //Matrícula Segunda Especialidad
                                { id_concept: { [Op.ne]: 8 } }, //Matrícula Extemporanea maestria
                                { id_concept: { [Op.ne]: 92 } }, //Matrícula Extemporanea doctorado
                                { id_concept: { [Op.ne]: 85 } }, //Pensión de enseñanza
                            ],
                            //id_concept: {[Op.ne]: [84,4,85]},
                            //denomination: {[Op.ne]: ['Inscripción', 'Matrícula', 'Pensión']},
                        },
                    },
                ],
            });
            let totalOther = 0;
            dataOther.map((r) => {
                totalOther = parseFloat(r.Payment.amount) + totalOther;
            });

            //EGRESS
            //////////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////EGRESS/////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////
            let serviceMaterialEgress = await Egress.findAll({
                attributes: ["id", "amount"],
                where: {
                    state_egress: "Pagado",
                    id_admission_plan: req.params.id_admission_plan,
                    id_material: { [Op.ne]: null }, //comision de admision
                },
            });
            let egressServiceMaterial = 0;
            serviceMaterialEgress.map((r) => {
                egressServiceMaterial =
                    parseFloat(r.amount) + egressServiceMaterial;
            });
            let teacherData = await Egress.findAll({
                attributes: ["id", "amount"],
                where: {
                    state_egress: "Pagado",
                    id_admission_plan: req.params.id_admission_plan,
                    id_concept: 87, //codigo concepto de pago docente
                },
            });
            let egressTeacher = 0;
            teacherData.map((r) => {
                egressTeacher = parseFloat(r.amount) + egressTeacher;
            });
            let administrativeData = await Egress.findAll({
                attributes: ["id", "amount"],
                where: {
                    state_egress: "Pagado",
                    id_admission_plan: req.params.id_admission_plan,
                    id_concept: { [Op.or]: [88, 89, 90] }, // 88 89 90 pagos a administrativos
                },
            });
            let egressAdministrative = 0;
            administrativeData.map((r) => {
                egressAdministrative =
                    parseFloat(r.amount) + egressAdministrative;
            });
            //TOTAL BALANCE
            //////////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////TOTAL BALANCE/////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////
            let totalMovement = "";
            let _totalMovement = 0;
            let _totalPayment = 0;
            let totalPayment = "";

            totalMovement = await Student.findAll({
                where: {
                    id_admission_plan: req.params.id_admission_plan,
                },
                attributes: ["id"],
                include: [
                    {
                        required: true,
                        model: Movement,
                        as: "Movement",
                        attributes: ["voucher_amount"],
                        where: { state: "Aceptado" },
                    },
                ],
            });
            totalMovement.map((r) => {
                _totalMovement =
                    parseFloat(r.Movement.voucher_amount) +
                    parseFloat(_totalMovement);
            });
            totalPayment = await Student.findAll({
                where: {
                    id_admission_plan: req.params.id_admission_plan,
                },
                attributes: ["id"],
                include: [
                    {
                        required: true,
                        model: Payment,
                        as: "Payment",
                        attributes: ["amount"],
                        where: {
                            type: "Pagado",
                        },
                    },
                ],
            });
            totalPayment.map((r) => {
                _totalPayment =
                    parseFloat(r.Payment.amount) + parseFloat(_totalPayment);
            });

            // totalOther = _totalMovement - _totalPayment + totalOther;

            //////////////////////////////////////////////////////////////////////////////////////////
            let subTotalEntry =
                totalInscription +
                totalRegistration +
                totalPension +
                totalOther;
            let subTotalEgress =
                egressAdministrative + egressServiceMaterial + egressTeacher;
            let netIncome = subTotalEntry - subTotalEgress;
            let unsmPercent = netIncome * 0.37;
            let total = netIncome - unsmPercent;
            let dateGenerate = moment().format();
            res.send({
                _totalMovement,
                _totalPayment,
                dataInformation,
                principalOrganicUnit,
                totalInscription,
                totalRegistration,
                totalPension,
                totalOther,
                subTotalEntry,
                egressServiceMaterial,
                egressTeacher,
                egressAdministrative,
                subTotalEgress,
                netIncome,
                unsmPercent,
                total,
                dateGenerate,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    ////////////////////////////////////////////////////
    //DATOS DEL DASHBOARD////////////////////////////////////////////////////
    chartInscriptionProcess: async (req, res) => {
        try {
            let data = [];
            let students = [];
            let totalResult = 0;
            await ST.transaction(async (t) => {
                students = await Program.findAll(
                    {
                        attributes: ["id", ["description", "denomination"]],
                        include: [
                            {
                                attributes: ["denomination"],
                                model: Organic_unit,
                                as: "Organic_unit_register",
                                include: {
                                    attributes: ["denomination"],
                                    model: Campus,
                                    as: "Campu",
                                },
                            },
                            {
                                attributes: ["id"],
                                where: { id_process: req.params.id_process },
                                model: Admission_plan,
                                as: "Admission_plan",
                                include: {
                                    attributes: ["id"],
                                    required: true,
                                    model: Student,
                                    as: "Student",
                                },
                            },
                        ],
                    },
                    { transaction: t }
                );

                const mp = new Map(students.map((o) => [o.id, { count: 0 }]));
                for (const { id } of students) mp.get(id).count++;
                const result = Array.from(mp.values());
                let finalResult = [];
                for (let i = 0; i < result.length; i++) {
                    totalResult = totalResult + result[i].count;
                    finalResult.push(result[i].count);
                }
                const mpp = new Map(
                    students.map((o) => [
                        o.id,
                        { denomination: o.denomination },
                    ])
                );
                const resultp = Array.from(mpp.values());
                let finalResulp = [];
                for (let i = 0; i < resultp.length; i++) {
                    finalResulp.push(resultp[i].denomination);
                }
                // console.log(result)
                data = {
                    cant: finalResult,
                    program: finalResulp,
                    total: totalResult,
                };
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
    chartRegistrationProcess: async (req, res) => {
        try {
            let data = [];
            let students = [];
            let totalResult = 0;
            await ST.transaction(async (t) => {
                students = await Program.findAll(
                    {
                        attributes: ["id", ["description", "denomination"]],
                        include: [
                            {
                                attributes: ["denomination"],
                                model: Organic_unit,
                                as: "Organic_unit_register",
                                include: {
                                    attributes: ["denomination"],
                                    model: Campus,
                                    as: "Campu",
                                },
                            },
                            {
                                attributes: ["id"],
                                where: { id_semester: req.params.id_process },
                                model: Registration,
                                as: "Registration",
                                include: {
                                    attributes: ["id"],
                                    required: true,
                                    model: Student,
                                    as: "Student",
                                },
                            },
                        ],
                    },
                    { transaction: t }
                );

                const mp = new Map(students.map((o) => [o.id, { count: 0 }]));
                for (const { id } of students) mp.get(id).count++;
                const result = Array.from(mp.values());
                let finalResult = [];
                for (let i = 0; i < result.length; i++) {
                    totalResult = totalResult + result[i].count;
                    finalResult.push(result[i].count);
                }
                const mpp = new Map(
                    students.map((o) => [
                        o.id,
                        { denomination: o.denomination },
                    ])
                );
                const resultp = Array.from(mpp.values());
                let finalResulp = [];
                for (let i = 0; i < resultp.length; i++) {
                    finalResulp.push(resultp[i].denomination);
                }
                // console.log(result)
                data = {
                    cant: finalResult,
                    program: finalResulp,
                    total: totalResult,
                };
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
    chartEgressProcess: async (req, res) => {
        try {
            let data = [];
            let students = [];
            let totalResult = 0;
            await ST.transaction(async (t) => {
                students = await Program.findAll(
                    {
                        attributes: ["id", ["description", "denomination"]],
                        include: [
                            {
                                attributes: ["denomination"],
                                model: Organic_unit,
                                as: "Organic_unit_register",
                                include: {
                                    attributes: ["denomination"],
                                    model: Campus,
                                    as: "Campu",
                                },
                            },
                            {
                                attributes: ["id"],
                                where: {
                                    type: "Egresado",
                                    id_process_egress: req.params.id_process,
                                },
                                required: true,
                                model: Student,
                                as: "Student",
                            },
                        ],
                    },
                    { transaction: t }
                );

                const mp = new Map(students.map((o) => [o.id, { count: 0 }]));
                for (const { id } of students) mp.get(id).count++;
                const result = Array.from(mp.values());
                let finalResult = [];
                for (let i = 0; i < result.length; i++) {
                    totalResult = totalResult + result[i].count;
                    finalResult.push(result[i].count);
                }
                const mpp = new Map(
                    students.map((o) => [
                        o.id,
                        { denomination: o.denomination },
                    ])
                );
                const resultp = Array.from(mpp.values());
                let finalResulp = [];
                for (let i = 0; i < resultp.length; i++) {
                    finalResulp.push(resultp[i].denomination);
                }
                // console.log(result)
                data = {
                    cant: finalResult,
                    program: finalResulp,
                    total: totalResult,
                };
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
    chartStudentRequiredDocumentProcess: async (req, res) => {
        try {
            let data = [];
            let students = [];
            await ST.transaction(async (t) => {
                students = await Program.findAll(
                    {
                        attributes: ["id", ["description", "denomination"]],
                        include: [
                            {
                                attributes: ["denomination"],
                                model: Organic_unit,
                                as: "Organic_unit_register",
                                include: {
                                    attributes: ["denomination"],
                                    model: Campus,
                                    as: "Campu",
                                },
                            },
                            {
                                attributes: ["id"],
                                required: true,
                                where: { id_process: req.params.id_process },
                                model: Admission_plan,
                                as: "Admission_plan",
                                include: {
                                    where: {
                                        required_document: req.params.state,
                                    },
                                    attributes: ["id", "required_document"],
                                    required: true,
                                    model: Student,
                                    as: "Student",
                                },
                            },
                        ],
                    },
                    { transaction: t }
                );

                const a = new Map(students.map((o) => [o.id, { count: 0 }]));

                for (const { id } of students) a.get(id).count++;
                const array = Array.from(a.values());
                let cant = [];
                for (let i = 0; i < array.length; i++) {
                    cant.push(array[i].count);
                }

                const mpp = new Map(
                    students.map((o) => [
                        o.id,
                        { denomination: o.denomination },
                    ])
                );
                const resultp = Array.from(mpp.values());
                let finalResulp = [];
                for (let i = 0; i < resultp.length; i++) {
                    finalResulp.push(resultp[i].denomination);
                }
                // console.log(result)
                // data = {'cant': finalResult, 'program': finalResulp};
                data = { cant: cant, program: finalResulp };
                // data = students
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
    chartEntryMovement: async (req, res) => {
        try {
            let data = [];
            let records = [];
            await ST.transaction(async (t) => {
                let startDate = req.body.startDate,
                    endDate = req.body.endDate;
                records = await Program.findAll(
                    {
                        attributes: ["id", ["description", "denomination"]],
                        include: [
                            {
                                attributes: ["denomination"],
                                model: Organic_unit,
                                as: "Organic_unit_register",
                                include: {
                                    attributes: ["denomination"],
                                    model: Campus,
                                    as: "Campu",
                                },
                            },
                            {
                                required: true,
                                where: {
                                    state: "Aceptado",
                                    created_at: {
                                        [Op.between]: [startDate, endDate],
                                    },
                                },
                                model: Movement,
                                as: "Movements",
                            },
                        ],
                    },
                    { transaction: t }
                );

                let programs = [];
                for (let i = 0; i < records.length; i++) {
                    programs.push(records[i].denomination);
                }

                let amounts = [];
                for (let i = 0; i < records.length; i++) {
                    let sub = 0;
                    for (let j = 0; j < records[i].Movements.length; j++) {
                        sub =
                            parseFloat(records[i].Movements[j].voucher_amount) +
                            sub;
                    }
                    amounts.push(sub);
                }

                data = { cant: amounts, program: programs };
                // data = records;
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
    chartEntryEgressNetoMovement: async (req, res) => {
        try {
            let data = [];
            let records = [];
            await ST.transaction(async (t) => {
                let startDate = req.body.startDate,
                    endDate = req.body.endDate;
                //let startDate = '2022-01-04', endDate = '2022-05-02';
                records = await Organic_unit.findAll(
                    {
                        //attributes: ['id', ['description', 'denomination']],
                        include: [
                            {
                                attributes: ["denomination"],
                                model: Campus,
                                as: "Campu",
                            },
                            {
                                required: false,
                                where: {
                                    state: "Aceptado",
                                    voucher_date: {
                                        [Op.between]: [startDate, endDate],
                                    },
                                },
                                model: Movement,
                                as: "Movements",
                            },
                            {
                                required: false,
                                where: {
                                    state_egress: "Pagado",
                                    end_date: {
                                        [Op.between]: [startDate, endDate],
                                    },
                                },
                                model: Egress,
                                as: "Egresss",
                            },
                        ],
                    },
                    { transaction: t }
                );

                let units = [];
                let entrys = [];
                let egress = [];
                let neto = [];
                for (let i = 0; i < records.lenght; i++) {
                    units.push(
                        records[i].denomination + "-" + records[i].denomination
                    );
                    for (let k = 0; k < records[i].Egresss.length; k++) {
                        subEgress =
                            parseFloat(records[i].Egresss[k].amount) +
                            subEgress;
                    }
                }

                //   data = {'Unidades': units, 'Ingreso': entrys, 'Egreso': egress, 'Neto': neto};
                data = records;
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
    totalStudentByState: async (req, res) => {
        try {
            let data = [];

            await ST.transaction(async (t) => {
                const totalStudent = await Student.findAll({
                    where: { type: "Estudiante" },
                });

                data = { totalStudent: totalStudent.length };
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
    totalStudentByStateEgress: async (req, res) => {
        try {
            let data = [];

            await ST.transaction(async (t) => {
                const totalStudent = await Student.findAll({
                    where: { type: "Egresado" },
                });

                data = { totalStudent: totalStudent.length };
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
    totalStudentByStateDesertion: async (req, res) => {
        try {
            let data = [];

            await ST.transaction(async (t) => {
                const totalStudent = await Student.findAll({
                    where: { type: "Desertado" },
                });

                data = { totalStudent: totalStudent.length };
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
    totalStudentPaymentPendient: async (req, res) => {
        try {
            let data = [];

            await ST.transaction(async (t) => {
                const _data = await Payment.findAll({
                    where: { type: "Pendiente" },
                    include: {
                        attributes: ["id"],
                        required: true,
                        model: Student,
                        as: "Student",
                    },
                });
                let temp = 0;
                for (let i = 0; i < _data.length; i++) {
                    temp = temp + parseFloat(_data[i].amount);
                }
                data = { totalStudentPaymentPendient: temp };
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
    listStudentPaymentPendient: async (req, res) => {
        try {
            let data = [];

            await ST.transaction(async (t) => {
                const _data = await Payment.findAll({
                    attributes: ["amount", "denomination"],
                    where: { type: "Pendiente" },
                    include: [
                        {
                            attributes: ["denomination"],
                            model: Academic_semester,
                            as: "Academic_semester",
                            include: {
                                attributes: ["denomination"],
                                model: Academic_calendar,
                                as: "Academic_calendar",
                            },
                        },
                        {
                            attributes: ["id"],
                            required: true,
                            model: Student,
                            as: "Student",
                            include: {
                                attributes: [
                                    "id",
                                    "document_number",
                                    "email",
                                    "photo",
                                    "phone",
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
                        {
                            attributes: ["description"],
                            model: Program,
                            as: "Program",
                        },
                    ],
                });
                data = _data;
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
    ///////////////////////////////////////////////////////////////////////
    updateStudentRequiredDocument: async (req, res) => {
        try {
            let data = [];
            await ST.transaction(async (t) => {
                const record = await Student.findAll();

                let size = record.length;
                let newData = [];
                for (let i = 0; i < size; i++) {
                    let stateStudent = true;
                    if (record[i].type === "Postulante") {
                        stateStudent = false;
                    }

                    let temp = await Student.findByPk(record[i].id);
                    await temp.update(
                        {
                            required_document: stateStudent,
                        },
                        { transaction: t }
                    );
                    newData.push(temp);
                }
                await Promise.all(newData);
                data = record;
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

    updateStructureRegistrationCourse: async (req, res) => {
        try {
            let data = [];
            await ST.transaction(async (t) => {
                const data = require("../../data/Registration_course.json");
                let record = data.RECORDS;

                let size = record.length;
                let newData = [];
                for (let i = 0; i < size; i++) {
                    let temp = await Registration_course.create(
                        {
                            id: record[i].id,
                            id_registration: record[i].id_registration,
                            id_schedule: record[i].id_schedule || null,
                            id_course: record[i].id_course,
                            type_course: "R",
                            note: record[i].note,
                            state: record[i].state,
                            created_at: "2021-02-05 12:32:49.602-05",
                            updated_at: "2021-02-05 12:32:49.602-05",
                            deleted_at: record[i].deleted_at
                                ? "2021-02-05 12:32:49.602-05"
                                : null,
                        },
                        { transaction: t }
                    );
                    newData.push(temp);
                }
                await Promise.all(newData);
                res.status(200).send(record);
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    updateStructureScheduleHorary: async (req, res) => {
        try {
            let data = [];
            await ST.transaction(async (t) => {
                let newSchedule = [];
                let tempArray = [];

                let registration = await Registration.findAll({
                    include: {
                        required: true,
                        model: Registration_course,
                        as: "Registration_course",
                    },
                });
                let y = 0;
                for (let i = 0; i < registration.length; i++) {
                    for (
                        let j = 0;
                        j < registration[i].Registration_course.length;
                        j++
                    ) {
                        y = y + 1;
                        let tempSchedule = await Schedule.create(
                            {
                                id: y,
                                id_course:
                                    registration[i].Registration_course[j]
                                        .id_course,
                                id_program: registration[i].id_program,
                                id_process: registration[i].id_semester,
                                type_registration: "R",
                                group_class: "1",
                                start_date: "2021-02-05",
                                end_date: "2021-02-05",
                                state: true,
                                created_at: "2021-02-05 12:32:49.602-05",
                                updated_at: "2021-02-05 12:32:49.602-05",
                                deleted_at: null,
                            },
                            { transaction: t }
                        );
                        newSchedule.push(tempSchedule);
                    }
                }
                await Promise.all(newSchedule);
                res.status(200).send(newSchedule);
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    updateCreateScheduleJsonData: async (req, res) => {
        try {
            let data = [];
            await ST.transaction(async (t) => {
                let newSchedule = [];
                let tempArray = [];

                let data = require("../../data/Schedule.json");

                for (let j = 0; j < data.length; j++) {
                    let tempSchedule = await Schedule.create(
                        {
                            id: j + 1,
                            id_course: data[j].id_course,
                            id_program: data[j].id_program,
                            id_process: data[j].id_process,
                            type_registration: "R",
                            group_class: "1",
                            start_date: "2021-02-05",
                            end_date: "2021-02-05",
                            state: true,
                            created_at: "2021-02-05 12:32:49.602-05",
                            updated_at: "2021-02-05 12:32:49.602-05",
                            deleted_at: null,
                        },
                        { transaction: t }
                    );
                    newSchedule.push(tempSchedule);
                }

                await Promise.all(newSchedule);

                res.status(200).send(newSchedule);
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    updateScheduleRepiet: async (req, res) => {
        try {
            let data = [];
            await ST.transaction(async (t) => {
                let newSchedule = [];
                let tempArray = [];

                let schedules = await Schedule.findAll();
                const unicos = [];

                for (let i = 0; i < schedules.length; i++) {
                    const schedule = schedules[i];
                    let esDuplicado = false;
                    for (let j = 0; j < unicos.length; j++) {
                        if (
                            unicos[j].id_course === schedule.id_course &&
                            unicos[j].id_process === schedule.id_process
                        ) {
                            esDuplicado = true;
                            break;
                        }
                    }

                    if (!esDuplicado) {
                        unicos.push(schedule);
                    }
                }

                res.status(200).send(unicos);
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    updateRegisterScheduleIDinRegistrationCourse: async (req, res) => {
        try {
            await ST.transaction(async (t) => {
                let tempArray = [];

                const schedules = await Schedule.findAll();
                const unicos = [];

                for (let i = 0; i < schedules.length; i++) {
                    let registrationCourses = await Registration.findAll(
                        {
                            where: { id_semester: schedules[i].id_process },
                            include: {
                                where: { id_course: schedules[i].id_course },
                                model: Registration_course,
                                as: "Registration_course",
                            },
                        },
                        { transaction: t }
                    );

                    for (let j = 0; j < registrationCourses.length; j++) {
                        for (
                            let k = 0;
                            k <
                            registrationCourses[j].Registration_course.length;
                            k++
                        ) {
                            // let registationCourseTemp = await Registration_course.findByPk(registrationCourses[j].Registration_course[k].id);
                            let registationCourseTemp =
                                await registrationCourses[
                                    j
                                ].Registration_course[k].update(
                                    {
                                        id_schedule: schedules[i].id,
                                    },
                                    { transaction: t }
                                );
                            tempArray.push(registationCourseTemp);
                        }
                    }
                }
                await Promise.all(tempArray);

                res.status(200).send(tempArray);
            });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },

    updateStudentModality: async (req, res) => {
        try {
            let data = [];
            await ST.transaction(async (t) => {
                const record = await Student.findAll({
                    include: {
                        model: Admission_plan,
                        as: "Admission_plan",
                    },
                });

                let size = record.length;
                let newData = [];
                for (let i = 0; i < size; i++) {
                    let fieldUpdate = "Presencial";
                    if (record[i].Admission_plan.date_start >= "2020") {
                        fieldUpdate = "A distancia";
                    }
                    let temp = await Student.findByPk(record[i].id);
                    await temp.update(
                        {
                            study_modality: fieldUpdate,
                        },
                        { transaction: t }
                    );
                    newData.push(temp);
                }
                await Promise.all(newData);
                data = record;
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
    updateStudentType: async (req, res) => {
        try {
            let data = [];
            await ST.transaction(async (t) => {
                const record = await Student.findAll();

                let size = record.length;
                let newData = [];
                for (let i = 0; i < size; i++) {
                    let fieldUpdate = "Estudiante";
                    if (record[i].type === "Postulante") {
                        fieldUpdate = "Estudiante";
                    }
                    let temp = await Student.findByPk(record[i].id);
                    await temp.update(
                        {
                            type: fieldUpdate,
                        },
                        { transaction: t }
                    );
                    newData.push(temp);
                }
                await Promise.all(newData);
                data = record;
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
    updateStudentNumberRegistration: async (req, res) => {
        try {
            let data = [];
            await ST.transaction(async (t) => {
                const record = await Student.findAll({
                    include: {
                        where: {
                            [Op.or]: [
                                { type: { [Op.eq]: "Extemporánea" } },
                                { type: { [Op.eq]: "Regular" } },
                            ],
                        },
                        model: Registration,
                        as: "Registration",
                    },
                    order: [
                        [
                            { model: Registration, as: "Registration" },
                            "created_at",
                            "asc",
                        ],
                    ],
                });

                let size = record.length;
                let newData = [];
                for (let i = 0; i < size; i++) {
                    for (let j = 0; j < record[i].Registration.length; j++) {
                        let temp = await Registration.findByPk(
                            record[i].Registration[j].id
                        );
                        await temp.update(
                            {
                                number_registration: j + 1,
                            },
                            { transaction: t }
                        );
                        newData.push(temp);
                    }
                }
                await Promise.all(newData);
                data = record;
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
    updateStudentEgress: async (req, res) => {
        try {
            let data = [];
            await ST.transaction(async (t) => {
                const record = await Student.findAll({
                    where: { type: "Estudiante" },
                    attributes: ["id", "type"],
                    include: [
                        {
                            attributes: ["credit_required"],
                            model: Plan,
                            as: "Plan",
                        },
                        {
                            attributes: ["id", "id_semester"],
                            required: true,
                            model: Registration,
                            as: "Registration",
                            include: {
                                attributes: ["id", "state"],
                                required: true,
                                model: Registration_course,
                                as: "Registration_course",
                                include: {
                                    attributes: ["id", "credits"],
                                    model: Course,
                                    as: "Course",
                                },
                            },
                        },
                    ],
                    order: [
                        [
                            { model: Registration, as: "Registration" },
                            "created_at",
                            "asc",
                        ],
                    ],
                });
                let studentData = [];
                for (let i = 0; i < record.length; i++) {
                    let totalCredit = 0;
                    let size = record[i].Registration.length;
                    let stageProcess =
                        record[i].Registration[size - 1].id_semester;
                    for (let j = 0; j < record[i].Registration.length; j++) {
                        for (
                            let k = 0;
                            k <
                            record[i].Registration[j].Registration_course
                                .length;
                            k++
                        ) {
                            if (
                                record[i].Registration[j].Registration_course[k]
                                    .state === "Aprobado"
                            ) {
                                totalCredit =
                                    totalCredit +
                                    record[i].Registration[j]
                                        .Registration_course[k].Course.credits;
                            }
                        }
                    }
                    if (totalCredit > 0) {
                        if (totalCredit >= record[i].Plan.credit_required) {
                            studentData.push({
                                id_student: record[i].id,
                                id_process_egress: stageProcess,
                                required_credit: record[i].Plan.credit_required,
                                total_credit: totalCredit,
                            });
                        }
                    }

                    let newData = [];
                    for (let i = 0; i < studentData.length; i++) {
                        let temp = await Student.findByPk(record[i].id);
                        await temp.update(
                            {
                                type: "Egresado",
                                id_process_egress:
                                    studentData[0].id_process_egress,
                            },
                            { transaction: t }
                        );
                        newData.push(temp);
                    }
                    await Promise.all(newData);
                }

                data = studentData;
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
    updateRegistrationData: async (req, res) => {
        try {
            let data = [];
            await ST.transaction(async (t) => {
                const record = await Registration.findAll({
                    include: {
                        required: true,
                        model: Student,
                        as: "Student",
                    },
                });

                let size = record.length;
                let newRegistration = [];
                for (let i = 0; i < size; i++) {
                    let temp = await Registration.findByPk(record[i].id);
                    await temp.update(
                        {
                            id_program: record[i].Student.id_program,
                            id_organic_unit: record[i].Student.id_organic_unit,
                        },
                        { transaction: t }
                    );
                    newRegistration.push(temp);
                }
                await Promise.all(newRegistration);
                data = record;
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
    upatePaymentProgramOrganicUnit: async (req, res) => {
        //actualiza los datos en la tabla payment que no tiene id_programa e id_organic_unti
        try {
            let data = [];
            await ST.transaction(async (t) => {
                const record = await Payment.findAll({
                    include: {
                        required: true,
                        model: Student,
                        as: "Student",
                    },
                });

                let size = record.length;
                let newData = [];
                for (let i = 0; i < size; i++) {
                    let temp = await Payment.findByPk(record[i].id);
                    await temp.update(
                        {
                            id_program: record[i].Student.id_program,
                            id_organic_unit: record[i].Student.id_organic_unit,
                        },
                        { transaction: t }
                    );
                    newData.push(temp);
                }
                await Promise.all(newData);
                data = record;
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
    upateMovementProgramOrganicUnit: async (req, res) => {
        try {
            let data = [];
            await ST.transaction(async (t) => {
                const record = await Movement.findAll({
                    include: {
                        required: true,
                        model: Student,
                        as: "Student",
                    },
                });

                let size = record.length;
                let newData = [];
                for (let i = 0; i < size; i++) {
                    let temp = await Movement.findByPk(record[i].id);
                    await temp.update(
                        {
                            id_program: record[i].Student.id_program,
                            id_organic_unit: record[i].Student.id_organic_unit,
                        },
                        { transaction: t }
                    );
                    newData.push(temp);
                }
                await Promise.all(newData);
                data = record;
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

    updatePaymentStructureJson: async (req, res) => {
        let temp = [];
        let data = [];
        try {
            await ST.transaction(async (t) => {
                for (let i = 0; i < temp.length; i++) {
                    data.push({
                        id: temp[i].id,
                        id_student: temp[i].id_student,
                        id_program: null,
                        id_organic_unit: null,
                        id_registration: temp[i].id_registration,
                        id_concept: temp[i].id_concept,
                        id_cost_admission: temp[i].id_cost_admission,
                        id_semester: temp[i].id_semester,
                        payment_date: temp[i].payment_date,
                        order_number: temp[i].order_number,
                        denomination: temp[i].denomination,
                        amount: temp[i].amount,
                        type: temp[i].type,
                        state: temp[i].state,
                        created_at: temp[i].created_at,
                        updated_at: temp[i].updated_at,
                        deleted_at:
                            temp[i].deleted_at !== ""
                                ? temp[i].deleted_at
                                : null,
                    });
                }
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
    updateUbigeoSunedu: async (req, res) => {
        let temp = [];
        let temp2 = [];
        let data2 = [];
        try {
            await ST.transaction(async (t) => {
                // let data = await District.findAll({
                //     c
                //     include: {
                //         attributes: ['description'],
                //         model: Province,
                //         as: 'Province',
                //         include: {
                //             attributes: ['description'],
                //             model: Department,
                //             as: 'Department'
                //         }
                //     }
                // });
                let ubiegosunedu = [];

                // for (let i = 0; i < data.length; i++) {
                //     for (let j = 0; j < ubiegosunedu.length; j++) {
                //
                //         if (
                //             data[i].description == ubiegosunedu[j].DISTRITO.toUpperCase() &&
                //             data[i].Province.description == ubiegosunedu[j].PROVINCIA.toUpperCase() &&
                //             data[i].Province.Department.description == ubiegosunedu[j].DEPARTAMENTO.toUpperCase()
                //         ) {
                //             temp.push(
                //                 {
                //                     "id": data[i].id,
                //                     "description": data[i].description,
                //                     "code": ubiegosunedu[j].CODIGO
                //                 },
                //             )
                //         }
                //
                //     }
                // }

                //
                // let arrayUpdate = [];
                // for (let k = 0; k < updateData.length; k++) {
                //     let data = await District.findByPk(updateData[k].id);
                //     let update = await data.update({code: updateData[k].code})
                //     arrayUpdate.push(update);
                // }

                // await Promise.all(arrayUpdate);

                data2 = await District.findAll({
                    attributes: ["id", "description", "code"],
                    where: { code: null },
                    include: {
                        attributes: ["description"],
                        model: Province,
                        as: "Province",
                        include: {
                            attributes: ["description"],
                            model: Department,
                            as: "Department",
                        },
                    },
                });
            });
            res.status(200).send(data2);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    updateRequerimentStudent: async (req, res) => {
        let temp = [];
        let temp2 = [];
        let data2 = [];
        try {
            await ST.transaction(async (t) => {
                const students = await Student.findAll(
                    {
                        attributes: ["id", "id_person", "id_concept"],
                        include: [
                            {
                                attributes: ["id", "id_academic_degree"],
                                model: Program,
                                as: "Program",
                            },
                            {
                                attributes: ["id", "id_requeriment", "state"],
                                model: Requeriment_delivered,
                                as: "Requeriment_delivereds",
                            },
                        ],
                    },
                    { transaction: t }
                );

                let i = 0;
                for (i; i < students.length; i++) {
                    let requerimets = await Requeriment.findAll(
                        {
                            where: {
                                id_academic_degree:
                                    students[i].Program.id_academic_degree,
                                id_concept: students[i].id_concept,
                            },
                        },
                        { transaction: t }
                    );
                    let j = 0;
                    for (
                        j;
                        j < students[i].Requeriment_delivereds.length;
                        j++
                    ) {}
                }
                data2 = students;
            });
            res.status(200).send(data2);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    updateStructurePerson: async (req, res) => {
        let temp = [];
        data = [];

        try {
            for (let i = 0; i < temp.length; i++) {
                data.push({
                    id: temp[i].id,
                    id_identification_document: 1,
                    id_civil_status: temp[i].id_civil_status,
                    id_ubigeo_birth: temp[i].id_ubigeo_birth,
                    id_ubigeo_resident: temp[i].id_ubigeo_resident,
                    id_nationality: 85,
                    photo: temp[i].photo,
                    code: temp[i].code,
                    document_number: temp[i].document_number,
                    name: temp[i].name,
                    paternal: temp[i].paternal,
                    maternal: temp[i].maternal,
                    gender: temp[i].gender,
                    birth_date: temp[i].birth_date,
                    phone: temp[i].phone,
                    cell_phone: temp[i].cell_phone,
                    address: temp[i].address,
                    email: temp[i].email,
                    student_state: temp[i].student_state,
                    teacher_state: temp[i].teacher_state,
                    administrative_state: temp[i].administrative_state,
                    just_last_name: "f",
                    state: temp[i].state,
                    created_at: temp[i].created_at,
                    updated_at: temp[i].updated_at,
                    deleted_at:
                        temp[i].deleted_at !== "" ? temp[i].deleted_at : null,
                });
            }

            res.status(200).send(data);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    updateStructureStudent: async (req, res) => {
        let temp = [];
        data = [];

        try {
            for (let i = 0; i < temp.length; i++) {
                data.push({
                    id: "32",
                    id_person: "984",
                    id_program: "8",
                    id_organic_unit: "155",
                    id_plan: "26",
                    id_admission_plan: "10",
                    id_cost_admission: "25",
                    id_concept: "81",
                    type: "Postulante",
                    type_entry: "Postulante",
                    student_modality: "Postulante",
                    state: "t",
                    created_at: "30/12/2020 13:24:03.198-05:05",
                    updated_at: "30/12/2020 13:24:03.198-05:05",
                    deleted_at: "",
                });
            }

            res.status(200).send(data);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    updatePaymentOrderNumber: async (req, res) => {
        let temp = [];
        let data = [];
        let newData = [];

        try {
            await ST.transaction(async (t) => {
                data = await Student.findAll({
                    attributes: ["id"],
                    include: {
                        attributes: [
                            "id",
                            "id_concept",
                            "order_number",
                            "created_at",
                        ],
                        model: Payment,
                        as: "Payments",
                        where: { id_concept: 85 },
                    },
                    order: [
                        [
                            { model: Payment, as: "Payments" },
                            "created_at",
                            "asc",
                        ],
                    ],
                });
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
};
