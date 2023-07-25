const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Academic_period;
module.exports = {

    list: function (req, res) {
        return Model
            .findAll()
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },


};
