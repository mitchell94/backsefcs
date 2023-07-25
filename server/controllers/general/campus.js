const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Campus;
const District = require('../../models').District;
const Province = require('../../models').Province;
const Department = require('../../models').Department;
const Country = require('../../models').Country;
module.exports = {
    createCampus: function (req, res) {
        return Model
            .max('id', {paranoid: false})
            .then(max => {
                return Model
                    .create({
                        id: max + 1,
                        id_district: req.body.id_district,
                        code: req.body.code,
                        denomination: req.body.denomination,
                        type: req.body.type
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

    listCampus: function (req, res) {
        return Model
            .findAll(
                {
                    attributes: ['id', 'id_district', 'code', 'denomination', 'type', 'state'],
                    include: {
                        attributes: ['id', 'description'],
                        model: District,
                        as: "District",
                        include: {
                            attributes: ['id', 'description'],
                            model: Province,
                            as: "Province",
                            include: {
                                attributes: ['id', 'description'],
                                model: Department,
                                as: "Department",
                                include: {
                                    attributes: ['id', 'description'],
                                    model: Country,
                                    as: "Country"
                                }
                            }
                        }
                    },
                    order: [
                        ['type', 'asc']
                    ]
                }
            )
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
                        id_ubigeo: req.body.id_ubigeo,
                        code: req.body.code,
                        denomination: req.body.denomination,
                        type: req.body.type
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
