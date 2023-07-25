const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const message = require('../../messages');
const Model = require('../../models').Contract_type;

module.exports = {
    create: function (req, res) {
        return Model
          .max('id',{paranoid:false})
          .then(max=>{
            return Model
            .create({
                id:max+1,
                denomination: req.body.denomination,
                abbreviation: req.body.abbreviation || null
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

    list: function (req, res) {
        return Model
            .findAll({
               attributes:['id','denomination','abbreviation','state'],
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },

     update: function (req, res) {
        return Model
            .find({
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
                        denomination: req.body.denomination,
                        abbreviation: req.body.abbreviation
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
            .find({
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
    }
};
