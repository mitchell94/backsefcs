const Sequelize = require('sequelize');
const message = require('../../messages');
const Model = require('../../models').Requeriment_delivered;
const Student = require('../../models').Student;
const Person = require('../../models').Person;
const Programs = require('../../models').Programs;
const Admission_plan = require('../../models').Admission_plan;
const Concept = require('../../models').Concept;
const Cost_admission_plan = require('../../models').Cost_admission_plan;
const Academic_degree = require('../../models').Academic_degree;
const ST = Model.sequelize;
const Op = Sequelize.Op;
const Col = Sequelize.col;
const Fn = Sequelize.fn;
module.exports = {
    async createRequerimentDelivered(req, res) {
        try {
            // console.log('aquiiiiiiiiiiiiiiii')
            // console.log(req.body.arrayRequirement)
            let data = JSON.parse(req.body.arrayRequirement);
            let newRequeriments = []
            for (let i = 0; i < data.length; i++) {
                if (data[i].exists === false) {
                    const max = await Model.max('id', {paranoid: false});
                    let requeriment = await Model.create({
                        id: max + i + 1,
                        id_student: req.body.id_student,
                        id_requeriment: data[i].id,
                        state: data[i].state
                    });
                    newRequeriments.push(requeriment)
                }
            }
            await Promise.all(newRequeriments)

            res.status(200).send(message.REGISTERED_OK)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    async listRequerimentDeliveredByStudent(req, res) {
        try {
            const record = await Student.findOne(
                {
                    attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                    where: {id: req.params.id_student},
                    include: [
                        {
                            attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                            model: Person,
                            as: "Person"
                        },
                        {
                            attributes: ['denomination'],
                            model: Concept,
                            as: "Concept"
                        },
                        {
                            attributes: ['id_academic_degree', 'denomination'],
                            model: Programs,
                            as: "Program",
                            include: {
                                attributes: ['denomination'],
                                model: Academic_degree,
                                as: "Academic_degree"
                            }
                        },
                        {
                            attributes: ['id', 'id_student', 'id_requeriment', 'observation', 'state'],
                            required: false,
                            model: Model,
                            as: "Requeriment_delivereds"
                        },
                    ]
                }
            );
            res.status(200).send(record)

        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    async retrieveRequerimentDelivered(req, res) {
        try {
            const record = await Model.findByPk(req.params.id);
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    async updateRequerimentDelivered(req, res) {
        try {
            const record = await Model.findByPk(req.params.id);
            await record.update({
                state: !record.state
            });
            res.status(200).send(message.UPDATED_OK)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }

    },

    async destroyRequerimentDelivered(req, res) {
        try {
            const record = await Model.findByPk(req.params.id);
            await record.destroy();
            res.status(200).send(message.DELETED_OK);
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
};
