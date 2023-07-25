const Sequelize = require('sequelize');
// const message = require('../../messages');
const Op = Sequelize.Op;
const Country = require('../../models').Country;
const Department = require('../../models').Department;
const Province = require('../../models').Province;
const District = require('../../models').District;
module.exports = {


    listCountry: function (req, res) {
        return Country
            .findAll({attributes: ['id', 'description']})
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    listOneCountry: function (req, res) {
        return Country
            .findOne({
                attributes: ['id', 'description'],
                where:{id:req.params.id}
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    listCountryDepartment: function (req, res) {
        return Department
            .findAll({
                    attributes: ['id', 'description'],
                    where: {id_country: req.params.id_country}
                }
            )
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    listDepartmentProvince: function (req, res) {
        return Province
            .findAll({
                    attributes: ['id', 'description'],
                    where: {id_department: req.params.id_department}
                }
            )
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    listProvinceDistrict: function (req, res) {
        return District
            .findAll({
                    attributes: ['id', 'description'],
                    where: {id_province: req.params.id_province}
                }
            )
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
};
