const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Organic_unit;
const Organic_unit = require('../../models').Organic_unit;
const Type_organic_unit = require('../../models').Type_organic_unit;
const Campus = require('../../models').Campus;
const ST = Model.sequelize;
module.exports = {


    create: function (req, res) {
        return Model
            .max('id', {paranoid: false})
            .then(max => {
                return Model
                    .create({
                        id: max + 1,
                        id_parent: req.body.id_parent || null,
                        id_campus: req.body.id_campus,
                        id_type_organic_unit: req.body.id_type_organic_unit,
                        abbreviation: req.body.abbreviation,
                        denomination: req.body.denomination
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

    listUnitOrganic: function (req, res) {
        return Model
            .findAll({
                attributes: ['id', 'id_parent', 'id_campus', 'denomination', 'id_type_organic_unit', 'abbreviation', 'state'],

                where: {state: true},
                include: {
                    attributes: ['denomination'],
                    model: Campus,
                    as: "Campu"
                }
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    listAllUnitOrganic: function (req, res) {
        return Model
            .findAll({
                attributes: ['id', 'id_parent', 'id_campus', 'denomination', 'id_type_organic_unit', 'abbreviation', 'state'],


                include: {
                    attributes: ['denomination'],
                    model: Campus,
                    as: "Campu"
                },
                order: [['id', 'desc']]
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    updateStateUnitOrganic: async (req, res) => {
        try {
            await ST.transaction(async (t) => {
                let data = await Model.findByPk(req.params.id);
                await data.update({
                    state: !data.state
                }, {transaction: t});

            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }

    },
    listAll: function (req, res) {
        return Model
            .findAll({
                attributes: ['id', 'id_parent', 'id_campus', 'denomination', 'id_type_organic_unit', 'abbreviation', 'state'],
                include:
                    {
                        attributes: ['id', 'denomination', 'state'],
                        model: Type_organic_unit,
                        as: 'Type_organic_unit',

                    }
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },

    listUnitByCampus: function (req, res) {
        return Model
            .findAll({
                attributes: ['id', 'id_parent', 'id_campus', ['denomination', 'text'], 'id_type_organic_unit', 'abbreviation', 'state'],
                where: {
                    id_campus: req.params.id_campus,
                    // id_parent: null
                    id_type_organic_unit: 4
                },

                include: [
                    {
                        attributes: ['id', 'denomination', 'state'],
                        model: Type_organic_unit,
                        as: 'Type_organic_unit',

                    },
                    {
                        required: false,

                        attributes: ['id', 'id_parent', 'id_campus', ['denomination', 'text'], 'id_type_organic_unit', 'abbreviation', 'state'],
                        model: Organic_unit,
                        as: 'children',
                        include: [
                            {
                                attributes: ['id', 'denomination', 'state'],
                                model: Type_organic_unit,
                                as: 'Type_organic_unit',

                            },
                            {
                                required: false,
                                attributes: ['id', 'id_parent', 'id_campus', ['denomination', 'text'], 'id_type_organic_unit', 'abbreviation', 'state'],
                                model: Organic_unit,
                                as: 'children',

                                include: [
                                    {
                                        attributes: ['id', 'denomination', 'state'],
                                        model: Type_organic_unit,
                                        as: 'Type_organic_unit',

                                    },
                                    {
                                        required: false,
                                        attributes: ['id', 'id_parent', 'id_campus', ['denomination', 'text'], 'id_type_organic_unit', 'abbreviation', 'state'],
                                        model: Organic_unit,
                                        as: 'children',
                                        include: [
                                            {
                                                attributes: ['id', 'denomination', 'state'],
                                                model: Type_organic_unit,
                                                as: 'Type_organic_unit',

                                            },
                                            {
                                                required: false,
                                                attributes: ['id', 'id_parent', 'id_campus', ['denomination', 'text'], 'id_type_organic_unit', 'abbreviation', 'state'],
                                                model: Organic_unit,
                                                as: 'children',
                                                include: [
                                                    {
                                                        attributes: ['id', 'denomination', 'state'],
                                                        model: Type_organic_unit,
                                                        as: 'Type_organic_unit',

                                                    },
                                                    {
                                                        required: false,
                                                        attributes: ['id', 'id_parent', 'id_campus', ['denomination', 'text'], 'id_type_organic_unit', 'abbreviation', 'state'],
                                                        model: Organic_unit,
                                                        as: 'children'
                                                    }

                                                ]
                                            }

                                        ]
                                    }

                                ]
                            }

                        ]
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
                        id_parent: req.body.id_parent,
                        id_campus: req.body.id_campus,
                        id_type_organic_unit: req.body.id_type_organic_unit,
                        abbreviation: req.body.abbreviation,
                        denomination: req.body.denomination
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
    search_organic_unit(req, res) {
        return Model
            .findAll({
                attributes: [['id', 'value'], 'id_parent', 'id_campus', ['denomination', 'label'], 'id_type_organic_unit', 'abbreviation', 'state'],
                where: {
                    [Op.or]: [
                        {denomination: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                    ],

                },

            })
            .then(record => {
                if (!record) {
                    return res.status(404).send({
                        message: message
                    });
                }
                return res.status(200).send(record);
            })
            .catch(error => res.status(400).send(error));
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
