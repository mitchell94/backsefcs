const Sequelize = require("sequelize");
const message = require("../../messages");
const { includes } = require("lodash");
const moment = require("moment");
// const Op = Sequelize.Op;
// const Fn = Sequelize.fn;
// const Col = Sequelize.col;
const Model = require("../../models").InscriptionWeb;
const Program = require("../../models").ProgramWeb;
const Admission = require("../../models").AdmissionWeb;
const ST = Model.sequelize;
moment.locale("es-mx");
module.exports = {
    list: async (req, res) => {
        try {
            const inscriptions = await Model.findAll({
                where: {
                    id_admission: req.params.id,
                },
                include: [
                    {
                        attributes: ["id", "name", "short_name"],
                        model: Program,
                        as: "ProgramWeb",
                    },
                    {
                        attributes: ["id", "name"],
                        model: Admission,
                        as: "AdmissionWeb",
                    },
                ],
                order: [
                    [{ model: Program, as: "ProgramWeb" }, "short_name", "ASC"],
                    ["created_at", "ASC"],
                ],
            });

            const prepareToXlsx = [];
            for (let index = 0; index < inscriptions.length; index++) {
                let element = {};
                element.ORDEN = index + 1;
                element.PROGRAMA = inscriptions[index].ProgramWeb.short_name;
                element.ADMISION = inscriptions[index].AdmissionWeb.name;
                element.DNI = inscriptions[index].document;
                element.NOMBRES = inscriptions[index].first_name.toUpperCase();
                element.APELLIDOS = inscriptions[index].last_name.toUpperCase();
                element.TELEFONO = inscriptions[index].phone;
                element.CORREO = inscriptions[index].email;
                element.FECHA_REGISTRO = moment(inscriptions[index].created_at).format(
                    "DD-MM-YYYY"
                );
                prepareToXlsx.push(element);
            }

            res.status(200).send({ inscriptions: prepareToXlsx });
        } catch (err) {
            console.log(err);
            res.status(445).send(err);
        }
    },

    create: async (req, res) => {
        try {
            await ST.transaction(async (t) => {
                let max = await Model.max(
                    "id",
                    { paranoid: false },
                    { transaction: t }
                );
                await Model.create(
                    {
                        id: max + 1,
                        id_program: req.body.id_program,
                        id_admission: 1,
                        document: req.body.document,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email,
                        phone: req.body.phone,
                        // id_program: 1,
                        // id_admission: 1,
                        // document: 1,
                        // first_name: 1,
                        // last_name: 1,
                        // email: 1,
                        // phone: 1,
                    },
                    { transaction: t }
                );
            });

            console.log(req);
            res.status(200).send({
                message: message.REGISTERED_OK,
                valid: true,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send(err);
        }
    },
};
