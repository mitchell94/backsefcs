const computerName = require('computer-name');
const MacAddress = require('get-mac-address');
const browserInfo = require('browser-info');
const deviceType = require('device-type');
const ip = require('ip');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const services = require('../../services');
const crypt = require('node-cryptex');

const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);

const Model = require('../../models').Session;
const message = 'Registro no encontrado.';
module.exports = {
    createSession: function (req, res) {
        const mac = MacAddress['wlan0'] || '00:00:00:00:00:00';
        const id_user = crypt.decrypt(req.body.id_user, k, v);
        return Model
            .findOne({
                where: {
                    id_user: id_user,
                    mac: mac,
                    logueado: true
                }
            })
            .then(session => {
                if (session) {
                    res.status(200).send(session);
                } else {
                    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
                    console.log('------------------->', ip);
                    return Model
                        .max('id', {paranoid: false})
                        .then(max => {
                            return Model
                                .create({
                                    id: max + 1,
                                    ip: ip,
                                    state: 'En línea',
                                    mac: mac,
                                    id_user: id_user,
                                    device_name: computerName(),
                                    token:"token aqui",
                                    device_type: JSON.stringify(deviceType(req)),
                                    browser: JSON.stringify(browserInfo(req.headers['user-agent'])),
                                })
                                .then(record => res.status(201).send(record))
                                .catch(error => res.status(400).send(error));
                        })
                        .catch(error => res.status(444).send(error));
                }
            })
            .catch(error => res.status(400).send(error));
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
                        [Op.eq]: crypt.decrypt(req.params.id, k, v)
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
                        id_user: req.body.id_user,
                        token: req.body.token,
                        device_name: req.body.device_name,
                        ip: req.body.ip,
                        mac: req.body.mac,
                        device_type: req.body.device_type,
                        browser: req.body.browser,
                        logueado: req.body.logueado
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

    logout: function (req, res) {
        return Model
            .findByPk(req.params.id)
            .then(record => {
                if (!record) return res.status(404).send({message: message});
                return record
                    .update({logueado: !record.logueado})
                    .then(() => res.status(200).send(record))
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
