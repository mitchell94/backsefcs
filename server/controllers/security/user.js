const nodemailer = require("nodemailer");
const moment = require("moment");

const Sequelize = require("sequelize");
const message = require("../../messages");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const Op = Sequelize.Op;
const uuid = require("uuid");

const crypt = require("node-cryptex");
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
const jwt = require("jsonwebtoken");

const Model = require("../../models").User;
const Role = require("../../models").Role;
const Organic_unit = require("../../models").Organic_unit;
const Type_organic_unit = require("../../models").Type_organic_unit;
const Student = require("../../models").Student;
const Administrative = require("../../models").Administrative;
const Person = require("../../models").Person;
const User_role = require("../../models").User_role;

const ST = Model.sequelize;
const Fn = Sequelize.fn;
const Col = Sequelize.col;

const abox = require("../Abox");
const messages = "No se encontró el usuario.";
const message_deleted = "Usuario eliminado.";

const fromEmail = "soporte@unsm.edu.pe";
const subject = "UNSM: Cambio de clave acceso a intranet";
const subjectt = "UNSM: Credenciales de acceso";
const appRoot = require("app-root-path");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "soporte@unsm.edu.pe",
    pass: "ljEmwBOg*IJF",
  },
});
module.exports = {
  async listUserLogID(req, res) {
    try {
      const record = await Model.findOne({
        attributes: ["id"],
        where: { id: req.params.id_user },
        include: [
          {
            attributes: [
              "id",
              "document_number",
              "email",
              [
                Fn(
                  "CONCAT",
                  Col("name"),
                  " ",
                  Col("paternal"),
                  " ",
                  Col("maternal")
                ),
                "name",
              ],
            ],
            model: Person,
            as: "Person",
          },
        ],
      });
      await abox.generateJsonLog();

      // aw fs.readFileSync(abox.URL_FINAL);
      // await fs.readFileSync(abox.URL_FINAL_LOG);
      const json = require(abox.URL_FINAL_LOG);
      // let Logs = JSON.parse(json);

      const filtrados = json.filter((v) => v.id == req.params.id_user);

      // let Logs = json && JSON.parse(json);
      // const filtrados = json ? Logs.filter(v => v.id === req.params.id_user) : [];
      res.status(200).send({ User: record, Request: filtrados });
    } catch (err) {
      console.log(err);
      res.status(445).send({ message: message.ERROR_TRANSACTION, error: err });
    }
  },
  create: async (req, res) => {
    try {
      let userGods = [];
      let hashCode;
      await ST.transaction(async (t) => {
        let userGod = await Model.findOne(
          { where: { god: { [Op.eq]: true } } },
          { transaction: t }
        );
        if (userGod) {
          res.status(400).send({ message: "JAJA Estas Pendejo" });
        } else {
          hashCode = await new Promise(
            (resolve, reject) => {
              bcrypt.genSalt(11, function (err, salt) {
                if (err) return res.status(400).send(err);
                bcrypt.hash(req.body.pass, salt, function (err, hash) {
                  if (err) return res.status(400).send(err);
                  resolve(hash);
                });
              });
            },
            { transaction: t }
          );
          if (hashCode) {
            userGods = await Model.create(
              {
                id: uuid(),
                user: req.body.user,
                pass: hashCode,
                god: true,
              },
              { transaction: t }
            );
          } else {
            res.status(400).send({ message: "JAJA Estas Pendejo" });
          }
        }
      });

      // In this case, an instance of Model

      res.status(200).send({ userGods });
    } catch (err) {
      // Rollback transaction if any errors were encountered

      res.status(445).send(err);
    }
  },
  // create user demi
  async createDemi(req, res) {
    try {
      let hashCode = await abox.encrytedPass(req.body.pass);

      await ST.transaction(async (t) => {
        if (!hashCode) throw "Algo salio mal.";

        let userDemi = await Model.findOne(
          { where: { user: req.body.user } },
          { transaction: t }
        );
        if (userDemi) throw "Este usuario ya ha sido registrado";

        let out = await abox.templateSendUserCredential(
          req.body.name,
          req.body.document_number,
          req.body.pass
        );
        const mailOptions = {
          from: "soporte@unsm.edu.pe",
          to: req.body.email,
          subject: "SEUNSM: Credenciales de acceso",
          html: out,
        };
        let sendMail = await abox.wrapedSendMail(mailOptions);
        if (sendMail) {
          let userData = await Model.create(
            {
              id: uuid(),
              id_person: req.body.id_person,
              user: req.body.user,
              pass: hashCode,
              god: false,
            },
            { transaction: t }
          );

          let maxRole = await User_role.max(
            "id",
            { paranoid: false },
            { transaction: t }
          );
          await User_role.create(
            {
              id: maxRole + 1,
              id_user: userData.id,
              id_organic_unit: req.body.id_organic_unit,
              id_role: req.body.id_role,
            },
            { transaction: t }
          );
        } else {
          throw "No se puede enviar a ese correo";
        }
      });
      res.status(200).send({ message: message.REGISTERED_OK });
    } catch (err) {
      console.log(err);
      res.status(445).send({ message: err, error: message.ERROR_TRANSACTION });
    }
  },

  async updateDemiUserPass(req, res) {
    try {
      let hashCode = await abox.encrytedPass(req.body.pass);

      await ST.transaction(async (t) => {
        if (!hashCode) throw "Algo salio mal.";

        let userDemi = await Model.findOne(
          { where: { id: req.body.id_user } },
          { transaction: t }
        );
        if (!userDemi) throw "Usuario no encontrado";

        let out = await abox.templateSendUserCredential(
          req.body.name,
          req.body.document_number,
          req.body.pass
        );
        const mailOptions = {
          from: "soporte@unsm.edu.pe",
          to: req.body.email,
          subject: "SEUNSM: Credenciales de acceso",
          html: out,
        };
        let sendMail = await abox.wrapedSendMail(mailOptions);
        if (sendMail) {
          await userDemi.update(
            {
              pass: hashCode,
            },
            { transaction: t }
          );
        } else {
          throw "No se puede enviar a ese correo";
        }
      });
      res.status(200).send({ message: message.REGISTERED_OK });
    } catch (err) {
      console.log(err);
      res.status(445).send({ message: err, error: message.ERROR_TRANSACTION });
    }
  },

  listUserStudent: function (req, res) {
    return Model.findOne({
      attributes: [
        "id",
        "id_person",
        "id_role",
        "id_organic_unit",
        "user",
        "god",
        "type",
        "state",
      ],
      where: {
        id_person: req.params.id_person,
        id_organic_unit: req.params.id_organic_unit,
        type: "Estudiante",
      },
    })
      .then((records) => res.status(200).send(records))
      .catch((error) => res.status(400).send(error));
  },
  listUserTeacher: function (req, res) {
    return Model.findOne({
      attributes: [
        "id",
        "id_person",
        "id_role",
        "id_organic_unit",
        "user",
        "god",
        "type",
        "state",
      ],
      where: {
        id_person: req.params.id_person,
        id_organic_unit: req.params.id_organic_unit,
        type: "Docente",
      },
    })
      .then((records) => res.status(200).send(records))
      .catch((error) => res.status(400).send(error));
  },
  listUserAdministrative: function (req, res) {
    return Model.findOne({
      attributes: [
        "id",
        "id_person",
        "id_role",
        "id_organic_unit",
        "user",
        "god",
        "type",
        "state",
      ],
      where: {
        id_person: req.params.id_person,
        id_organic_unit: req.params.id_organic_unit,
        type: "Administrativo",
      },
    })
      .then((records) => res.status(200).send(records))
      .catch((error) => res.status(400).send(error));
  },

  //LOGIN validar contraseña
  async validate_password(req, res) {
    try {
      let data = {};
      await ST.transaction(async (t) => {
        const pass = crypt.decrypt(req.body.pass, k, v);
        const valid = await Model.findOne({ where: { user: req.body.user } });
        const validPass = await abox.validatePass(valid.pass, pass);
        if (!validPass) throw "Contraseña o usuario incorrecto";
        let token = jwt.sign({ id: valid.id }, "mysecretkey", {
          expiresIn: 10800,
        });
        if (valid.god) {
          data = {
            message: "Acceso concedido",
            state: true,
            info: "",
            token: token,
            user: crypt.encrypt(valid.id.toString(), k, v),
            mode: valid.god,
          };
        } else {
          const UserRoles = await User_role.findAll(
            {
              attributes: ["id", "id_role", "id_organic_unit"],
              where: { id_user: valid.id },
              include: [
                {
                  attributes: ["denomination"],
                  model: Organic_unit,
                  as: "Organic_unit",
                },
                {
                  attributes: ["denomination"],
                  model: Role,
                  as: "Role",
                },
              ],
            },
            { transaction: t }
          );
          data = {
            message: "Acceso concedido",
            state: true,
            info: crypt.encrypt(JSON.stringify(UserRoles), k, v),
            user: crypt.encrypt(valid.id.toString(), k, v),
            token: token,
            mode: valid.god,
          };
        }
      });
      res.status(200).send(data);
    } catch (err) {
      res.status(445).send({ message: message.ERROR_TRANSACTION, error: err });
    }
  },

  list: function (req, res) {
    return Model.findAll({
      attributes: ["id", "id_person", "user", "pass", "state"],
      where: {
        god: {
          [Op.eq]: false,
        },
      },
      include: {
        attributes: [
          "id",
          "document_number",
          "email",
          [
            Fn(
              "CONCAT",
              Col("name"),
              " ",
              Col("paternal"),
              " ",
              Col("maternal")
            ),
            "name",
          ],
        ],
        model: Person,
        as: "Person",
      },
      order: [["state", "desc"]],
    })
      .then((records) => res.status(200).send(records))
      .catch((error) => res.status(400).send(error));
  },
  async listUsers(req, res) {
    try {
      const record = await Model.findAll({
        attributes: ["id", "user", "state"],
        where: { god: { [Op.ne]: true } },
        include: [
          {
            attributes: [
              "id",
              "document_number",
              "email",
              "photo",
              [
                Fn(
                  "CONCAT",
                  Col("name"),
                  " ",
                  Col("paternal"),
                  " ",
                  Col("maternal")
                ),
                "name",
              ],
              "updated_at",
            ],
            model: Person,
            as: "Person",
          },
        ],
      });
      res.status(200).send(record);
    } catch (err) {
      console.log(err);
      res.status(445).send({ message: message.ERROR_TRANSACTION, error: err });
    }
  },
  async listUserID(req, res) {
    try {
      const record = await Model.findOne({
        // attributes: ['id', "code", "document_number", "name", "phone", "email", "send_mail", "description", "voucher_code", "voucher_amount", "voucher_date", "voucher_url", "voucher_state", "observation", "state"],
        where: { id: req.params.id },
        include: [
          {
            // required:false,
            model: Person,
            as: "Person",
          },
          {
            model: User_role,
            as: "User_roles",
            include: [
              {
                model: Organic_unit,
                as: "Organic_unit",
              },
              {
                model: Role,
                as: "Role",
              },
            ],
          },
        ],
      });
      res.status(200).send(record);
    } catch (err) {
      console.log(err);
      res.status(445).send({ message: message.ERROR_TRANSACTION, error: err });
    }
  },

  list_user_god: function (req, res) {
    return Model.findOne({
      where: {
        god: true,
      },
    })
      .then((record) => {
        if (!record)
          return res.status(404).send({ message: message.RECORD_NOT_FOUND });
        return res.status(200).send(record);
      })
      .catch((error) => res.status(400).send(error));
  },
  // LOGIN  SISTEMA ADMINISTRADOR => DATOS DE USUARIO
  getUserInformation: function (req, res) {
    return Model.findOne({
      attributes: ["id", "id_person", "user", "god", "state"],
      where: {
        id: {
          [Op.eq]: req.params.id,
        },
      },
      include: [
        {
          attributes: [
            "id",
            "document_number",
            "email",
            "photo",
            [Fn("CONCAT", Col("name"), " ", Col("paternal")), "name"],
          ],
          model: Person,
          as: "Person",
        },
      ],
    })
      .then((record) => {
        if (!record)
          return res.status(404).send({ message: message.RECORD_NOT_FOUND });
        let stringify = "";
        stringify = JSON.stringify(record);
        // if (record.god) {
        //     stringify = JSON.stringify({mode: 'god', user: record});
        // } else {
        //     stringify = JSON.stringify({mode: 'demi', user: record});
        // }

        // return res.status(200).send(record);
        return res.status(200).send(crypt.encrypt(stringify, k, v));
      })
      .catch((error) => res.status(400).send(error));
  },
  update_password: function (req, res) {
    return Model.findByPk(req.params.id)
      .then((record) => {
        if (!record) return res.status(404).send({ message: messages });
        bcrypt.genSalt(11, function (err, salt) {
          if (err) return res.status(400).send(err);
          bcrypt.hash(req.body.pass, salt, function (err, hash) {
            if (err) return res.status(400).send(err);
            return record
              .update({ pass: hash })
              .then((r) => {
                let output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Demystifying Email Design</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body style="margin: 0; padding: 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                  <td style="padding: 10px 0 30px 0;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
                          <tr>
                              <td align="center" style="padding: 40px 0 20px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: 'HelveticaNeueLT Std Lt', sans-serif; width: 300px; height: 150px">
                                  <img src="https://icon-icons.com/icons2/944/PNG/512/medical-25_icon-icons.com_73900.png" alt="Email UNSM-T" width="100" height="100" style="display: block;" />
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#ffffff" style="padding: 0 30px 40px 30px;">
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                      <tr>
                                          <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px; text-align: center;">
                                              <b>Cambio de clave de acceso</b>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 20px 0 10px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; text-align: center;">
                                              Recientemente se ha solicitado un cambio de contraseña del usuario <b>${
                                                r.user
                                              }</b>, el dia ${moment().format(
                  "YYYY-MM-DD hh:mm A"
                )}, por lo tanto su nueva clave de acceso es la siguiente:
                                              <br/>
     <p style="border: 1px dashed #ddd; padding: 10px; text-align: center; font-weight: bold;">${
       req.body.pass
     }</p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#3AB54A" style="padding: 30px 30px 30px 30px;">
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                      <tr>
                                          <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
                                              &copy; Todos los derechos reservados<br/>
                                              Universidad Nacional de San Martín - Tarapoto
                                          </td>
                                          <td align="right" width="25%">
                                              <table border="0" cellpadding="0" cellspacing="0">
                                                  <tr>
                                                      <td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                                                          <a href="https://twitter.com/unsmperu" style="color: #ffffff;">
                                                              <img src="https://icon-icons.com/icons2/555/PNG/512/twitter_icon-icons.com_53611.png" alt="Twitter" width="38" height="38" style="display: block;" border="0" />
                                                          </a>
                                                      </td>
                                                      <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
                                                      <td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                                                          <a href="https://www.facebook.com/unsmperu/" style="color: #ffffff;">
                                                              <img src="https://icon-icons.com/icons2/555/PNG/512/facebook_icon-icons.com_53612.png" alt="Facebook" width="38" height="38" style="display: block;" border="0" />
                                                          </a>
                                                      </td>
                                                      <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
                                                      <td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                                                          <a href="https://unsm.edu.pe" style="color: #ffffff;">
                                                              <img src="https://icon-icons.com/icons2/1483/PNG/512/domainregistrar_102158.png" alt="Facebook" width="38" height="38" style="display: block;" border="0" />
                                                          </a>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>`;
                const mailOptions = {
                  from: fromEmail,
                  to: req.body.email,
                  subject: subject,
                  html: output,
                };
                transporter
                  .sendMail(mailOptions)
                  .then((res) => {
                    res.status(201).send({
                      message: "email Success",
                    });
                  })
                  .catch((err) => res.status(202).send(err));
              })
              .catch((error) => res.status(400).send(error));
          }); //bcrypt hash end
        }); //genSalt end
      }) //findById end
      .catch((error) => res.status(400).send(error));
  },

  update: function (req, res) {
    return Model.findOne({
      where: {
        id: {
          [Op.eq]: req.params.id,
        },
      },
    })
      .then((record) => {
        if (!record)
          return res.status(404).send({ message: message.RECORD_NOT_FOUND });
        return record
          .update({
            id_person: req.body.id_person,
            id_role: req.body.id_role,
            user: req.body.user,
            pass: req.body.pass,
            type_user: req.body.type_user,
          })
          .then((updated) => {
            res.status(200).send({
              message: message.UPDATED_OK,
              record: updated,
            });
          })
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  destroy: function (req, res) {
    return Model.findOne({
      where: {
        id: {
          [Op.eq]: req.params.id,
        },
      },
    })
      .then((record) => {
        if (!record)
          return res.status(404).send({ message: message.RECORD_NOT_FOUND });
        return record
          .update({
            state: !record.state,
          })
          .then((updated) => {
            res.status(200).send({
              message: message.UPDATED_OK,
              record: updated,
            });
          })
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  async updateStateUser(req, res) {
    try {
      await ST.transaction(async (t) => {
        let data = await Model.findByPk(req.params.id);
        await data.update(
          {
            state: !data.state,
          },
          { transaction: t }
        );
      });

      res.status(200).send({ message: message.UPDATED_OK });
    } catch (err) {
      console.log(err);
      res.status(445).send({ message: message.ERROR_TRANSACTION, error: err });
    }
  },
};
