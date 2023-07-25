const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const Model = require('../../models').Registration_course;
const Person = require('../../models').Person;
const Teacher = require('../../models').Teacher;
const Course = require('../../models').Course;
const Plan = require('../../models').Plan;
const Ciclo = require('../../models').Ciclo;
const Horary = require('../../models').Horary;
const Student = require('../../models').Student;
const Acta_book = require('../../models').Acta_book;
const Registration = require('../../models').Registration;
const Admission_plan = require('../../models').Admission_plan;
const Registration_course = require('../../models').Registration_course;
const ST = Model.sequelize;
const abox = require('../Abox');
const moment = require('moment');
module.exports = {


    listRegistrationCourseByRegistration: async (req, res) => {
        try {
            let data = await Model.findAll({
                attributes: ['id', 'id_registration', 'state', 'note'],
                where: {id_registration: req.params.id_registration},
                include: {
                    attributes: ['denomination'],
                    model: Course,
                    as: 'Course'
                },
                order: [

                    [{model: Course, as: 'Course'}, 'order', 'asc']
                ]

            });

            res.status(200).send(data);

        } catch (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },


};
