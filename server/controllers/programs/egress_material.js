const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const Model = require('../../models').Egress_material;
const Unit_measure = require('../../models').Unit_measure;
const Concept = require('../../models').Concept;
const Material = require('../../models').Material;
const ST = Model.sequelize;
const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
module.exports = {

    async listEgressMaterialByWorkPlanID(req, res) {
        try {
            let records = await Model.findAll({
                attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                where: {id_work_plan: req.params.id_work_plan},
                include: [
                    {
                        attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                        model: Material,
                        as: "Material"
                    },
                    {
                        attributes: {exclude: ['created_at', 'updated_at', 'deleted_at']},
                        model: Unit_measure,
                        as: "Unit_measure"
                    }
                ],
                // group: ['Egress_Material.id', 'Person.id', 'Course.id',],
                order: [['created_at', 'desc']],

            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

    async createEgressMaterial(req, res) {
        try {
            await ST.transaction(async (t) => {
                const max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    id_work_plan: req.body.id_work_plan,
                    id_concept: req.body.id_concept,
                    id_material: req.body.id_material,
                    id_unit_measure: req.body.id_unit_measure,
                    cant: req.body.cant,
                    amount: req.body.amount,
                    observation: req.body.observation
                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK});
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err});
        }
    },
    async updateEgressMaterial(req, res) {

        try {
            await ST.transaction(async (t) => {
                let EgressMaterial = await Model.findByPk(req.params.id);
                await EgressMaterial.update({


                    id_person: req.body.id_person,
                    id_course: req.body.id_course,
                    cant: req.body.cant,
                    price_hour: req.body.price_hour,
                    observation: req.body.observation
                }, {transaction: t});
            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    async destroyEgressMaterial(req, res) {
        try {
            let WorkPlan = await Model.findByPk(req.params.id);
            await WorkPlan.destroy();
            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
