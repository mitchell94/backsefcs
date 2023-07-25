const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Egress;
const Concepts = require('../../models').Concepts;
const Course = require('../../models').Course;
const Payment = require('../../models').Payment;
const Student = require('../../models').Student;
const Material = require('../../models').Material;
const Person = require('../../models').Person;
const Teacher = require('../../models').Teacher;
const Administrative = require('../../models').Administrative;
const Organic_unit = require('../../models').Organic_unit;
const Program = require('../../models').Programs;
const Concept = require('../../models').Concept;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const Literal = Sequelize.literal;
const fs = require('fs').promises;
const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
const ST = Model.sequelize;

module.exports = {
    listTotalEgressByPlan: async (req, res) => {
        let total = 0;
        try {
            let data = [];
            data = await Model.findAll({
                attributes: ['id', 'amount'],
                where: {id_admission_plan: req.params.id_admission_plan}
            });

            for (let i = 0; i < data.length; i++) {
                total = parseFloat(data[i].amount) + total;

            }


            // res.status(200).send(total)

            res.status(200).send(String(total.toFixed(2)))
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    listTeacherEgressByPlan: async (req, res) => {

        try {
            let teachers = await Model.findAll({
                attributes: ['id', 'amount', 'init_date', 'end_date', 'order_number','document_one', 'type', 'type_teacher', 'state_egress'],
                where: {
                    id_admission_plan: req.params.id_admission_plan,
                    id_teacher: {[Op.ne]: null}
                },
                include: [
                    {
                        attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                        model: Person,
                        as: 'Teacher'
                    },
                    {
                        attributes: ['denomination'],
                        model: Concept,
                        as: "Concept"
                    },
                    {
                        attributes: ['id', 'denomination'],
                        model: Course,
                        as: "Course"
                    }
                ]
            });


            res.status(200).send(teachers)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    listAdministrativeEgressByPlan: async (req, res) => {

        try {
            let administratives = await Model.findAll({
                attributes: ['id', 'id_concept', 'amount', 'init_date', 'end_date', 'document_one', 'order_number', 'state_egress'],
                where: {
                    id_admission_plan: req.params.id_admission_plan,
                    id_administrative: {[Op.ne]: null}
                },
                include: [
                    {
                        attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                        model: Person,
                        as: 'Administrative'
                    },
                    {
                        attributes: ['denomination'],
                        model: Concept,
                        as: "Concept"
                    }
                ]
            });

            res.status(200).send(administratives)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    listMaterialEgressByPlan: async (req, res) => {
        try {
            let data = await Model.findAll({
                attributes: ['id', 'id_concept', 'amount', 'init_date', 'end_date','document_one', 'order_number', 'type', 'state_egress'],
                where: {
                    id_admission_plan: req.params.id_admission_plan,
                    id_material: {[Op.ne]: null}
                },
                include: [
                    {
                        model: Material,
                        as: 'Material',
                    },
                    {
                        attributes: ['denomination'],
                        model: Concept,
                        as: "Concept"
                    }
                ]
            });

            res.status(200).send(data)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },


    createEgressTeacher: async (req, res) => {

        try {
            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    id_organic_unit: req.body.id_organic_unit,
                    id_program: req.body.id_program,
                    id_course: req.body.id_course,
                    id_admission_plan: req.body.id_admission_plan,
                    id_concept: 87, //codigo concepto de pago docente
                    id_teacher: req.body.id_teacher,
                    init_date: req.body.init_date,
                    end_date: req.body.end_date,
                    amount: req.body.amount,
                    type: 'Servicio',
                    state_egress: req.body.state_egress,
                    type_teacher: req.body.type_teacher,
                    document_one: req.body.document_one,
                    order_number: req.body.order_number

                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK})

        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    createEgressMaterial: async (req, res) => {

        try {
            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    id_organic_unit: req.body.id_organic_unit,
                    id_program: req.body.id_program,
                    id_admission_plan: req.body.id_admission_plan,
                    id_concept: 91, //codigo concepto de pago docente
                    id_material: req.body.id_material,
                    amount: req.body.amount,
                    type: req.body.type,
                    order_number: req.body.order_number,
                    document_one: req.body.document_one,
                    init_date: req.body.init_date,
                    state_egress: req.body.state_egress,
                    end_date: req.body.end_date,

                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK})

        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    createEgressAdministrative: async (req, res) => {

        try {
            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    id_organic_unit: req.body.id_organic_unit,
                    id_program: req.body.id_program,
                    id_admission_plan: req.body.id_admission_plan,
                    id_administrative: req.body.id_administrative,
                    id_concept: req.body.id_concept,
                    type: 'Servicio',
                    order_number: req.body.order_number,
                    amount: req.body.amount,
                    document_one: req.body.document_one,
                    init_date: req.body.init_date,
                    state_egress: req.body.state_egress,
                    end_date: req.body.end_date

                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK})

        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    updateEgressTeacher: async (req, res) => {


        try {

            await ST.transaction(async (t) => {

                let data = await Model.findByPk(req.params.id_egress)
                await data.update({
                    id_teacher: req.body.id_teacher,
                    id_course: req.body.id_course,
                    order_number: req.body.order_number,
                    amount: req.body.amount,
                    end_date: req.body.end_date,
                    document_one: req.body.document_one,
                    state_egress: req.body.state_egress,
                    init_date: req.body.init_date
                }, {transaction: t});

            });
            res.status(200).send(message.UPDATED_OK)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }

    },
    updateEgressAdministrative: async (req, res) => {
        try {
            await ST.transaction(async (t) => {

                let data = await Model.findByPk(req.params.id_egress)
                await data.update({
                    id_administrative: req.body.id_administrative,
                    id_concept: req.body.id_concept,
                    order_number: req.body.order_number,
                    amount: req.body.amount,
                    init_date: req.body.init_date,
                    document_one: req.body.document_one,
                    state_egress: req.body.state_egress,
                    end_date: req.body.end_date
                }, {transaction: t});

            });
            res.status(200).send(message.UPDATED_OK)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    updateEgressMaterial: async (req, res) => {


        try {

            await ST.transaction(async (t) => {

                let data = await Model.findByPk(req.params.id_egress)
                await data.update({
                    id_material: req.body.id_material,
                    type: req.body.type,
                    order_number: req.body.order_number,
                    amount: req.body.amount,
                    document_one: req.body.document_one,
                    end_date: req.body.end_date,
                    init_date: req.body.init_date,
                    state_egress: req.body.state_egress
                }, {transaction: t});

            });
            res.status(200).send(message.UPDATED_OK)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }

    },


    destroyEgressTeacher: async (req, res) => {
        try {

            await ST.transaction(async (t) => {
                let data = await Model.findByPk(req.params.id_egress)
                await data.destroy();
            });

            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    destroyEgressMaterial: async (req, res) => {
        try {

            await ST.transaction(async (t) => {
                let data = await Model.findByPk(req.params.id_egress)
                await data.destroy();
            });

            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    destroyEgressAdministrative: async (req, res) => {
        try {

            await ST.transaction(async (t) => {
                let data = await Model.findByPk(req.params.id_egress)
                await data.destroy();
            });

            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
