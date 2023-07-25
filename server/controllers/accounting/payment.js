const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const fs = require('fs');
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const Model = require('../../models').Payment;
const Concept = require('../../models').Concept;
const Registration = require('../../models').Registration;
const Student = require('../../models').Student;
const Academic_semester = require('../../models').Academic_semester;
const Academic_calendar = require('../../models').Academic_calendar;
const Movement = require('../../models').Movement;

const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);

const ST = Model.sequelize;

module.exports = {
    listPaymentStudent: async (req, res) => {
        try {
            let records;
            await ST.transaction(async (t) => {
                    records = await Model.findAll({
                        where: {id_student: req.params.id},
                        include: [
                            {
                                model: Concept,
                                as: "Concept"
                            },
                            {
                                model: Academic_semester,
                                as: "Academic_semester",
                                include: {
                                    model: Academic_calendar,
                                    as: "Academic_calendar",

                                }
                            }
                        ],
                        order: [['created_at', 'asc']],
                    }, {transaction: true})
                }
            );
            res.status(200).send(records);
        } catch (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },
    listPaymentStudentOperation: async (req, res) => {
        try {
            let records;
            await ST.transaction(async (t) => {
                    records = await Model.findAll({
                        where: {id_student: req.params.id},
                        include: [
                            {
                                model: Concept,
                                as: "Concept"
                            },
                            {
                                model: Academic_semester,
                                as: "Academic_semester",
                                include: {
                                    model: Academic_calendar,
                                    as: "Academic_calendar",

                                }
                            }
                        ],
                        order: [['created_at', 'asc']],
                    }, {transaction: true})
                }
            );
            res.status(200).send(records);
        } catch (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },
    listPaymentRetirementByStudent: async (req, res) => {
        try {
            let records;
            await ST.transaction(async (t) => {
                    records = await Model.findOne({
                        attributes: ['id', 'denomination', 'type', 'state'],
                        where: {id_student: req.params.id, state: false, id_concept: 6},
                        include: [
                            {
                                attributes: ['denomination'],
                                model: Concept,
                                as: "Concept"
                            }

                        ],
                        order: [['created_at', 'asc']],
                    }, {transaction: true})
                }
            );
            res.status(200).send(records);
        } catch (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },
    updateStatePayment: async (req, res) => {
        try {
            let movements = [];
            await ST.transaction(async (t) => {
                let concepts = JSON.parse(req.body.concepts)
                let sizeConcepts = concepts.length;
                let arrayTemRegistration = [];
                for (let i = 0; i < concepts.length; i++) {

                    let movementTemp = await Model.findByPk(concepts[i].id)
                    let movementTempData = await movementTemp.update({type: concepts[i].type}, {transaction: t});
                    movements.push(movementTempData);
                    if (movementTemp.denomination === 'Matrícula' && concepts[i].type === 'Pagado') {
                        arrayTemRegistration.push({id: movementTemp.id_registration, state: 'Pagado'})
                    }
                    if (movementTemp.denomination === 'Matrícula' && concepts[i].type === 'Pendiente') {
                        arrayTemRegistration.push({id: movementTemp.id_registration, state: 'Pendiente'})
                    }
                }
                await Promise.all(movements);
                let tempRegistrationPromise = [];
                for (let j = 0; j < arrayTemRegistration.length; j++) {

                    let registration = await Registration.findByPk(arrayTemRegistration[j].id);
                    let registrationData = await registration.update({state: arrayTemRegistration[j].state}, {transaction: t});
                    tempRegistrationPromise.push(registrationData);
                }
                await Promise.all(tempRegistrationPromise);
            });
            res.status(200).send(message.UPDATED_OK)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }

    },
    listTotalBalance: async (req, res) => {
        try {
            let movements = [];
            let concepts = [];
            let totalConcept = 0;
            let totalMovement = 0;
            await ST.transaction(async (t) => {

                concepts = await Model.findAll({where: {id_student: req.body.id_student, type: 'Pagado'}});
                movements = await Movement.findAll({
                    where: {
                        id_student: req.body.id_student,
                        state: {[Op.or]: ['Aceptado', 'Regularizado']}
                    }
                });

                concepts.map(item => {
                    totalConcept = parseFloat(item.amount) + totalConcept
                });
                movements.map(item => {
                    totalMovement = parseFloat(item.voucher_amount) + totalMovement
                });


            });
            res.status(200).send({totalMovement: totalMovement, totalConcept: totalConcept})
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }

    },
    createPayment: async (req, res) => {


        try {


            await ST.transaction(async (t) => {

                let concept = await Concept.findByPk(req.body.id_concept);
                let student = await Student.findByPk(req.body.id_student);
                let maxPaymnetID = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: maxPaymnetID + 1,
                    id_student: req.body.id_student,
                    id_program: student.id_program,
                    id_organic_unit: student.id_organic_unit,
                    id_semester: req.body.id_process,
                    id_concept: req.body.id_concept,
                    denomination: concept.denomination,
                    amount: req.body.amount,
                    type: 'Pendiente',
                    generate: concept.generate ? 1 : 0,
                    state: false
                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (err) {

            console.log(err);
            res.status(445).send(err)
        }

    },
    updatePayment: async (req, res) => {


        try {


            await ST.transaction(async (t) => {

                let concept = await Concept.findByPk(req.body.id_concept);
                let payment = await Model.findByPk(req.params.id_payment);

                await payment.update({


                    id_semester: req.body.id_process,
                    id_concept: req.body.id_concept,
                    denomination: concept.denomination,
                    amount: req.body.amount,
                    generate: concept.generate ? 1 : 0

                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (err) {

            console.log(err);
            res.status(445).send(err)
        }

    },
    destroyPayment: async (req, res) => {
        try {

            await ST.transaction(async (t) => {


                let paymentTemp = await Model.findByPk(req.params.id)
                await paymentTemp.destroy();
            });

            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
