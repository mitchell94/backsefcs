const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const fs = require('fs').promises;
const Model = require('../../models').Postulant;
const Programs = require('../../models').Programs;
const Plan = require('../../models').Plan;
const Concept = require('../../models').Concept;
const User = require('../../models').User;
const Organic_unit = require('../../models').Organic_unit;
const Cost = require('../../models').Cost;
const Person = require('../../models').Person;
const Student = require('../../models').Student;
const Academic_semester = require('../../models').Academic_semester;
const Academic_calendar = require('../../models').Academic_calendar;
const Payment = require('../../models').Payment;
const Amortization = require('../../models').Amortization;
const Movement = require('../../models').Movement;
const Cost_admission_plan = require('../../models').Cost_admission_plan;
const abox = require('../Abox');
const moment = require('moment');
const URL_PLUBLIC = require("../Abox").URL_PLUBLIC;
const url_documents = URL_PLUBLIC + 'postulantVoucher/';
const ST = Model.sequelize;
const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
const uuid = require('uuid');

module.exports = {
    async createPostulant(req, res) {
        try {
            await ST.transaction(async (t) => {
                let dni = await Model.findOne({
                    attributes: ['id', 'document_number', 'id_organic_unit'],
                    where: {document_number: req.body.document_number, id_organic_unit: req.body.id_organic_unit}
                }, {transaction: t});
                if (dni) throw "Ya se ha inscrito en este programa por favor, verifique su correo electronico";
                let code = await abox.generateCode(5);
                let program = await Programs.findOne({
                    attributes: ['id', 'denomination'],
                    where: {
                        id: req.body.id_program
                    },
                    include: {
                        attributes: ['denomination'],
                        model: Organic_unit,
                        as: "Organic_unit_origin"
                    }
                }, {transaction: true});

                let costAdmissionPlan = await Cost_admission_plan.findOne({
                    attributes: ['id', 'amount', 'id_concept'],
                    where: {
                        id: req.body.id_cost_admission_plan,
                        state: true
                    },
                }, {transaction: true});

                let concept = await Concept.findOne({
                    attributes: ['denomination'],
                    where: {
                        id: costAdmissionPlan.id_concept
                    },
                }, {transaction: true});
                let out = await abox.templateInscription(
                    req.body.name,
                    concept.denomination,
                    costAdmissionPlan.amount,
                    program.denomination,
                    program.id,
                    program.Organic_unit_origin.denomination,
                    code
                );
                const mailOptions = {
                    from: 'soporte@unsm.edu.pe',
                    to: req.body.email,
                    subject: 'SEUNSM: Codigo de acceso al registro del recibo de pago ',
                    html: out
                };
                let sendMail = await abox.wrapedSendMail(mailOptions);
                if (sendMail) {
                    let max = await Model.max('id', {paranoid: false}, {transaction: t});
                    await Model.create({
                        id: max + 1,
                        id_process: req.body.id_process,
                        id_organic_unit: req.body.id_organic_unit,
                        id_program: req.body.id_program,
                        id_admission_plan: req.body.id_admission_plan,
                        id_cost_admission_plan: req.body.id_cost_admission_plan,
                        id_plan: req.body.id_plan,
                        id_cost: req.body.id_cost,///esto es el id de la tabla costo
                        code_cost: req.body.code_cost,
                        code: code[0],
                        document_number: req.body.document_number,
                        name: req.body.name,
                        phone: req.body.phone,
                        email: req.body.email,
                        send_mail: true,
                        state: true
                    }, {transaction: t});

                } else {
                    throw "No se puede enviar a ese correo";
                }

            });
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (e) {
            console.log(e);
            res.status(444).send({error: e, message: e})

        }
    },
    async createVoucher(req, res) {
        let archive;
        let tmp_path;
        if (req.files.file) {
            try {

                archive = req.body.voucher_code + '.' + req.files.file.name.split('.').pop();
                tmp_path = req.files.file.path;
                let target_path = url_documents + archive;
                await fs.rename(tmp_path, target_path);

            } catch (e) {
                await fs.unlink(tmp_path);
                res.status(444).send(e)
            }

        }

        try {
            await ST.transaction(async (t) => {

                let record = await Model.findByPk(req.params.id);
                if (!record) throw message.RECORD_NOT_FOUND;

                await record.update({
                    voucher_code: req.body.voucher_code,
                    voucher_date: req.body.voucher_date,
                    voucher_amount: req.body.voucher_amount,
                    voucher_url: archive,
                    voucher_state: "Registrado"
                }, {transaction: t});


            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (e) {
            console.log(e);
            res.status(444).send(e)
        }
    },

    async listPaymentByCode(req, res) {
        try {
            const records = await Model.findOne({
                attributes: ['id', "code", "document_number", "name", "phone", "email", "send_mail", "description", "voucher_code", "voucher_amount", "voucher_date", "voucher_url", "voucher_state", "observation", "state"],
                where: {code: req.params.code},
                include: [
                    {
                        attributes: ['amount'],
                        model: Cost_admission_plan,
                        as: "Cost_admission_plans",
                        include: {
                            attributes: ['denomination'],
                            model: Concept,
                            as: "Concept"
                        }
                    },
                    {
                        attributes: ['id', 'denomination'],
                        model: Programs,
                        as: "Programs",
                        include: {
                            attributes: ['denomination'],
                            model: Organic_unit,
                            as: "Organic_unit_origin"
                        },
                    }
                ]
            });

            res.status(200).send(records)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async listPaymentPostulantGOD(req, res) {
        try {
            const record = await Model.findAll({
                    // attributes: ['id', "code", "document_number", "name", "phone", "email", "send_mail", "description", "voucher_code", "voucher_amount", "voucher_date", "voucher_url", "voucher_state", "observation", "state"],
                    // where: {
                    //     [Op.or]: [
                    //         {voucher_state: {[Op.eq]: "Nulo"}},
                    //         {voucher_state: {[Op.eq]: "Anulado"}},
                    //     ],
                    // },
                    include: [
                        {
                            attributes: ['denomination'],
                            model: Academic_semester,
                            as: "Academic_semester",
                            include: {
                                attributes: ['denomination'],
                                model: Academic_calendar,
                                as: "AC"
                            }
                        },
                        {
                            attributes: ['amount'],
                            model: Cost_admission_plan,
                            as: "Cost_admission_plans",
                            include: {
                                attributes: ['denomination'],
                                model: Concept,
                                as: "Concept"
                            }
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Programs,
                            as: "Programs",
                            include: {
                                attributes: ['denomination'],
                                model: Organic_unit,
                                as: "Organic_unit_origin"
                            },
                        }
                    ]
                })
            ;
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async listPaymentPostulant(req, res) {
        try {
            const record = await Model.findAll({
                    // attributes: ['id', "code", "document_number", "name", "phone", "email", "send_mail", "description", "voucher_code", "voucher_amount", "voucher_date", "voucher_url", "voucher_state", "observation", "state"],
                    // where: {
                    //     [Op.or]: [
                    //         {voucher_state: {[Op.eq]: "Nulo"}},
                    //         {voucher_state: {[Op.eq]: "Anulado"}},
                    //     ],
                    // },
                    where: {id_organic_unit: req.params.id},
                    include: [
                        {
                            attributes: ['denomination'],
                            model: Academic_semester,
                            as: "Academic_semester",
                            include: {
                                attributes: ['denomination'],
                                model: Academic_calendar,
                                as: "AC"
                            }
                        },
                        {
                            attributes: ['amount'],
                            model: Entry,
                            as: "Entrys",
                            include: {
                                attributes: ['denomination'],
                                model: Concept,
                                as: "Concept"
                            }
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Programs,
                            as: "Programs",
                            include: {
                                attributes: ['denomination'],
                                model: Organic_unit,
                                as: "Organic_unit_origin"
                            },
                        }
                    ]
                })
            ;
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async validPostulantByID(req, res) {
        try {


            let id = JSON.parse(crypt.decrypt(req.params.id, k, v));
            let postulant = await Model.findByPk(id);
            if (!postulant) throw message.RECORD_NOT_FOUND;
            let pass = await abox.generateCode(4);
            let out = await abox.templateValidPayment(postulant.name, postulant.document_number, pass);
            pass = crypt.encrypt(pass[0], k, v);

            const mailOptions = {
                from: 'soporte@unsm.edu.pe',
                to: postulant.email,
                subject: 'SEUNSM: Su pago ha sido validado',
                html: out
            };
            await ST.transaction(async (t) => {
                await postulant.update({voucher_state: "Aceptado"}, {transaction: t});
                let personMax = await Person.max('id', {paranoid: false}, {transaction: t});
                let personData = await Person.create({
                    id: personMax + 1,
                    email: postulant.email,
                    document_number: postulant.document_number,
                    name: postulant.name,
                    cell_phone: postulant.cell_phone
                }, {transaction: t});
                let userData = await User.create({
                    id: uuid(),
                    id_person: personData.id,
                    user: postulant.document_number,
                    pass: pass,
                    god: false,
                }, {transaction: t});
                let studentData = await Student.create({
                    id_person: personData.id,
                    id_process: postulant.id_process,
                    id_organic_unit: postulant.id_organic_unit,
                    id_plan: postulant.id_plan,
                    id_admission_plan: postulant.id_admission_plan,
                    type: "Postulante",
                }, {transaction: t});

                let costAdmissionPlan = await Cost_admission_plan.findOne({
                    attributes: ['id', 'amount', 'id_concept'],
                    where: {id: postulant.id_cost_admission_plan},
                }, {transaction: true});
                let concept = await Concept.findOne({
                    attributes: ['denomination', 'type'],
                    where: {id: costAdmissionPlan.id_concept},
                }, {transaction: true});

                let paymentMax = await Payment.max('id', {paranoid: false}, {transaction: t});
                let paymentData = await Payment.create({
                    id: paymentMax + 1,
                    id_student: studentData.id,
                    id_concept: postulant.id_cost_admission_plan,
                    payment_date: postulant.voucher_date,
                    order_number: 1,
                    denomination:'Inscripción',
                    amount: postulant.voucher_amount,
                    generate: 0,//0 por que no se genera documentos con este concepto
                    type: "Aceptado",
                    state: true
                }, {transaction: t});

                let movenmentMax = await Payment.max('id', {paranoid: false}, {transaction: t});
                let movementData = await Movement.create({
                    id: movenmentMax + 1,
                    id_student: studentData.id,
                    // id_user: "",
                    id_box: 1,
                    id_cost_admission_plan: postulant.id_cost_admission_plan,
                    id_concept: postulant.id_admission_plan,
                    denomination: concept.denomination,
                    voucher_code: postulant.voucher_code,
                    voucher_amount: postulant.voucher_amount,
                    voucher_date: postulant.voucher_date,
                    voucher_url: postulant.voucher_url,
                    observation: postulant.observation,
                    type: "Aceptado",
                    state: true,
                }, {transaction: t});
                let amortizationMax = await Amortization.max('id', {paranoid: false}, {transaction: t});
                await Amortization.create({
                    id: amortizationMax + 1,
                    id_payment: paymentData.id,
                    id_movement: movementData.id,
                    amount: postulant.voucher_amount,
                    id_work_plan: postulant.id_work_plan,
                    id_admission_plan: postulant.id_admission_plan,
                    type: "Aceptado",
                    observation: postulant.observation,
                    state: true,
                }, {transaction: t});

            });
            let sendMail = await abox.wrapedSendMail(mailOptions);
            if (!sendMail) throw "No se puede enviar a ese correo";
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
