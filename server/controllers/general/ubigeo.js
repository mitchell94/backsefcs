const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Ubigeo;
const Ubigeo = require('../../models').Ubigeo;
const Department = require('../../models').Department;
const Province = require('../../models').Province;
const District = require('../../models').District;
module.exports = {

    listCountry: function (req, res) {
        return Ubigeo
            .findAll({
                attributes: ['id', 'name'],
                where: {
                    id_parent: null
                }

            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    listPeru: function (req, res) {
        return Department
            .findAll({
                where: {id_country: 89},
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    listProvince: function (req, res) {
        return Province
            .findAll({
                where: {id_department: req.params.id},
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    listDistrict: function (req, res) {
        return District
            .findAll({
                where: {id_province: req.params.id},
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },

 };
