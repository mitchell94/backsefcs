const Sequelize = require('sequelize');
const message = require('../../messages');
const Model = require('../../models').Requeriment;
const Academic_degree = require('../../models').Academic_degree;
const Concept = require('../../models').Concept;
const Op = Sequelize.Op;
module.exports = {
    async createRequeriment(req, res) {
        try {
            const max = await Model.max('id', {paranoid: false});
            await Model.create({
                id: max + 1,
                id_academic_degree: req.body.id_academic_degree,
                id_concept: req.body.id_concept,
                description: req.body.description,
                type_entry: req.body.type_entry
            });
            res.status(200).send(message.REGISTERED_OK)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    async listRequeriment(req, res) {
        try {
            const record = await Model.findAll(
                {
                    attributes: ['id', 'id_academic_degree', 'id_concept', 'description', 'type_entry'],
                    include: [
                        {
                            attributes: ['denomination', 'abbreviation'],
                            model: Academic_degree,
                            as: "Academic_degree",
                        },
                        {
                            attributes: ['denomination'],
                            model: Concept,
                            as: "Concept",
                        }
                    ],
                    order: [
                        ['created_at', 'asc']
                    ]
                }
            );
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    async listRequerimentByConceptAcademicDegree(req, res) {

        try {
            const record = await Model.findAll(
                {
                    attributes: ['id', 'id_academic_degree', 'id_concept', 'description', 'type_entry'],
                    where: {
                        id_concept: req.params.id_concept,
                        id_academic_degree: req.params.id_academic
                    },
                    order: [
                        ['created_at', 'asc']
                    ]
                }
            );
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async retrieveRequeriment(req, res) {
        try {
            const record = await Model.findByPk(req.params.id);
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    async updateRequeriment(req, res) {
        try {
            const record = await Model.findByPk(req.params.id);
            await record.update({
                id_academic_degree: req.body.id_academic_degree,
                id_concept: req.body.id_concept,
                description: req.body.description,
                type_entry: req.body.type_entry
            });
            res.status(200).send(message.UPDATED_OK)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }

    },

    async destroyRequeriment(req, res) {
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
