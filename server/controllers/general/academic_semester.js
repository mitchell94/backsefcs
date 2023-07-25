const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Semester = require('../../models').Semester;
const Model = require('../../models').Academic_semester;
const Admission_plan = require('../../models').Admission_plan;
const Academic_calendar = require('../../models').Academic_calendar;
module.exports = {
    create: function (req, res) {
        return Model
            .max('id', {paranoid: false})
            .then(max => {
                return Model
                    .create({
                        id: max + 1,
                        id_academic_calendar: req.body.id_academic_calendar,
                        id_semester: req.body.id_semester,
                        denomination: req.body.denomination
                    })
                    .then(record => {
                        res.status(200).send({
                            message: message.REGISTERED_OK,
                            record: record
                        });
                    })
                    .catch(error => res.status(400).send(error))
            })
            .catch(error => res.status(444).send(error))
    },

    list: function (req, res) {
        return Model
            .findAll({
                attributes: ['id', 'id_semester', 'denomination'],
                where: {id_academic_calendar: {[Op.eq]: req.params.id_academic_calendar}},
                include: {
                    attributes: ['id', 'denomination', 'state'],
                    model: Semester,
                    as: 'Semester'
                }
            })
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    listAcademicSemesterAndAcademicCalendar: async (req, res) => {

        try {

            let records = await Model.findAll({
                attributes: ['id', 'denomination'],
                where: {state: true},
                include: {
                    attributes: ['id', 'denomination'],
                    model: Academic_calendar,
                    as: "Academic_calendar"
                },
                order: [
                    ['id', 'desc'],
                    [{model: Academic_calendar, as: 'Academic_calendar'}, 'id', 'desc']
                ]
            })
            res.status(200).send(records)
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err)
        }


    },
    listAcademicSemesterAndAcademicCalendarByAdmissionPlan: async (req, res) => {

        try {

            let records = await Admission_plan.findAll({
                where: {
                    id: req.params.id_admission_plan
                },
                include: {

                    attributes: ['id', 'denomination'],
                    model: Model,
                    as: 'Academic_semester',

                    include: {
                        attributes: ['id', 'denomination'],
                        model: Academic_calendar,
                        as: "Academic_calendar"
                    },
                    // order: [
                    //     ['id', 'desc'],
                    //     [{model: Academic_calendar, as: 'Academic_calendar'}, 'id', 'desc']
                    // ]
                }


            })
            let data = [];
            for (let i = 0; i < records.length; i++) {
                data.push({
                    'id_semester': records[i].id_process,
                    'denomination': records[i].Academic_semester.Academic_calendar.denomination.substr(-4) + '-' + records[i].Academic_semester.denomination.substr(-2)
                })
            }

            res.status(200).send(data)
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log(err);
            res.status(445).send(err)
        }


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
                        id_academic_calendar: req.body.id_academic_calendar,
                        id_semester: req.body.id_semester,
                        denomination: req.body.denomination
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
