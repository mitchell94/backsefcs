const Sequelize = require("sequelize");
// const message = require("../../messages");
const Model = require("../../models").AdmissionWeb;
// const ST = Model.sequelize;
module.exports = {
    list: async (req, res) => {
        try {
            const admissions = await Model.findAll();
            res.status(200).send({ admissions: admissions });
        } catch (err) {
            console.log(err);
            res.status(445).send(err);
        }
    },
};
