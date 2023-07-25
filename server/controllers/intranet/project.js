const nodemailer = require('nodemailer');
const moment = require('moment');

const Sequelize = require('sequelize');
const message = require('../../messages');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const Op = Sequelize.Op;
const uuid = require('uuid');

const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
const jwt = require('jsonwebtoken');

const Model = require('../../models').Project,
    Student = require('../../models').Student,
    Program = require('../../models').Programs,
    User_intranet = require('../../models').User_intranet,
    Project_round = require('../../models').Project_round;
Person = require('../../models').Person;

const ST = Model.sequelize;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const Li = Sequelize.literal;
const abox = require('../Abox');
const URL_PLUBLIC = require("../Abox").URL_PLUBLIC;
const url_project_tesis_document = URL_PLUBLIC + 'project/';
module.exports = {

    listTeacherProject: async (req, res) => {
        let _data = [];
        try {
            const user = await User_intranet.findOne({
                where: {id: req.userId}
            })

            let data = await Model.findAll({
                // attributes: ['id'],
                where: {
                    [Op.or]: [
                        {id_president: user.id_person},
                        {id_vocal: user.id_person},
                        {id_secretary: user.id_person}
                    ]
                },
                include: [
                    {
                        model: Project_round,
                        as: 'Project_rounds'
                    },
                    {
                        model: Program,
                        as: 'Program'
                    },
                    {
                        attributes: ['id'],
                        model: Student,
                        as: 'Student',
                        include: {
                            attributes: ['id', 'document_number', 'email', 'phone', 'name', 'paternal', 'maternal'],
                            model: Person,
                            as: 'Person'
                        },
                    },
                    {
                        model: Person,
                        as: 'President'
                    },
                    {
                        model: Person,
                        as: 'Vocal'
                    },
                    {
                        model: Person,
                        as: 'Secretary'
                    }
                ]


            })

            let charge = '';
            for (let i = 0; i < data.length; i++) {
                if (data[i].id_president === user.id_person) {
                    charge = 'Presidente'
                }
                if (data[i].id_vocal === user.id_person) {
                    charge = 'Vocal'
                }
                if (data[i].id_secretary === user.id_person) {
                    charge = 'Secretario'
                }

                _data.push({
                    id: data[i].id,
                    charge: charge,
                    project_round: data[i].Project,
                    program: data[i].Program && data[i].Program.denomination,
                    student: data[i].Student && data[i].Student.Person.name + ' ' + data[i].Student.Person.paternal + ' ' + data[i].Student.Person.maternal,
                    student_document: data[i].Student && data[i].Student.Person.document_number,
                    student_email: data[i].Student && data[i].Student.Person.email,
                    student_phone: data[i].Student && data[i].Student.Person.phone,
                    observation: data[i].observation,
                    project_file: data[i].project_file,
                    project_name: data[i].project_name,
                    resolution_jury: data[i].resolution_jury,
                    resolution_jury_date: data[i].resolution_jury_date,
                    resolution_jury_file: data[i].resolution_jury_file,
                    state: data[i].Project || 'Debe registrar las observaciones',

                })
            }
            res.status(200).send(_data)
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    retriveTeacherProject: async (req, res) => {

        try {
            const user = await User_intranet.findOne({where: {id: req.userId}});
            let data = await Model.findOne({
                // attributes: ['id'],
                where: {
                    id: req.params.id_project
                },
                include: [
                    {
                        model: Project_round,
                        as: 'Project_round'
                    },
                    {
                        model: Program,
                        as: 'Program'
                    },
                    {
                        attributes: ['id'],
                        model: Student,
                        as: 'Student',
                        include: {
                            attributes: ['id', 'document_number', 'email', 'phone', 'name', 'paternal', 'maternal'],
                            model: Person,
                            as: 'Person'
                        },
                    },
                    {
                        attributes: ['id', 'document_number', 'email', 'phone', 'name', 'paternal', 'maternal'],
                        model: Person,
                        as: 'Adviser'
                    },
                    {
                        attributes: ['id', 'document_number', 'email', 'phone', 'name', 'paternal', 'maternal'],
                        model: Person,
                        as: 'President'
                    },
                    {
                        attributes: ['id', 'document_number', 'email', 'phone', 'name', 'paternal', 'maternal'],
                        model: Person,
                        as: 'Vocal'
                    },
                    {
                        attributes: ['id', 'document_number', 'email', 'phone', 'name', 'paternal', 'maternal'],
                        model: Person,
                        as: 'Secretary'
                    }
                ]


            });


            let president_round = await Project_round.findAll({                // attributes: ['id'],
                where: {id_project: req.params.id_project, type: 'Presidente'},
                order: [['round', 'asc']],
            })
            let vocal_round = await Project_round.findAll({                // attributes: ['id'],
                where: {id_project: req.params.id_project, type: 'Vocal'},
                order: [['round', 'asc']],
            })
            let secretary_round = await Project_round.findAll({                // attributes: ['id'],
                where: {id_project: req.params.id_project, type: 'Secretario'},
                order: [['round', 'asc']],
            })


            let charge = '';


            if (data.id_president == user.id_person) {
                charge = 'Presidente'
            }
            if (data.id_vocal == user.id_person) {
                charge = 'Vocal'
            }
            if (data.id_secretary == user.id_person) {
                charge = 'Secretario'
            }
            let _data = {}
            _data = {
                id: data.id,
                charge: charge,
                project_round: data.Project,
                program: data.Program && data.Program.denomination,
                student: data.Student && data.Student.Person.name + ' ' + data.Student.Person.paternal + ' ' + data.Student.Person.maternal,
                student_document: data.Student && data.Student.Person.document_number || 'No def.',
                student_email: data.Student && data.Student.Person.email || 'No def.',
                student_phone: data.Student && data.Student.Person.phone || 'Telf. no def.',

                observation: data.observation,
                project_file: data.project_file,
                project_name: data.project_name,
                resolution_jury: data.resolution_jury,
                resolution_jury_date: data.resolution_jury_date,
                resolution_jury_file: data.resolution_jury_file,
                state: data.Project || 'Debe registrar las observaciones',


                adviser: data.Adviser && data.Adviser.name + ' ' + data.Adviser.paternal + ' ' + data.Adviser.maternal + ' - (' + data.Adviser.phone + ')',
                president: data.President && data.President.name + ' ' + data.President.paternal + ' ' + data.President.maternal + '(Presidente)' + ' - (' + data.President.phone + ')',
                secretary: data.Secretary && data.Secretary.name + ' ' + data.Secretary.paternal + ' ' + data.Secretary.maternal + '(Secretario)' + ' - (' + data.Secretary.phone + ')',
                vocal: data.Vocal && data.Vocal.name + ' ' + data.Vocal.paternal + ' ' + data.Vocal.maternal + '(Vocal)' + ' - (' + data.Vocal.phone + ')',
                president_round: president_round,
                vocal_round: vocal_round,
                secretary_round: secretary_round,
            }


            res.status(200).send(_data)
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    createTeacherProjectRound: async (req, res) => {

        let archive = "";
        let tmp_path;
        if (req.files.file) {
            try {

                archive = req.body.file_name + '.' + req.files.file.name.split('.').pop();
                tmp_path = req.files.file.path;
                let target_path = url_project_tesis_document + archive;

                // await fs.rename(tmp_path, target_path);

                await fs.copyFile(tmp_path, target_path);
                await fs.unlink(tmp_path);

            } catch (e) {
                await fs.unlink(tmp_path);
                res.status(444).send(e)
            }

        }


        try {

            await ST.transaction(async (t) => {
                const user = await User_intranet.findOne({where: {id: req.userId}});
                const max = await Project_round.max('id', {paranoid: false}, {transaction: t});

                const maxRound = await Project_round.max('round', {
                    where: {
                        type: req.body.type,
                        id_project: req.body.id_project
                    }
                }, {transaction: t});

                await Project_round.create({
                    id: max + 1,
                    id_project: req.body.id_project,
                    id_person: user.id_person,
                    type: req.body.type,
                    round: maxRound + 1,
                    observation_file: archive,
                    observation_date: moment().format('YYYY-MM-DD'),
                    response_file: '',
                    response_date: '',
                    state: req.body.aproved_project == 'true' ? 'Aprobado' : 'Esperando respuesta del estudiante',

                });
            })
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (e) {
            console.log(e)
        }
    },

    //
    // listTeacherProjectRound: async (req, res) => {
    //     let _data = [];
    //     try {
    //
    //
    //         let president = await Project_round.findAll({                // attributes: ['id'],
    //             where: {id_project: req.params.id_project, type: 'Presidente'},
    //         })
    //         let vocal = await Project_round.findAll({                // attributes: ['id'],
    //             where: {id_project: req.params.id_project, type: 'Vocal'},
    //         })
    //         let secretary = await Project_round.findAll({                // attributes: ['id'],
    //             where: {id_project: req.params.id_project, type: 'Secretario'},
    //         })
    //         res.status(200).send({
    //             president, vocal, secretary
    //         })
    //     } catch (err) {
    //         console.log(err)
    //         res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
    //     }
    // },


    listOnlyProjectRound: async (req, res) => {

        try {


            let president = await Project_round.findAll({                // attributes: ['id'],
                where: {id_project: req.params.id_project, type: 'Presidente'},
                order: [['round', 'asc']],
            }) || [];
            let vocal = await Project_round.findAll({                // attributes: ['id'],
                where: {id_project: req.params.id_project, type: 'Vocal'},
                order: [['round', 'asc']],
            }) || [];
            let secretary = await Project_round.findAll({                // attributes: ['id'],
                where: {id_project: req.params.id_project, type: 'Secretario'},
                order: [['round', 'asc']],
            }) || [];
            res.status(200).send({
                president, vocal, secretary
            })
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },

//    ESTUDENT APIS

    listStudentProject: async (req, res) => {
        let _data = [];
        try {
            const user = await User_intranet.findOne({
                where: {id: req.userId}
            })

            const students = await Student.findAll({
                where: {id_person: user.id_person}
            })
            let student = []
            for (let i = 0; i < students.length; i++) {
                student.push(students[i].id)
            }
            //BUSCAMOS LOS PROJECTOS
            let data = await Model.findAll({
                // attributes: ['id'],
                where: {
                    id_student: {[Op.or]: student}
                },
                include: [
                    {
                        model: Project_round,
                        as: 'Project_rounds'
                    },
                    {
                        model: Program,
                        as: 'Program'
                    },

                    {
                        model: Person,
                        as: 'President'
                    },
                    {
                        model: Person,
                        as: 'Vocal'
                    },
                    {
                        model: Person,
                        as: 'Secretary'
                    }
                ]


            })


            for (let i = 0; i < data.length; i++) {


                _data.push({
                    id: data[i].id,
                    project_round: data[i].Project,
                    program: data[i].Program && data[i].Program.denomination,
                    observation: data[i].observation,
                    project_file: data[i].project_file,
                    project_name: data[i].project_name,
                    resolution_jury: data[i].resolution_jury,
                    resolution_jury_date: data[i].resolution_jury_date,
                    resolution_jury_file: data[i].resolution_jury_file,
                    state: data[i].Project || 'Debe registrar las observaciones',

                })
            }
            res.status(200).send(_data)
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    updateStudentProjectRound: async (req, res) => {

        let archive = "";
        let tmp_path;
        if (req.files.file) {
            try {

                archive = req.body.file_name + '.' + req.files.file.name.split('.').pop();
                tmp_path = req.files.file.path;
                let target_path = url_project_tesis_document + archive;

                // await fs.rename(tmp_path, target_path);

                await fs.copyFile(tmp_path, target_path);
                await fs.unlink(tmp_path);

            } catch (e) {
                await fs.unlink(tmp_path);
                res.status(444).send({message: message.ERROR_TRANSACTION, error: e})
            }

        }


        try {

            await ST.transaction(async (t) => {

                const data = await Project_round.findOne({
                    where: {
                        id: req.body.id_project_round
                    }
                });
                await data.update({
                    response_file: archive,
                    response_date: moment().format('YYYY-MM-DD'),
                    state: 'Observación levantada'
                }, {transaction: t});
            })
            res.status(200).send({message: message.UPDATED_OK})
        } catch (e) {
            console.log(e)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: e})
        }
    },
};
