const Sequelize = require("sequelize");
// const message = require("../../messages");
const Model = require("../../models").ProgramWeb;
// const ST = Model.sequelize;
module.exports = {
    list: async (req, res) => {
        try {
            const programs = await Model.findAll();
            res.status(200).send({ programs: programs });
        } catch (err) {
            console.log(err);
            res.status(445).send(err);
        }
    },
};
