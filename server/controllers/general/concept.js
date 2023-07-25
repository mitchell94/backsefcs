const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;

const Category_concept = require('../../models').Category_concept;
const Model = require('../../models').Concept;
const Cost_admission_plan = require('../../models').Cost_admission_plan;
const ST = Model.sequelize;

module.exports = {
    create: function (req, res) {
        return Model
            .max('id', {paranoid: false})
            .then(max => {
                return Model
                    .create({
                        id: max + 1,
                        denomination: req.body.denomination,
                        id_category_concept: req.body.id_category_concept,
                        type: req.body.type,
                        percent: req.body.percent,
                        generate: req.body.generate,
                        order: req.body.order,
                    })
                    .then(record => {
                        res.status(200).send({
                            message: message.REGISTERED_OK,
                            record: record
                        });
                    })
                    .catch(error => res.status(400).send(error))
            })
            .catch(error => res.status(444).send(error))
    },

    async listConceptByCategoryConceptID(req, res) {
        try {
            let records = await Model.findOne({
                attributes: ['id', 'denomination', 'type', 'percent', 'state'],
                where: {id_category_concept: req.params.id_category_concept}
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    listConcepts: function (req, res) {
        return Model
            .findAll({
                attributes: ['id', 'id_category_concept', 'order', 'denomination', 'percent', 'type', 'generate', 'state'],
                include: {
                    attributes: ['id', 'order', 'description', 'state'],
                    model: Category_concept,
                    as: "Category_concept"
                },
                order: [['order', 'asc']]
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    async listConceptByDescription(req, res) {
        try {
            let records = await Model.findOne({
                attributes: ['id', 'denomination', 'type', 'percent', 'state'],
                where: {"denomination": req.params.description}
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async listConceptByLike(req, res) {
        try {
            let records = await Model.findOne({
                attributes: ['id', 'denomination', 'type', 'percent', 'state'],
                where: {denomination: {[Op.like]: '%' + req.params.description + '%'}},
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async listConceptByLikeAndType(req, res) {
        try {
            let records = await Model.findOne({
                attributes: ['id', 'denomination', 'type', 'percent', 'state'],
                where: {
                    [Op.and]: [
                        {denomination: {[Op.like]: '%' + req.params.description + '%'},},
                        {denomination: {[Op.like]: '%' + req.params.type + '%'}}
                    ]


                },
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async listConceptByID(req, res) {
        try {
            let records = await Model.findOne({
                attributes: ['id', 'denomination', 'type', 'percent', 'state'],
                where: {id: req.params.id},
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async listConceptByType(req, res) {
        try {
            let records = await Model.findAll({
                attributes: ['id', 'denomination', 'type', 'percent', 'state'],
                where: {type: req.params.type},
                include: {
                    attributes: ['id', 'order', 'description', 'state'],
                    model: Category_concept,
                    as: "Category_concept"
                },
                order: [['order', 'asc']]
            });

            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    async listConceptsInscriptionWeb(req, res) {
        try {
            let records = await Cost_admission_plan.findAll({
                attributes: ['id', 'amount'],
                where: {id_admission_plan: req.params.id_admission_plan},
                include: {
                    attributes: ['id', 'denomination'],
                    where: {denomination: {[Op.like]: '%' + "Inscripción" + '%'}},
                    model: Model,
                    as: "Concept"
                }
            });


            res.status(200).send(records)
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    async listConceptsRequeriment(req, res) {
        try {
            let records = await Model.findAll({
                attributes: ['id', 'denomination'],
                where: {denomination: {[Op.like]: '%' + "Inscripción" + '%'}},
            });


            res.status(200).send(records)
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    async updateConcept(req, res) {

        try {
            await ST.transaction(async (t) => {
                let concept = await Model.findOne({where: {id: req.params.id}});
                await concept.update({
                    id_category_concept: req.body.id_category_concept,
                    order: req.body.order,
                    denomination: req.body.denomination,
                    type: req.body.type,
                    generate: req.body.generate,
                    percent: req.body.percent,
                }, {transaction: t});
            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
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
                if (!record) return res.status(400).send({message: message.RECORD_NOT_FOUND});
                return record
                    .destroy()
                    .then(() => res.status(200).send({message: message.DELETED_OK}))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
};
