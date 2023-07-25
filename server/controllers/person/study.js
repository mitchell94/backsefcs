const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Study;
const Academic_degree = require('../../models').Academic_degree;
const Document = require('../../models').Document;
module.exports = {
    create: function (req, res) {
        return Model
            .max('id', {paranoid: false})
            .then(max => {
                return Model
                    .create({
                        id: max + 1,
                        id_person: req.body.id_person,
                        id_academic_degree: req.body.id_academic_degree,
                        id_document: req.body.id_document,
                        university: req.body.university,
                        title: req.body.title,
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

    listPerson: function (req, res) {
        return Model
            .findAll({
                attributes: ['id','id_document', 'university', 'title', 'state'],
                where: {
                    id_person: {
                        [Op.eq]: req.params.id
                    }
                },
                include: [
                    {
                        attributes: ['id', 'denomination'],
                        where: {state: true},
                        model: Academic_degree,
                        as: 'Academic_degree'

                    },
                    {
                        attributes: ['code'],
                        model: Document,
                        as: 'Document'
                    }
                ]
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },

    retrieve: function (req, res) {
        return Model
            .findOne({
                where: {
                    id: {
                        [Op.eq]: req.params.id
                    }
                }
            })
            .then(record => {
                if (!record) return res.status(404).send({message: message.RECORD_NOT_FOUND});
                return res.status(200).send(record);
            })
            .catch(error => res.status(400).send(error));
    },

    update: function (req, res) {
        return Model
            .findOne({
                where: {
                    id: {
                        [Op.eq]: req.params.id
                    }
                }
            })
            .then(record => {
                if (!record) return res.status(404).send({message: message.RECORD_NOT_FOUND});
                return record
                    .update({
                        id_person: req.body.id_person,
                        id_academic_degree: req.body.id_academic_degree,
                        id_document: req.body.id_document,
                        university: req.body.university,
                        title: req.body.title,
                    })
                    .then(updated => {
                        res.status(200).send({
                            message: message.UPDATED_OK,
                            record: updated
                        });
                    })
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
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
