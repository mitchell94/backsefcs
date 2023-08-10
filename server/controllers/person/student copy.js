const Sequelize = require("sequelize");
const message = require("../../messages");

const bcrypt = require("bcryptjs");
const moment = require("moment");
const Op = Sequelize.Op;
const uuid = require("uuid");
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const fs = require("fs").promises;
const crypt = require("node-cryptex");
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
const generator = require("voucher-code-generator");
const Model = require("../../models").Student;
const Person = require("../../models").Person;
const Student = require("../../models").Student;
const ST = Model.sequelize;
const Programs = require("../../models").Programs;
const Cost = require("../../models").Cost;
const Payment = require("../../models").Payment;
const Requeriment = require("../../models").Requeriment;
const Payment_detail = require("../../models").Payment_detail;
const Student_document = require("../../models").Student_document;
const Document = require("../../models").Document;
const Document_type = require("../../models").Document_type;
const Organic_unit = require("../../models").Organic_unit;
const Admission_plan = require("../../models").Admission_plan;
const Cost_admission_plan = require("../../models").Cost_admission_plan;
const Concept = require("../../models").Concept;
const Registration = require("../../models").Registration;
const Registration_course = require("../../models").Registration_course;
const Movement = require("../../models").Movement;
const Requeriment_delivered = require("../../models").Requeriment_delivered;
const Campus = require("../../models").Campus;
const Academic_degree = require("../../models").Academic_degree;
const Academic_semester = require("../../models").Academic_semester;
const Academic_calendar = require("../../models").Academic_calendar;
const Student_discount = require("../../models").Student_discount;
// MPT
const Uit = require("../../models").Uit;
const Plan = require("../../models").Plan;
const Ciclo = require("../../models").Ciclo;
const Course = require("../../models").Course;
const Schedule = require("../../models").Schedule;
//
const URL_PLUBLIC = require("../Abox").URL_PLUBLIC;
const url_person_voucher = URL_PLUBLIC + "person/voucher/";
module.exports = {
    // =>PERSONA=>MATRICULAS  REGISTRA EL ID_USARIO Y ID_MENCION UNIDADORAGANICA Y GENERA LAS MENSUALIDADES DEL ESTUDIANTE
    create: async (req, res) => {
        try {
            let student;
            let semester;
            let students = [];
            let payments = [];
            let paymentDetails = [];
            let promiseDetails = [];
            let promises = [];
            let promiseFinal;
            let cost = "";
            let codeInscription;
            let result = await ST.transaction(async (t) => {
                //BUSCAMOS EL CODIGO DE PAGO
                cost = await Cost.findOne(
                    {
                        attributes: ["id", "id_mention", "code", "state"],
                        where: {
                            id_mention: req.body.id_mention,
                        },
                    },
                    { transaction: t }
                );

                //BUSCAMOS SI EL ESTUDIANTE YA ESTA REGISTRADO SEGUN SU ID Y MENTIONC
                student = await Model.findOne(
                    {
                        where: {
                            [Op.and]: [
                                { id_user: req.body.id_user },
                                { id_mention: req.body.id_mention },
                            ],
                        },
                    },
                    { transaction: t }
                );
                if (student) {
                    return { message: "Ya esta registrado en este programa" };
                } else {
                    let max = await Model.max(
                        "id",
                        { paranoid: false },
                        { transaction: t }
                    );
                    students = await Model.create(
                        {
                            id: max + 1,
                            id_user: req.body.id_user,
                            id_mention: req.body.id_mention,
                            id_semester: req.body.id_semester,
                            id_organic_unit: req.body.id_organic_unit,
                        },
                        { transaction: t }
                    );
                    //REGISTRAMOS AL ESTUDIANTE

                    if (students && cost) {
                        let concepts = JSON.parse(
                            crypt.decrypt(req.body.concepts, k, v)
                        );
                        let max = await Payment.max(
                            "id",
                            { paranoid: false },
                            { transaction: t }
                        );
                        let j = 1;
                        for (let i = 0; i < concepts.length; i++) {
                            let semesterD = null;
                            let paymentDate = null;
                            if (
                                concepts[i].Concepts_parent.denomination ===
                                "INSCRIPCIÓN"
                            ) {
                                semesterD = req.body.id_semester;
                                paymentDate = moment().format();
                            }
                            payments = await Payment.create(
                                {
                                    id: max + j++,
                                    // id_semester_mention: semesterD,
                                    id_concepts: concepts[i].id,
                                    id_student: students.id,
                                    payment_date: paymentDate,
                                    code: cost.code, // codigo de costo
                                    denomination:
                                        concepts[i].Concepts_parent
                                            .denomination,
                                    amount: concepts[i].amount,
                                    type: concepts[i].type,
                                    order_number: concepts[i].order_number,
                                    state: concepts[i].state,
                                },
                                { transaction: t }
                            );
                            promises.push(payments);
                        } //REGISTRAMOS EN PAYMENT LOS DATOS

                        promiseFinal = await Promise.all(promises);
                        if (promiseFinal) {
                            let codePay = "";
                            let codeInscription = generator.generate({
                                length: 6,
                                count: 1,
                                charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                            });
                            let otherCode = generator.generate({
                                length: 6,
                                count: 1,
                                charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                            });
                            let maxDetail = await Payment_detail.max(
                                "id",
                                { paranoid: false },
                                { transaction: t }
                            );
                            for (let h = 0; h < promiseFinal.length; h++) {
                                if (promiseFinal[h].state) {
                                    if (promiseFinal[h].state === true) {
                                        if (
                                            promiseFinal[h].denomination ===
                                            "INSCRIPCIÓN"
                                        ) {
                                            codePay = codeInscription[0];
                                        } else {
                                            codePay = otherCode[0];
                                        }
                                    }

                                    paymentDetails =
                                        await Payment_detail.create(
                                            {
                                                id: maxDetail + h + 1,
                                                id_payment: promiseFinal[h].id,
                                                id_cashbox_flow: null,
                                                code: codePay, // codigo de pago generado
                                                amount: promiseFinal[h].amount,
                                                order_number:
                                                    promiseFinal[h]
                                                        .order_number,
                                                type: "Pendiente",
                                                state: promiseFinal[h].state,
                                            },
                                            { transaction: t }
                                        );
                                    promiseDetails.push(paymentDetails);
                                }
                            }
                            await Promise.all(promiseDetails); //REGISTRAMOS EN PAYMENT_DETAIL LOS DATOS QUE TIENE CODIGO DE PAGO
                        }

                        return students;
                    } else {
                        return "no cargaron los costos";
                    }
                }
            });

            // In this case, an instance of Model

            res.status(200).send(result);
            // res.status(200).send(students)
        } catch (err) {
            // Rollback transaction if any errors were encountered

            console.log(err);
            res.status(445).send(err);
        }
    },

    // listStudentPayment: function (req, res) {
    //     return Model
    //         .findAll({
    //             attributes: ['id', 'id_mention', 'id_user'],
    //             include:
    //                 [
    //                     {
    //                         attributes: ['state'],
    //                         model: User,
    //                         as: 'User',
    //                         include: {
    //                             attributes: ['document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
    //                             model: Person,
    //                             as: 'Person'
    //                         }
    //                     },
    //                     {
    //                         attributes: ['id', 'denomination'],
    //                         model: Mention,
    //                         as: 'Mention',
    //                         include: {
    //                             attributes: ['id', 'denomination'],
    //                             model: Programs,
    //                             as: 'Programs'
    //                         }
    //                     },
    //                     {
    //                         attributes: ['id', 'code', 'denomination', 'amount', 'voucher_code', 'voucher_date', 'voucher_url', 'voucher_amount', 'order_number', 'type', 'state'],
    //                         where: {
    //                             type: 'Realizado'
    //                         },
    //                         model: Payment,
    //                         as: 'Payment'
    //                     }
    //
    //                 ],
    //             order: [
    //                 [{model: Payment, as: 'Payment'}, 'order_number', 'asc']
    //             ],
    //         })
    //         .then(records => {
    //
    //             const elementExist = (array, value) => {
    //                 let i = 0;
    //                 while (i < array.length) {
    //                     if (array[i].code == value)
    //                         return i;
    //                     i++;
    //                 }
    //                 return false;
    //             };
    //
    //             const getIndice = (array, code) => {
    //                 var Indice = -1;
    //                 array.filter(function (r, i) {
    //                     if (r.code === code) {
    //                         Indice = i;
    //                     }
    //                 });
    //                 return Indice;
    //             };
    //             let data = [];
    //             for (let i = 0; i < records.length; i++) {
    //                 for (let j = 0; j < records[i].Payment.length; j++) {
    //                     let n = elementExist(data, records[i].Payment[j].code);
    //                     if (n === false) {
    //                         // Si no existe, creo agrego un nuevo objeto.
    //                         data.push({
    //                                 'code': records[i].Payment[j].code,
    //                                 'person': records[i].User.Person.name,
    //                                 'email': records[i].User.Person.email,
    //                                 'document_number': records[i].User.Person.document_number,
    //                                 'program': records[i].Mention.Programs.denomination + 'CON MENCION EN ' + records[i].Mention.denomination,
    //                                 'Payment': [
    //                                     {
    //                                         'id': records[i].Payment[j].id,
    //                                         'code': records[i].Payment[j].code,
    //                                         'denomination': records[i].Payment[j].denomination,
    //                                         'amount': records[i].Payment[j].amount,
    //                                         'voucher_code': records[i].Payment[j].voucher_code,
    //                                         'voucher_date': records[i].Payment[j].voucher_date,
    //                                         'voucher_url': records[i].Payment[j].voucher_url,
    //                                         'voucher_amount': records[i].Payment[j].voucher_amount,
    //                                         'order_number': records[i].Payment[j].order_number,
    //                                         'type': records[i].Payment[j].type,
    //                                         'state': records[i].Payment[j].state,
    //                                     }
    //                                 ]
    //                             });
    //                     } else {
    //                         indice = getIndice(data, records[i].Payment[j].code);
    //                         data[indice].Payment.push(
    //                             {
    //                                 'code': records[i].Payment[j].code,
    //                                 'id': records[i].Payment[j].id,
    //                                 'denomination': records[i].Payment[j].denomination,
    //                                 'amount': records[i].Payment[j].amount,
    //                                 'voucher_code': records[i].Payment[j].voucher_code,
    //                                 'voucher_date': records[i].Payment[j].voucher_date,
    //                                 'voucher_url': records[i].Payment[j].voucher_url,
    //                                 'voucher_amount': records[i].Payment[j].voucher_amount,
    //                                 'order_number': records[i].Payment[j].order_number,
    //                                 'type': records[i].Payment[j].type,
    //                                 'state': records[i].Payment[j].state,
    //                             }
    //                         );
    //
    //                     }
    //
    //                     // }
    //                 }
    //                 // data[i].Payment.push(result)
    //             }
    //
    //             return res.status(200).send(data)
    //
    //
    //         })
    //         .catch(error => res.status(400).send(error));
    // },
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
    update: function (req, res) {
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
                        id_user: req.body.id_user,
                        id_unit_organic: req.body.id_unit_organic,
                        id_role: req.body.id_role,
                        id_mention: req.body.id_mention,
                        type: req.body.type,
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
                        .status(400)
                        .send({ message: message.RECORD_NOT_FOUND });
                return record
                    .destroy()
                    .then(() =>
                        res.status(200).send({ message: message.DELETED_OK })
                    )
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },
    //    ********************************************************

    async retrieveStudent(req, res) {
        try {
            let records = await Model.findOne({
                attributes: {
                    exclude: ["created_at", "updated_at", "deleted_at"],
                },
                where: { id: req.params.id_student },
                include: [
                    {
                        attributes: [
                            "id",
                            "document_number",
                            "email",
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
                        attributes: ["denomination"],
                        model: Programs,
                        as: "Program",
                        include: [
                            {
                                attributes: ["denomination"],
                                model: Academic_degree,
                                as: "Academic_degree",
                            },
                            {
                                attributes: ["denomination"],
                                model: Organic_unit,
                                as: "Organic_unit_origin",
                                include: {
                                    attributes: ["denomination"],
                                    model: Campus,
                                    as: "Campu",
                                },
                            },
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
                        ],
                    },
                ],
                order: [["created_at", "desc"]],
            });
            res.status(200).send(records);
        } catch (e) {
            res.status(444).send(e);
        }
    },
    async retrieveStudentCostAdmissionPlan(req, res) {
        try {
            let records = await Cost_admission_plan.findOne({
                where: { id_admission_plan: req.params.id_admission_plan },
                include: {
                    attributes: ["denomination"],
                    where: {
                        denomination: { [Op.like]: "%" + "Matrícula" + "%" },
                    },
                    model: Concept,
                    as: "Concept",
                },
            });
            res.status(200).send(records);
        } catch (e) {
            res.status(444).send(e);
        }
    },
    async listDocumentStudentByStudentID(req, res) {
        try {
            let records = await Student_document.findAll({
                attributes: {
                    exclude: ["created_at", "updated_at", "deleted_at"],
                },
                where: { id_student: req.params.id_student },
                include: {
                    required: true,

                    attributes: {
                        exclude: ["created_at", "updated_at", "deleted_at"],
                    },
                    model: Document,
                    as: "Document",
                    include: [
                        {
                            where: { denomination: "ACREDITACIÓN" },
                            attributes: ["denomination"],
                            model: Document_type,
                            as: "Document_type",
                        },
                        {
                            attributes: ["denomination"],
                            model: Organic_unit,
                            as: "Organic_unit",
                        },
                    ],
                },

                order: [["created_at", "desc"]],
            });
            res.status(200).send(records);
        } catch (e) {
            console.log(e);
            res.status(444).send(e);
        }
    },

    // MPT
    async changeStudentProgram(req, res) {
        try {
            await ST.transaction(async (t) => {
                let validStudent = await Model.findOne(
                    {
                        where: {
                            id_program: req.body.id_program,
                            id_person: req.body.id_person,
                        },
                    },
                    { transaction: t }
                );
                if (validStudent)
                    throw "Ya se ha registrado en este Programa de estudio";

                let person = await Person.findByPk(req.body.id_person);
                await person.update(
                    { student_state: true },
                    { transaction: t }
                );
                let maxStudent = await Student.max(
                    "id",
                    { paranoid: false },
                    { transaction: t }
                );
                // REGISTRAMOS EL NUEVO ESTUDIANTE
                let studentData = await Student.create(
                    {
                        id: maxStudent + 1,
                        id_person: req.body.id_person,
                        id_organic_unit: req.body.id_organic_unit,
                        id_plan: req.body.id_plan,
                        id_admission_plan: req.body.id_admission_plan,
                        id_cost_admission: req.body.id_cost_admission,
                        id_concept: req.body.id_concept,
                        id_program: req.body.id_program,
                        discount: req.body.discount,
                        type: "Estudiante",
                    },
                    { transaction: t }
                );

                // ESTUDIANTE PROGRAMA ANTERIOR
                let lastStudentProgram = await Student.findOne(
                    {
                        where: {
                            id_program: req.body.id_last_program,
                            id_person: req.body.id_person,
                        },
                    },
                    { transaction: t }
                );

                let lastProgram = await Programs.findByPk(
                    req.body.id_last_program
                );

                // -----------------------------------------------
                //  MOVIMIENTOS REGISTRADOS (PAGOS) PROGRAMA ANTERIOR
                let lastProgramMovements = await Movement.findAll({
                    where: {
                        id_program: lastStudentProgram.id_program,
                        id_student: lastStudentProgram.id,
                    },
                });

                // MONTO TOTAl MOVIMIENTOS REGISTRADOS
                let totalMovements = await lastProgramMovements.reduce(
                    (total, m) => total + parseFloat(m.voucher_amount),
                    0
                );

                // REGISTRAR MOVIEMIENTO RESUMEN
                let maxMovementId = await Movement.max(
                    "id",
                    { paranoid: false },
                    { transaction: t }
                );
                await Movement.create(
                    {
                        id: maxMovementId + 1,
                        id_student: studentData.id,
                        id_program: studentData.id_program,
                        id_organic_unit: studentData.id_organic_unit,
                        // id_user: "",
                        denomination: "Resumen Programa Anterior",
                        voucher_code: "",
                        voucher_amount: totalMovements,
                        voucher_date: moment().format("YYYY-MM-DD"),
                        voucher_url: "",
                        observation: "PAGOS PROGRAMA ANTERIOR",
                        type: "Transferencia",
                        state: "Regularizado",
                    },
                    { transaction: t }
                );
                // -----------------------------------------------
                // CONCEPTOS DE PAGO ESTUDIANTE PROGRAMA ANTERIOR
                let lastProgramPayments = await Payment.findAll({
                    where: {
                        id_program: lastStudentProgram.id_program,
                        id_student: lastStudentProgram.id,
                    },
                });

                // CONCEPTOS CON ESTADO PAGADO
                let paidPayments = await lastProgramPayments.filter(
                    (p) => p.type == "Pagado"
                );

                // MONTO TOTAL CONCEPTOS PAGADOS
                let totalPaidPayments = await paidPayments.reduce(
                    (total, p) => total + parseFloat(p.amount),
                    0
                );

                //CREATE PAYMENT DE RESUMEN DE CONCEPTOS ANTERIORES
                let maxPayment = await Payment.max(
                    "id",
                    { paranoid: false },
                    { transaction: t }
                );
                await Payment.create(
                    {
                        id: maxPayment + 1,
                        id_student: studentData.id,
                        id_organic_unit: studentData.id_organic_unit,
                        id_program: studentData.id_program,
                        id_cost_admission: studentData.id_cost_admission,
                        id_concept: 127,
                        id_semester: req.body.id_semester,
                        amount: totalPaidPayments,
                        // payment_date: moment().format("YYYY-MM-DD"),
                        payment_date: "",
                        denomination: lastProgram.abbreviation,
                        order_number: 1,
                        generate: 0, //0 por que no se genera documentos con este concepto
                        type: "Pagado",
                    },
                    { transaction: t }
                );

                // CREATE PAYMENT PAGO POR CAMBIO DE ESPECIALIDAD
                let conceptTraslado = await Concept.findByPk(126);
                let uit = await Uit.findOne({ where: { state: true } });
                let amountTraslado = Math.round(
                    (uit.amount * conceptTraslado.percent) / 100
                );
                await Payment.create(
                    {
                        id: maxPayment + 2,
                        id_student: studentData.id,
                        id_organic_unit: studentData.id_organic_unit,
                        id_program: studentData.id_program,
                        id_cost_admission: studentData.id_cost_admission,
                        id_concept: 126,
                        id_semester: req.body.id_semester,
                        amount: amountTraslado,
                        payment_date: moment().format("YYYY-MM-DD"),
                        denomination: "Traslado USE",
                        order_number: 2,
                        generate: 0, //0 por que no se genera documentos con este concepto
                        type: "Pendiente",
                    },
                    { transaction: t }
                );

                // -------------------------------------------------------
                // NUEVOS CONCEPTOS DE PAGO PROGRAMA ACTUAL - PENDIENTES

                // COSTO DE PENSION PROGRAMA ACTUAL
                // let pensionCost = await Cost_admission_plan.findOne(
                //     {
                //         where: {
                //             id_admission_plan: studentData.id_admission_plan,
                //         },
                //         include: {
                //             attributes: ["denomination"],
                //             where: {
                //                 denomination: {
                //                     [Op.like]: "%" + "Pensión " + "%",
                //                 },
                //             },
                //             model: Concept,
                //             as: "Concept",
                //         },
                //     },
                //     { transaction: t }
                // );

                // PAYMENTS CON ESTADO PENDIENTE DEL PROGRAMA ANTERIOR
                // let pendingPayments = await lastProgramPayments.filter(
                //     (p) => p.type == "Pendiente"
                // );

                // --------------------------------------------------------
                // NUEVOS PAYMENTS CON ESTADO PENDIENTE DEL PROGRAMA ACTUAL
                for (const lpp of lastProgramPayments) {
                    // REGISTRARÁ DEPENDIENDO DE LA DENOMINATION
                    if (lpp.denomination === "Matrícula") {
                        let maxRegistration = await Registration.max(
                            "id",
                            { paranoid: false },
                            { transaction: t }
                        );
                        let registration = await Registration.create(
                            {
                                id: maxRegistration + 1,
                                id_semester: req.body.id_semester,
                                id_student: studentData.id,
                                type: "Regular",
                                id_program: studentData.id_program,
                                id_organic_unit: studentData.id_organic_unit,
                                // observation: null,
                                state: "Pendiente",
                            },
                            { transaction: t }
                        );
                        // CODIGO RESPECTO A LA MATRICULA Y SU PAGO
                        // ---------------------------------------------
                        if (lpp.type == "Pagado") {
                            // SI LA MATRICULA YA HA SIDO PAGADA ENTONCES YA NO SE CREA EL PAYMENT
                            await Registration.update(
                                {
                                    state: "Pagado",
                                },
                                {
                                    where: {
                                        id: registration.id,
                                    },
                                    transaction: t,
                                }
                            );
                        } else {
                            // CONSULTAMOS COSTO DE MATRICULA
                            let registrationCost =
                                await Cost_admission_plan.findOne(
                                    {
                                        where: {
                                            id_admission_plan:
                                                studentData.id_admission_plan,
                                        },
                                        include: {
                                            attributes: ["denomination"],
                                            where: {
                                                denomination: {
                                                    [Op.like]:
                                                        "%" +
                                                        "Matrícula " +
                                                        "%",
                                                },
                                            },
                                            model: Concept,
                                            as: "Concept",
                                        },
                                    },
                                    { transaction: t }
                                );

                            // SI LA MATRICULA NO HA SIDO PAGADA ENTONCES SE CREA UN PAYMENT
                            let maxPaymentCp = await Payment.max(
                                "id",
                                { paranoid: false },
                                { transaction: t }
                            );
                            await Payment.create(
                                {
                                    id: maxPaymentCp + 1,
                                    id_student: studentData.id,
                                    id_organic_unit:
                                        studentData.id_organic_unit,
                                    id_program: studentData.id_program,
                                    id_concept: lpp.id_concept,
                                    id_semester: req.body.id_semester,
                                    id_registration: registration.id,
                                    amount: registrationCost,
                                    denomination: "Matrícula",
                                    generate: 0, //0 por que no se genera documentos con este concepto
                                    type: "Pendiente",
                                },
                                { transaction: t }
                            );
                        }

                        // CODIGO RESPECTO A LA MATRICULA Y LOS CURSOS
                        // ----------------------------------------------
                        let getPlan = await Plan.findOne(
                            {
                                where: {
                                    id_program: studentData.id_program,
                                    state: "t",
                                },
                            },
                            { transaction: t }
                        );
                        let getCiclo = await Ciclo.findOne(
                            {
                                where: {
                                    ciclo: "I",
                                    state: "t",
                                    id_plan: getPlan.id,
                                },
                            },
                            { transaction: t }
                        );

                        // let listCourses = await Course.findAll(
                        //     {
                        //         where: {
                        //             id_ciclo: getCiclo.id,
                        //             state: "t",
                        //         },
                        //     },
                        //     { transaction: t }
                        // );

                        let ciclo = await Schedule.findAll(
                            {
                                where: {
                                    id_process: req.body.id_semester,
                                    type_registration: "R",
                                },
                                include: [
                                    {
                                        where: { id_ciclo: getCiclo.id },
                                        required: true,
                                        model: Course,
                                        as: "Course",
                                        // include: {
                                        //     required: true,
                                        //     where: { id_plan: req.body.id_plan },
                                        //     attributes: ["id", "ciclo", "period"],
                                        //     model: Ciclo,
                                        //     as: "Ciclo",
                                        // },
                                    },
                                ],
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

                        let listCourses = [];
                        ciclo.map((r) =>
                            listCourses.push({
                                id: r.id_course,
                                id_schedule: r.id,
                                // ciclo: r.Course.Ciclo.ciclo,
                                // abbreviation: r.Course.abbreviation,
                                // area: r.Course.area,
                                // code: r.Course.code,
                                // order: r.Course.order,
                                // credits: r.Course.credits,
                                // practical_hours: r.Course.practical_hours,
                                // hours: r.Course.hours,
                                // requirements: JSON.parse(r.Course.requirements),
                                // type: r.Course.type,
                                // note: 0,
                                // note_state: false,
                                // denomination: r.Course.denomination,
                                // state: false,
                                // group: r.group_class,
                                // teachers:
                                //     r.Teachers.length > 0 ? r.Teachers : [],
                            })
                        );

                        for (let i = 0; i < listCourses.length; i++) {
                            let maxRegistrationCourseID =
                                await Registration_course.max(
                                    "id",
                                    { paranoid: false },
                                    { transaction: t }
                                );
                            await Registration_course.create(
                                {
                                    id: maxRegistrationCourseID + 1 + i,
                                    id_registration: registration.id,
                                    id_schedule: listCourses[i].id_schedule,
                                    id_course: listCourses[i].id,
                                    type_course: "R",
                                    note: 0,
                                    state: "Desaprobado",
                                },
                                { transaction: t }
                            );
                        }

                        // let maxPay = await Payment.max(
                        //     "id",
                        //     { paranoid: false },
                        //     { transaction: t }
                        // );
                        // await Payment.create(
                        //     {
                        //         id: maxPay + 1,
                        //         id_student: studentData.id,
                        //         id_organic_unit: studentData.id_organic_unit,
                        //         id_program: studentData.id_program,
                        //         id_cost_admission: studentData.id_cost_admission,
                        //         id_concept: p.id_concept,
                        //         id_semester: req.body.id_semester,
                        //         amount: totalPaidPayments,
                        //         // payment_date: moment().format("YYYY-MM-DD"),
                        //         payment_date: "",
                        //         denomination: lastProgram.abbreviation,
                        //         order_number: 1,
                        //         generate: 0, //0 por que no se genera documentos con este concepto
                        //         type: "Pagado",
                        //     },
                        //     { transaction: t }
                        // );
                    }
                }
            });
            // console.log(lastProgramPayments);
            res.status(200).send({ message: message.REGISTERED_OK });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    // MPT END

    async createStudentProgram(req, res) {
        let voucherArchive = "";
        let tmp_path_q;

        if (req.files.voucher_file) {
            try {
                voucherArchive =
                    req.body.document_number +
                    "." +
                    req.files.voucher_file.name.split(".").pop();
                tmp_path_q = req.files.voucher_file.path;
                let target_path_q = url_person_voucher + voucherArchive;
                await fs.rename(tmp_path_q, target_path_q);
            } catch (e) {
                await fs.unlink(tmp_path_q);
                res.status(444).send(e);
            }
        }
        try {
            await ST.transaction(async (t) => {
                let validStudent = await Model.findOne(
                    {
                        where: {
                            id_program: req.body.id_program,
                            id_person: req.body.id_person,
                        },
                    },
                    { transaction: t }
                );
                if (validStudent)
                    throw "Ya se ha registrado en este Programa de  estudio";

                let person = await Person.findByPk(req.body.id_person);
                await person.update(
                    { student_state: true },
                    { transaction: t }
                );
                let maxStudent = await Student.max(
                    "id",
                    { paranoid: false },
                    { transaction: t }
                );
                const studentData = await Student.create(
                    {
                        id: maxStudent + 1,
                        id_person: req.body.id_person,
                        id_organic_unit: req.body.id_organic_unit,
                        id_plan: req.body.id_plan,
                        id_admission_plan: req.body.id_admission_plan,
                        id_cost_admission: req.body.id_cost_admission,
                        id_concept: req.body.id_concept,
                        id_program: req.body.id_program,
                        discount: req.body.discount,
                        type: "Estudiante",
                    },
                    { transaction: t }
                );

                //CREATE PAYMENT****************************************************
                let costAdmissionPlan = await Cost_admission_plan.findByPk(
                    req.body.id_cost_admission
                );
                let maxPayment = await Payment.max(
                    "id",
                    { paranoid: false },
                    { transaction: t }
                );
                await Payment.create(
                    {
                        id: maxPayment + 1,
                        id_student: studentData.id,
                        id_organic_unit: req.body.id_organic_unit,
                        id_program: req.body.id_program,
                        id_cost_admission: costAdmissionPlan.id,
                        id_concept: req.body.id_concept,
                        id_semester: req.body.id_process,
                        amount: costAdmissionPlan.amount,
                        payment_date: req.body.payment_date,
                        denomination: "Inscripción",
                        order_number: 1,
                        generate: 0, //0 por que no se genera documentos con este concepto
                        type: "Pendiente",
                    },
                    { transaction: t }
                );

                // LIMITE DE CODIGO PARA USE (ABAJ0 YA NO PERTENECE)

                //CREATE REQUERIMENT****************************************************
                /////GRADO ACADEMICO PARA OBTENER LA LISTA DE REQUISITOS.
                let programData = await Programs.findByPk(req.body.id_program, {
                    transaction: t,
                });
                /////LISTAMOS LOS REQUISITOS
                let requerimets = await Requeriment.findAll(
                    {
                        where: {
                            id_academic_degree: programData.id_academic_degree,
                            id_concept: req.body.id_concept,
                        },
                    },
                    { transaction: t }
                );

                for (let i = 0; i < requerimets.length; i++) {
                    let maxRequeriment = await Requeriment_delivered.max(
                        "id",
                        { paranoid: false },
                        { transaction: t }
                    );
                    await Requeriment_delivered.create(
                        {
                            id: maxRequeriment + i + 1,
                            id_student: studentData.id,
                            id_requeriment: requerimets[i].id,
                            state: false,
                        },
                        { transaction: t }
                    );
                }
            });
            res.status(200).send({ message: message.REGISTERED_OK });
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    async updateStudentProgram(req, res) {
        let voucherArchive = "";
        let paymentData;
        let tmp_path_q;

        if (req.files.voucher_file) {
            try {
                voucherArchive =
                    req.body.document_number +
                    "." +
                    req.files.voucher_file.name.split(".").pop();
                tmp_path_q = req.files.voucher_file.path;
                let target_path_q = url_person_voucher + voucherArchive;
                await fs.rename(tmp_path_q, target_path_q);
            } catch (e) {
                await fs.unlink(tmp_path_q);
                res.status(444).send(e);
            }
        }
        try {
            await ST.transaction(async (t) => {
                const studentData = await Model.findByPk(req.params.id);
                await studentData.update(
                    {
                        id_cost_admission: req.body.id_cost_admission,
                        id_concept: req.body.id_concept,
                        discount: req.body.discount,
                    },
                    { transaction: t }
                );
                let costAdmissionPlan = await Cost_admission_plan.findByPk(
                    req.body.id_cost_admission
                );
                paymentData = await Payment.findOne({
                    where: {
                        id_student: req.params.id,
                        denomination: "Inscripción",
                    },
                });
                await paymentData.update(
                    {
                        id_cost_admission: req.body.id_cost_admission,
                        id_concept: req.body.id_concept,
                        id_semester: req.body.id_process,
                        order_number: 1,
                        amount: costAdmissionPlan.amount,
                        denomination: "Inscripción",
                    },
                    { transaction: t }
                );
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
    async updateStateStudentProgram(req, res) {
        try {
            await ST.transaction(async (t) => {
                const studentData = await Model.findByPk(req.params.id);
                await studentData.update(
                    {
                        type: req.body.type,
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
    async updateObservationStudent(req, res) {
        try {
            await ST.transaction(async (t) => {
                const studentData = await Model.findByPk(req.params.id);
                await studentData.update(
                    {
                        observation: req.body.observation,
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
    async destroyStudent(req, res) {
        try {
            await ST.transaction(async (t) => {
                await Model.destroy(
                    { where: { id: req.params.id } },
                    { transaction: t }
                );

                // const tempStudentState = await Student_state.findAll({where: {id_student: req.params.id}}, {transaction: t})
                const tempRequirementDeliverd =
                    await Requeriment_delivered.findAll(
                        { where: { id_student: req.params.id } },
                        { transaction: t }
                    );
                const tempStudentDiscount = await Student_discount.findAll(
                    { where: { id_student: req.params.id } },
                    { transaction: t }
                );
                const tempPayment = await Payment.findAll(
                    { where: { id_student: req.params.id } },
                    { transaction: t }
                );
                const tempMovement = await Movement.findAll(
                    { where: { id_student: req.params.id } },
                    { transaction: t }
                );
                const tempRegistration = await Registration.findAll(
                    { where: { id_student: req.params.id } },
                    { transaction: t }
                );

                let array = [];

                // for (let i = 0; i < tempStudentState.length; i++) {
                //     let temp = await tempStudentState[i].destroy({transaction: t});
                //     array.push(temp)
                // }

                for (let i = 0; i < tempRequirementDeliverd.length; i++) {
                    let temp = await tempRequirementDeliverd[i].destroy({
                        transaction: t,
                    });
                    array.push(temp);
                }
                for (let i = 0; i < tempStudentDiscount.length; i++) {
                    let temp = await tempStudentDiscount[i].destroy({
                        transaction: t,
                    });
                    array.push(temp);
                }
                for (let i = 0; i < tempPayment.length; i++) {
                    let temp = await tempPayment[i].destroy({ transaction: t });
                    array.push(temp);
                }
                for (let i = 0; i < tempMovement.length; i++) {
                    let temp = await tempMovement[i].destroy({
                        transaction: t,
                    });
                    array.push(temp);
                }
                for (let i = 0; i < tempRegistration.length; i++) {
                    let temp = await tempRegistration[i].destroy({
                        transaction: t,
                    });
                    let tempRegistrationCourse =
                        await Registration_course.findAll(
                            {
                                where: {
                                    id_registration: tempRegistration[i].id,
                                },
                            },
                            { transaction: t }
                        );
                    for (let j = 0; j < tempRegistrationCourse.length; j++) {
                        let tempDos = await tempRegistrationCourse[j].destroy({
                            transaction: t,
                        });
                        array.push(tempDos);
                    }
                    array.push(temp);
                }

                await Promise.all(array);
            });

            res.status(200).send(message.DELETED_OK);
        } catch (err) {
            console.log(err);
            res.status(445).send({
                message: message.ERROR_TRANSACTION,
                error: err,
            });
        }
    },
    listStudentAdmissionProgram: async (req, res) => {
        try {
            let records = await Student.findAll({
                attributes: {
                    exclude: ["created_at", "updated_at", "deleted_at"],
                },
                where: {
                    id_admission_plan: req.params.id_admission_plan,
                },
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
                        attributes: ["id"],
                        model: Cost_admission_plan,
                        as: "Cost_admission_plan",
                        include: {
                            attributes: ["denomination"],
                            model: Concept,
                            as: "Concept",
                        },
                    },
                ],
            });

            res.status(200).send(records);
        } catch (e) {
            console.log(e);
            res.status(444).send(e);
        }
    },
    listStudentAdmissionProgramWithRegistration: async (req, res) => {
        try {
            let records = await Student.findAll({
                attributes: {
                    exclude: ["created_at", "updated_at", "deleted_at"],
                },
                where: {
                    id_admission_plan: req.params.id_admission_plan,
                },
                include: [
                    {
                        required: true,
                        attributes: [
                            "id",
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
                        required: true,
                        attributes: ["id", "type", "state"],
                        model: Registration,
                        as: "Registration",
                        include: {
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

            res.status(200).send(records);
        } catch (e) {
            console.log(e);
            res.status(444).send(e);
        }
    },
};
