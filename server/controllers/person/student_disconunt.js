const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Student_discount;
const Discount = require('../../models').Discount;
const Payment = require('../../models').Payment;
const Concept = require('../../models').Concept;
const Cost_admission_plan = require('../../models').Cost_admission_plan;
const ST = Model.sequelize;
module.exports = {

    createStudentDiscount: async (req, res) => {

        let totalDiscount = req.body.amount ? parseFloat(req.body.amount) : 0,
            pensionCost = '',
            discounts = [],
            forPromises = [],
            totalPensions = [];
        try {

            await ST.transaction(async (t) => {
                //OBTENEMOS EL TOTAL DE DESCUENTOS DEL ESTUDIANTE
                discounts = await Model.findAll({
                    where: {id_student: req.body.id_student},
                    include: {
                        attributes: ['id', 'amount'],
                        model: Discount,
                        as: 'Discount'
                    }

                }, {transaction: t})

                discounts.map(r => (totalDiscount = totalDiscount + parseFloat(r.Discount.amount)));

                //REGISTRA LOS CONCEPTOS DE DESCUENTO
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    id_student: req.body.id_student,
                    id_discount: req.body.id_discount,
                    observation: req.body.observation
                }, {transaction: t});
                //OBTENEMOS EL MONTO DE LA PENSIÓN
                pensionCost = await Cost_admission_plan.findOne({
                    where: {id_admission_plan: req.body.id_admission_plan},
                    include: {
                        attributes: ['denomination'],
                        where: {denomination: {[Op.like]: '%' + "Pensión " + '%'}},
                        model: Concept,
                        as: "Concept"
                    }
                }, {transaction: t});

                totalDiscount = pensionCost.amount - pensionCost.amount * totalDiscount / 100;

                totalPensions = await Payment.findAll({
                    where: {id_student: req.body.id_student, denomination: 'Pensión'}
                }, {transaction: t});

                if (totalPensions.length > 0) {
                    for (let i = 0; i < totalPensions.length; i++) {
                        let temp = await totalPensions[i].update({
                            amount: totalDiscount
                        }, {transaction: t})
                        forPromises.push(temp);
                    }
                    await Promise.all(forPromises);
                }

            });
            res.status(200).send({message: message.REGISTERED_OK})

        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    listStudentDiscount: async (req, res) => {
        try {
            let records = await Model.findAll(
                {
                    attributes: ['id', 'amount'],
                    where: {id_student: req.params.id_student},
                    include: {
                        attributes: ['id', 'amount', 'description'],
                        model: Discount,
                        as: 'Discount'
                    }
                });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    destroyStudentDiscount: async (req, res) => {
        let totalDiscount = 0,
            pensionCost = '',
            discounts = [],
            forPromises = [],
            totalPensions = [];
        try {
            await ST.transaction(async (t) => {


                let studentDiscount = await Model.findByPk(req.params.id)
                await studentDiscount.destroy();


                //OBTENEMOS EL TOTAL DE DESCUENTOS DEL ESTUDIANTE
                discounts = await Model.findAll({
                    where: {id_student: studentDiscount.id_student},
                    include: {
                        attributes: ['id', 'amount'],
                        model: Discount,
                        as: 'Discount'
                    }
                }, {transaction: t});
                discounts.map(r => (totalDiscount = totalDiscount + parseFloat(r.Discount.amount)));
                //OBTENEMOS EL MONTO DE LA PENSIÓN
                pensionCost = await Cost_admission_plan.findOne({
                    where: {id_admission_plan: req.params.id_admission_plan},
                    include: {
                        attributes: ['denomination'],
                        where: {denomination: {[Op.like]: '%' + "Pensión " + '%'}},
                        model: Concept,
                        as: "Concept"
                    }
                }, {transaction: t});

                totalDiscount = pensionCost.amount - pensionCost.amount * totalDiscount / 100;

                totalPensions = await Payment.findAll({
                    where: {id_student: studentDiscount.id_student, denomination: 'Pensión'}
                }, {transaction: t});


                for (let i = 0; i < totalPensions.length; i++) {
                    let temp = await totalPensions[i].update({
                        amount: totalDiscount
                    }, {transaction: t})
                    forPromises.push(temp);
                }
                await Promise.all(forPromises);

            });
            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }

};
