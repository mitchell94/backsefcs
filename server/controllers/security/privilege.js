const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Privilege;
const ST = Model.sequelize;
module.exports = {
    create: async (req, res) => {

        try {
            let privilege;
            let privileges = [];

            await ST.transaction(async (t) => {


                    let privilege = await Model.findOne({
                        where: {
                            id_role: req.body.id_role,
                            id_module: req.body.id_module,
                            permit: req.body.permit,
                        }
                    }, {transaction: t});
                    if (privilege) {
                        privileges = await privilege.update({
                            state: !privilege.state
                        }, {transaction: t})
                    } else {
                        let max = await Model.max('id', {paranoid: false}, {transaction: t});
                        privileges = await Model
                            .create({
                                id: max + 1,
                                id_role: req.body.id_role,
                                id_module: req.body.id_module,
                                permit: req.body.permit
                            }, {transaction: t})
                    }

                }
            );

            // In this case, an instance of Model

            res.status(200).send(privileges)
        } catch (err) {
            // Rollback transaction if any errors were encountered

            res.status(445).send(err)
        }

    },

    list: function (req, res) {
        return Model
            .findAll()
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
                        id_role: req.body.id_role,
                        id_module: req.body.id_module,
                        permit: req.body.permit
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
                if (!record) return res.status(404).send({message: message.RECORD_NOT_FOUND});
                return record
                    .update({
                        state: !record.state
                    })
                    .then(updated => {
                        res.status(200).send({
                            message: message.UPDATED_OK,
                            record: updated
                        });
                    })
                    .catch((error) => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
};
