const Sequelize = require('sequelize');

const bcrypt = require('bcryptjs');

const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);

const uuid = require('uuid');

const Op = Sequelize.Op;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const fs = require('fs').promises;
const Model = require('../../models').Person;
const ST = Model.sequelize;
const Ubigeo = require('../../models').Ubigeo;
const District = require('../../models').District;
const Province = require('../../models').Province;
const Department = require('../../models').Department;
const Country = require('../../models').Country;
const Teacher = require('../../models').Teacher;
const Student = require('../../models').Student;
const Mention = require('../../models').Mention;
const Programs = require('../../models').Programs;
const Charge = require('../../models').Charge;
const Organic_unit = require('../../models').Organic_unit;
const Contract_type = require('../../models').Contract_type;
const Administrative = require('../../models').Administrative;
const Admission_plan = require('../../models').Admission_plan;
const Cost_admission_plan = require('../../models').Cost_admission_plan;
const Work_plan = require('../../models').Work_plan;
const Payment = require('../../models').Payment;
const Movement = require('../../models').Movement;
const Academic_degree = require('../../models').Academic_degree;
const Plan = require('../../models').Plan;
// const Student_state = require('../../models').Student_state;

const Civil_status = require('../../models').Civil_status;
const User = require('../../models').User;
const Concept = require('../../models').Concept;
const Program = require('../../models').Programs;
const moment = require('moment');
const message = require('../../messages');

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'soporte@unsm.edu.pe',
        pass: 'no se cualquier cosa'
    }
});

const URL_PLUBLIC = require("../Abox").URL_PLUBLIC;
const url_person_photography = URL_PLUBLIC + 'person/photography/';
const url_person_voucher = URL_PLUBLIC + 'person/voucher/';

module.exports = {
    searchStudentProgram: async (req, res) => {
        const param = req.params.parameter.split(" ");
        let typeParam = {document_number: {[Op.iLike]: '%' + param[0] + '%'}}
        const valAcept = /^[0-9]+$/;

        if (!String(param).match(valAcept)) {
            typeParam = Sequelize.where(
                Sequelize.fn("CONCAT",
                    Sequelize.col("name"), " ",
                    Sequelize.col("paternal"), " ",
                    Sequelize.col("maternal"),
                ), {[Op.iLike]: '%' + req.params.parameter + '%'},
            )
        }
        try {
            const data = await Model.findAll({
                attributes: ['id', 'document_number', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: typeParam,
                include: {
                    where: {id_program: req.params.id_program},
                    model: Student,
                    as: 'Student'
                }
            })
            res.status(200).send(data)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },

    searchStudentString: function (req, res) {
        return Model
            .findAll({
                attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: {
                    [Op.or]: [
                        {name: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {maternal: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {paternal: {[Op.iLike]: '%' + req.params.parameter + '%'}}
                    ],
                },
                include: [
                    {
                        attributes: ['id'],
                        required: true,
                        model: User,
                        as: 'User',
                        include: {
                            attributes: ['id', 'id_organic_unit', 'id_role'],
                            where: {id_organic_unit: req.params.id_organic_unit},
                            required: true,
                            model: Student,
                            as: 'Student_organic',
                            include: {
                                attributes: ['id', 'denomination', 'state'],
                                model: Mention,
                                as: "Mention",
                                include: {
                                    attributes: ['id', 'denomination', 'state'],
                                    model: Programs,
                                    as: "Programs"
                                }
                            }
                        }
                    }
                ]

            })
            .then(record => {
                if (!record) {
                    return res.status(404).send({message: message});
                }
                return res.status(200).send(record);
            })
            .catch(error => res.status(400).send(error));
    },
    searchStudentStringInscription: function (req, res) {
        return Model
            .findAll({
                attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: {
                    [Op.or]: [
                        {name: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {maternal: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {paternal: {[Op.iLike]: '%' + req.params.parameter + '%'}}
                    ],
                },
                include: [
                    {
                        attributes: ['id'],
                        required: true,
                        where: {student_state: true},
                        model: User,
                        as: 'User',
                    }
                ]

            })
            .then(record => {
                if (!record) {
                    return res.status(404).send({message: message});
                }
                return res.status(200).send(record);
            })
            .catch(error => res.status(400).send(error));
    },
    //M=>persona => busca personas por texto todos los tipos
    searchPersonString: function (req, res) {
        return Model
            .findAll({
                attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: {
                    [Op.or]: [
                        {name: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {maternal: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {paternal: {[Op.iLike]: '%' + req.params.parameter + '%'}}
                    ],
                },
                include: [
                    {
                        model: User,
                        as: 'User'
                    }
                ]

            })
            .then(record => {
                let data = [];
                for (let i = 0; i < record.length; i++) {
                    if (record[i].Teacher_organic !== null || record[i].Student_organic !== null || record[i].Administrative_organic !== null) {
                        data.push(record[i]);
                    }
                }
                if (!record) {
                    return res.status(404).send({
                        message: message
                    });
                }
                return res.status(200).send(data);
            })
            .catch(error => res.status(400).send(error));
    },
    //M=>WorkFlow => busca personas por texto de tipo docente segun la unidad organica
    searchTeacherString: function (req, res) {
        return Model
            .findAll({

                attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: {
                    [Op.or]: [
                        {name: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {maternal: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {paternal: {[Op.iLike]: '%' + req.params.parameter + '%'}}
                    ],
                },
                include: {
                    attributes: ['id', 'state'],
                    where: {id_organic_unit: req.params.id, state: true},
                    model: Teacher,
                    as: 'Teacher_organic'
                },
                order: [
                    ['id', 'ASC']
                ],
                // include: includes
            })
            .then(record => {
                if (!record) {
                    return res.status(404).send({
                        message: message
                    });
                }
                return res.status(200).send(record);
            })
            .catch(error => res.status(400).send(error));
    },
    //M=>Persona => devuelve datos de la persona seleccionada
    retrievePerson: function (req, res) {
        return Model
            .findOne({
                attributes: ['id', 'id_civil_status', 'id_ubigeo_birth', 'id_ubigeo_resident', 'photo', 'email', 'document_number', 'name', 'phone', 'cell_phone', 'address', 'paternal', 'maternal', 'gender', 'birth_date', 'state'],
                where: {
                    id: {
                        [Op.eq]: req.params.id
                    }
                },
                include: [
                    {
                        attributes: ['id', 'denomination'],
                        model: Civil_status,
                        as: 'Civil_status'
                    },
                    {
                        attributes: ['id', 'id_parent', 'name'],
                        model: Ubigeo,
                        as: 'Ubigeo_birth',
                        include: {
                            attributes: ['id', 'id_parent', 'name'],
                            model: Ubigeo,
                            as: 'Ubigeo_parent',
                            include: {
                                attributes: ['id', 'id_parent', 'name'],
                                model: Ubigeo,
                                as: 'Ubigeo_parent'
                            }
                        }

                    },
                    {
                        attributes: ['id', 'id_parent', 'name'],
                        model: Ubigeo,
                        as: 'Ubigeo_resident',
                        include: {
                            attributes: ['id', 'id_parent', 'name'],
                            model: Ubigeo,
                            as: 'Ubigeo_parent',
                            include: {
                                attributes: ['id', 'id_parent', 'name'],
                                model: Ubigeo,
                                as: 'Ubigeo_parent'
                            }
                        }

                    },
                    {
                        attributes: ['id', 'student_state', 'teacher_state', 'administrative_state', 'state'],
                        model: User,
                        as: 'User',
                        include: [
                            {
                                required: false,
                                attributes: ['id', 'id_role', 'id_organic_unit', 'state'],
                                where: {id_organic_unit: req.params.id_organic_unit},
                                model: Teacher,
                                as: 'Teacher_organic_one'
                            },
                            {
                                required: false,
                                attributes: ['id', 'id_role', 'id_organic_unit', 'state'],
                                where: {id_organic_unit: req.params.id_organic_unit},
                                model: Student,
                                as: 'Student_organic_one'
                            },
                            {
                                required: false,
                                attributes: ['id', 'id_role', 'id_organic_unit', 'state'],
                                where: {id_organic_unit: req.params.id_organic_unit},
                                model: Administrative,
                                as: 'Administrative_organic_one'
                            }

                        ]
                    }

                ]
            })
            .then(record => {
                if (!record) return res.status(404).send({message: message.RECORD_NOT_FOUND});
                return res.status(200).send(record);
            })
            .catch(error => res.status(400).send(error));
    },
    //M=>Persona => devuelve datos de la persona seleccionada => usuario GOD
    retrievePersonMode: function (req, res) {
        return Model
            .findOne({
                attributes: ['id', 'id_civil_status', 'id_ubigeo_birth', 'id_ubigeo_resident', 'photo', 'email', 'document_number', 'name', 'phone', 'cell_phone', 'address', 'paternal', 'maternal', 'gender', 'birth_date', 'state'],
                where: {
                    id: {
                        [Op.eq]: req.params.id
                    }
                },
                include: [
                    {
                        attributes: ['id', 'denomination'],
                        model: Civil_status,
                        as: 'Civil_status'
                    },
                    {
                        attributes: ['id', 'id_parent', 'name'],
                        model: Ubigeo,
                        as: 'Ubigeo_birth',
                        include: {
                            attributes: ['id', 'id_parent', 'name'],
                            model: Ubigeo,
                            as: 'Ubigeo_parent',
                            include: {
                                attributes: ['id', 'id_parent', 'name'],
                                model: Ubigeo,
                                as: 'Ubigeo_parent'
                            }
                        }

                    },
                    {
                        attributes: ['id', 'id_parent', 'name'],
                        model: Ubigeo,
                        as: 'Ubigeo_resident',
                        include: {
                            attributes: ['id', 'id_parent', 'name'],
                            model: Ubigeo,
                            as: 'Ubigeo_parent',
                            include: {
                                attributes: ['id', 'id_parent', 'name'],
                                model: Ubigeo,
                                as: 'Ubigeo_parent'
                            }
                        }

                    },
                    {
                        attributes: ['id', 'student_state', 'teacher_state', 'administrative_state', 'state'],
                        model: User,
                        as: 'User',
                        include: [
                            {
                                required: false,
                                attributes: ['id', 'id_role', 'id_organic_unit', 'state'],

                                model: Teacher,
                                as: 'Teacher_organic'
                            },
                            {
                                required: false,
                                attributes: ['id', 'id_role', 'id_organic_unit', 'state'],

                                model: Student,
                                as: 'Student_organic'
                            },
                            {
                                required: false,
                                attributes: ['id', 'id_role', 'id_organic_unit', 'state'],

                                model: Administrative,
                                as: 'Administrative_organic'
                            }

                        ]
                    }

                ]
            })
            .then(record => {
                if (!record) return res.status(404).send({message: message.RECORD_NOT_FOUND});
                return res.status(200).send(record);
            })
            .catch(error => res.status(400).send(error));
    },


    //M=>Persona => registrar personas desde el modo administrador => role = !ADMNISTRADOR
    update: async (req, res) => {
        try {
            let personData = [];
            await ST.transaction(async (t) => {
                    let person = await Model.findOne({where: {id: req.params.id}}, {transaction: t});
                    if (person) {
                        personData = await person.update({
                            id_civil_status: req.body.id_civil_status,
                            id_ubigeo_birth: req.body.id_ubigeo_birth,
                            id_ubigeo_resident: req.body.id_ubigeo_resident,
                            email: req.body.email,
                            name: req.body.name,
                            phone: req.body.phone,
                            cell_phone: req.body.cell_phone,
                            address: req.body.address,
                            paternal: req.body.paternal,
                            maternal: req.body.maternal,
                            gender: req.body.gender,
                            birth_date: req.body.birth_date,
                        }, {transaction: t})
                    }
                    if (person) {
                        let userDemi = await User.findOne({where: {id_person: person.id}}, {transaction: t});
                        if (userDemi) {
                            await userDemi.update({
                                student_state: req.body.student_state,
                                teacher_state: req.body.teacher_state,
                                administrative_state: req.body.administrative_state,
                            }, {transaction: t})
                        }
                    }


                }
            );

// In this case, an instance of Model

            res.status(200).send(personData)
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log('error');
            res.status(445).send(err)
        }
    },


    list: function (req, res) {
        return Model
            .findAll({
                    attributes: ['id', 'id_civil_status', 'id_ubigeo_birth', 'id_ubigeo_resident', 'photo', 'email', 'document_number', 'name', 'paternal', 'maternal', 'gender', 'birth_date', 'state'],
                    include: [
                        {
                            attributes: ['id', 'id_parent', 'name'],
                            model: Ubigeo,
                            as: 'Ubigeo_birth',
                            include: {
                                attributes: ['id', 'id_parent', 'name'],
                                model: Ubigeo,
                                as: 'Ubigeo_parent',
                                include: {
                                    attributes: ['id', 'id_parent', 'name'],
                                    model: Ubigeo,
                                    as: 'Ubigeo_parent'
                                }
                            }

                        },
                        {
                            attributes: ['id', 'id_parent', 'name'],
                            model: Ubigeo,
                            as: 'Ubigeo_resident',
                            include: {
                                attributes: ['id', 'id_parent', 'name'],
                                model: Ubigeo,
                                as: 'Ubigeo_parent',
                                include: {
                                    attributes: ['id', 'id_parent', 'name'],
                                    model: Ubigeo,
                                    as: 'Ubigeo_parent'
                                }
                            }

                        }
                    ]
                }
            )
            .then(records => res.status(200).send(records))
            .catch(error => res.status(400).send(error));
    },
    //M=>Persona =>cambiar imagen
    updateImage: async (req, res) => {
        try {
            await ST.transaction(async (t) => {
                let photo = req.body.document_number + '.' + req.files.photo.name.split('.').pop();
                let tmp_path = req.files.photo.path;
                let target_path = url_images + photo;
                fs.rename(tmp_path, target_path, async (err) => {
                    if (err) return res.status(500).send({'message': 'ErrorA al guardar imagen.'});
                    // fs.unlink(tmp_path, async (er) => {
                    //     if (er) return res.status(500).send({'message': 'ErrorB al guardar imagen.'});
                    // });
                });


                let person = await Model.findOne({where: {id: req.params.id}}, {transaction: t});
                if (person) {
                    personData = await person.update({
                        photo: photo
                    }, {transaction: t})
                }
            });
            // In this case, an instance of Model

            res.status(200).send('todo ok')
        } catch (err) {
            // Rollback transaction if any errors were encountered
            console.log('error');
            res.status(445).send(err)
        }
    },

    //M=>Persona =>cambia el estado de la persona
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
                if (!record) return res.status(404).send({message: message.RECORD_NOT_FOUND});
                return record
                    .update({
                        state: !record.state
                    })
                    .then(updated => {

                        res.status(200).send({
                            message: message.UPDATED_OK,
                            record: updated
                        });
                    })
                    .catch((error) => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },


    async searchPersonTeacherAndAdministrative(req, res) {
        try {
            let record = await Model.findAll({
                attributes: ['id', 'document_number', 'email', 'photo', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: {
                    [Op.or]: [
                        {name: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {maternal: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {paternal: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {document_number: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        // {administrative_state: true},
                        // {teacher_state: true}

                    ],

                }

            });

            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async searchPersonAdministrative(req, res) {
        try {
            let record = await Model.findAll({
                attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: {
                    [Op.or]: [
                        {name: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {maternal: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {paternal: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {document_number: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                    ],
                    administrative_state: true,
                },


            });

            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async searchPerson(req, res) {

        const param = req.params.parameter.split(" ");
        let typeParam = {document_number: {[Op.iLike]: '%' + param[0] + '%'}}
        const valAcept = /^[0-9]+$/;

        if (!String(param).match(valAcept)) {
            typeParam = Sequelize.where(
                Sequelize.fn("CONCAT",
                    Sequelize.col("name"), " ",
                    Sequelize.col("paternal"), " ",
                    Sequelize.col("maternal"),
                ), {[Op.iLike]: '%' + req.params.parameter + '%'},
            )


        }
        try {

            let record = await Model.findAll({
                attributes: ['id', 'document_number', 'photo', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: typeParam,


            });

            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async searchPersonStudent(req, res) {

        const param = req.params.parameter.split(" ");
        let typeParam = {document_number: {[Op.iLike]: '%' + param[0] + '%'}}
        const valAcept = /^[0-9]+$/;

        if (!String(param).match(valAcept)) {
            typeParam = Sequelize.where(
                Sequelize.fn("CONCAT",
                    Sequelize.col("name"), " ",
                    Sequelize.col("paternal"), " ",
                    Sequelize.col("maternal"),
                ), {[Op.iLike]: '%' + req.params.parameter + '%'},
            )


        }
        try {

            let record = await Model.findAll({
                attributes: ['id', 'document_number', 'photo', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: typeParam,
                include: {
                    required: true,
                    attributes: ['id', 'id_admission_plan', 'type', 'id_organic_unit'],
                    model: Student,
                    as: "Student",
                    include: [
                        {
                            required: true,
                            attributes: ['id', 'denomination'],
                            model: Program,
                            as: "Program"
                        },
                        {
                            required: true,
                            attributes: ['id', 'description'],
                            model: Admission_plan,
                            as: "Admission_plan"
                        }
                    ]
                }


            });

            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async searchPersonTeacher(req, res) {
        try {
            let record = await Model.findAll({
                attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: {
                    [Op.or]: [
                        {name: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {maternal: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {paternal: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        {document_number: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                    ],
                    teacher_state: true,
                }


            });

            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async searchPersonTeacherByOrganicUnit(req, res) {
        try {
            let record = await Teacher.findAll({

                where: {
                    id_organic_unit: req.body.id_organic_unit,
                    // date_end: {[Op.lte]: moment().format()}
                },
                attributes: ['id', 'date_start', 'date_end'],
                include: {
                    attributes: ['id', 'document_number', 'photo', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                    where: {
                        [Op.or]: [
                            {name: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                            {maternal: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                            {paternal: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                            {document_number: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                        ],
                        teacher_state: true,
                    },
                    model: Model,
                    as: 'Person',
                }


            });

            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    searchPersonStudenUnitOrganic: async (req, res) => {

        const param = req.params.parameter.split(" ");
        let typeParam = {document_number: {[Op.iLike]: '%' + param[0] + '%'}}
        const valAcept = /^[0-9]+$/;

        if (!String(param).match(valAcept)) {
            typeParam = Sequelize.where(
                Sequelize.fn("CONCAT",
                    Sequelize.col("name"), " ",
                    Sequelize.col("paternal"), " ",
                    Sequelize.col("maternal"),
                ), {[Op.iLike]: '%' + req.params.parameter + '%'},
            )


        }

        try {
            let record = await Model.findAll({
                attributes: ['id', 'document_number', 'email', 'photo', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: typeParam,
                include: {
                    attributes: ['id', 'id_admission_plan', 'type'],
                    where: {id_organic_unit: req.body.id_organic_unit},
                    model: Student,
                    as: "Student",
                    include: [
                        {
                            required: true,
                            attributes: ['id', 'denomination'],
                            model: Program,
                            as: "Program"
                        },
                        {
                            required: true,
                            attributes: ['id', 'description'],
                            model: Admission_plan,
                            as: "Admission_plan"
                        }
                    ]
                }
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    searchPersonStudenUnitOrganicAll: async (req, res) => {

        const param = req.params.parameter.split(" ");
        let typeParam = {document_number: {[Op.iLike]: '%' + param[0] + '%'}}
        const valAcept = /^[0-9]+$/;

        if (!String(param).match(valAcept)) {
            typeParam = Sequelize.where(
                Sequelize.fn("CONCAT",
                    Sequelize.col("name"), " ",
                    Sequelize.col("paternal"), " ",
                    Sequelize.col("maternal"),
                ), {[Op.iLike]: '%' + req.params.parameter + '%'},
            )


        }

        try {
            let record = await Model.findAll({
                attributes: ['id', 'document_number', 'email', 'photo', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: typeParam
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },

    // MODUDOLO ADMINISTRATIVOS
    async createPersonAdministrative(req, res) {
        let archive = "";
        let tmp_path;
        if (req.files.file) {
            try {

                archive = req.body.document_number + '.' + req.files.file.name.split('.').pop();
                tmp_path = req.files.file.path;
                let target_path = url_person_photography + archive;

                await fs.rename(tmp_path, target_path);

            } catch (e) {
                await fs.unlink(tmp_path);
                res.status(444).send(e)
            }

        }
        try {


            await ST.transaction(async (t) => {
                    //REGISTER PERSON
                    let person = await Model.findOne({where: {document_number: req.body.document_number}}, {transaction: t});
                    if (person) throw "Ya existen registros con ese numero de DNI";
                    let photo = archive;


                    let max = await Model.max('id', {paranoid: false}, {transaction: t});
                    let personData = await Model.create({
                        id: max + 1,
                        id_civil_status: req.body.id_civil_status,
                        id_ubigeo_birth: req.body.id_ubigeo_birth,
                        id_ubigeo_resident: req.body.id_ubigeo_resident,
                        photo: photo,
                        code: req.body.code,
                        email: req.body.email,
                        document_number: req.body.document_number,
                        name: req.body.name,
                        phone: req.body.phone,
                        cell_phone: req.body.cell_phone,
                        address: req.body.address,
                        paternal: req.body.paternal,
                        maternal: req.body.maternal,
                        gender: req.body.gender,
                        birth_date: req.body.birth_date,
                        administrative_state: true,
                    }, {transaction: t});

                    let maxAdministrative = await Administrative.max('id', {paranoid: false}, {transaction: t});
                    await Administrative.create({
                        id: maxAdministrative + 1,
                        id_person: personData.id,
                        id_organic_unit: req.body.id_organic_unit,
                        id_charge: req.body.id_charge,
                        id_contract_type: req.body.id_contract_type,
                        date_start: req.body.date_start,
                        date_end: req.body.date_end,
                    }, {transaction: t});
                }
            );
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, err: err})
        }

    },
    async listPersonAdministrativeGOD(req, res) {
        try {
            let record = await Model.findAll({
                attributes: ['id', 'document_number', 'email', 'photo', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name'], 'administrative_state'],
                // where: {"administrative_state": true},
                include: {
                    attributes: ['id', 'id_charge', 'id_organic_unit', 'id_contract_type', 'date_start', 'date_end', 'state'],
                    required: true,
                    model: Administrative,
                    as: "Administratives",
                    include: [
                        {
                            attributes: ['id', 'denomination'],
                            model: Charge,
                            as: "Charge"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Organic_unit,
                            as: "Organic_unit"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Contract_type,
                            as: "Contract_type"
                        }
                    ]
                }
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async listPersonAdministrative(req, res) {
        try {
            let record = await Model.findAll({
                attributes: ['id', 'id_civil_status', 'id_ubigeo_birth', 'id_ubigeo_resident', 'document_number', 'name', 'paternal', 'maternal', 'gender', 'email', 'birth_date', 'photo', 'cell_phone', 'address', 'administrative_state'],
                // where: {"administrative_state": true},
                include: {
                    attributes: ['id', 'id_charge', 'id_organic_unit', 'id_contract_type', 'date_start', 'date_end', 'state'],
                    required: true,
                    where: {id_organic_unit: req.body.id_organic_unit},
                    model: Administrative,
                    as: "Administratives",
                    include: [
                        {
                            attributes: ['id', 'denomination'],
                            model: Charge,
                            as: "Charge"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Organic_unit,
                            as: "Organic_unit"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Contract_type,
                            as: "Contract_type"
                        }
                    ]
                }
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async retrivePersonAdministrative(req, res) {
        try {
            let record = await Model.findOne({
                where: {id: req.params.id},
                attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                include: {
                    attributes: ['id', 'id_charge', 'id_organic_unit', 'id_contract_type', 'date_start', 'date_end', 'state'],
                    where: {id_organic_unit: req.body.id_organic_unit, state: true},
                    required: true,
                    model: Administrative,
                    as: "Administratives",
                    include: [
                        {
                            attributes: ['id', 'denomination'],
                            model: Charge,
                            as: "Charge"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Organic_unit,
                            as: "Organic_unit"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Contract_type,
                            as: "Contract_type"
                        }
                    ]
                }
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async retrivePersonAdministrativeGOD(req, res) {
        try {
            let record = await Model.findOne({
                where: {id: req.params.id},
                attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                include: {
                    attributes: ['id', 'id_charge', 'id_organic_unit', 'id_contract_type', 'date_start', 'date_end', 'state'],
                    required: true,
                    model: Administrative,
                    as: "Administratives",
                    include: [
                        {
                            attributes: ['id', 'denomination'],
                            model: Charge,
                            as: "Charge"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Organic_unit,
                            as: "Organic_unit"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Contract_type,
                            as: "Contract_type"
                        }
                    ]
                }
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },


    // MODULO DOCENTES
    async createPersonTeacher(req, res) {
        let archive = "";
        let tmp_path;
        if (req.files.file) {
            try {

                archive = req.body.document_number + '.' + req.files.file.name.split('.').pop();
                tmp_path = req.files.file.path;
                let target_path = url_person_photography + archive;

                await fs.rename(tmp_path, target_path);

            } catch (e) {
                await fs.unlink(tmp_path);
                res.status(444).send(e)
            }

        }
        try {
            await ST.transaction(async (t) => {
                //REGISTER PERSON
                let person = await Model.findOne({where: {document_number: req.body.document_number}}, {transaction: t});
                if (person) throw "Ya existen registros con ese numero de DNI";
                let photo = archive;


                let max = await Model.max('id', {paranoid: false}, {transaction: t});
                let personData = await Model.create({
                    id: max + 1,
                    id_civil_status: req.body.id_civil_status,
                    id_ubigeo_birth: req.body.id_ubigeo_birth,
                    id_ubigeo_resident: req.body.id_ubigeo_resident,
                    photo: photo,
                    code: req.body.code,
                    email: req.body.email,
                    document_number: req.body.document_number,
                    name: req.body.name,
                    phone: req.body.phone,
                    cell_phone: req.body.cell_phone,
                    address: req.body.address,
                    paternal: req.body.paternal,
                    maternal: req.body.maternal,
                    gender: req.body.gender,
                    birth_date: req.body.birth_date,
                    teacher_state: true
                }, {transaction: t});

                let maxTeacher = await Teacher.max('id', {paranoid: false}, {transaction: t});
                await Teacher.create({
                    id: maxTeacher + 1,
                    id_person: personData.id,
                    id_organic_unit: req.body.id_organic_unit,
                    id_charge: req.body.id_charge,
                    id_contract_type: req.body.id_contract_type,
                    date_start: req.body.date_start,
                    date_end: req.body.date_end,
                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (err) {
            console.log(err);
            res.status(445).send({message: err, err: err})
        }

    },
    async listPersonTeacherGOD(req, res) {
        try {
            let record = await Model.findAll({
                attributes: ['id', 'document_number', 'email', 'photo', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name'], 'teacher_state'],
                where: {"teacher_state": true},
                include: {
                    attributes: ['id', 'id_charge', 'id_organic_unit', 'id_contract_type', 'date_start', 'date_end', 'state'],
                    required: true,
                    model: Teacher,
                    as: "Teachers",
                    include: [
                        {
                            attributes: ['id', 'denomination'],
                            model: Charge,
                            as: "Charge"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Organic_unit,
                            as: "Organic_unit"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Contract_type,
                            as: "Contract_type"
                        }
                    ]
                }
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async listPersonTeacher(req, res) {
        try {
            let record = await Model.findAll({
                attributes: ['id', 'id_civil_status', 'id_ubigeo_birth', 'id_ubigeo_resident', 'document_number', 'name', 'paternal', 'maternal', 'gender', 'email', 'birth_date', 'photo', 'cell_phone', 'address', 'teacher_state'],
                where: {"teacher_state": true},
                include: {
                    attributes: ['id', 'id_charge', 'id_organic_unit', 'id_contract_type', 'date_start', 'date_end', 'state'],
                    required: true,
                    where: {id_organic_unit: req.body.id_organic_unit},
                    model: Teacher,
                    as: "Teachers",
                    include: [
                        {
                            attributes: ['id', 'denomination'],
                            model: Charge,
                            as: "Charge"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Organic_unit,
                            as: "Organic_unit"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Contract_type,
                            as: "Contract_type"
                        }
                    ]
                }
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }
    },
    async retrivePersonTeacher(req, res) {
        try {
            let record = await Model.findOne({
                where: {id: req.params.id},
                attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                include: {
                    attributes: ['id', 'id_charge', 'id_organic_unit', 'id_contract_type', 'date_start', 'date_end', 'state'],
                    where: {id_organic_unit: req.body.id_organic_unit},
                    required: false,
                    model: Teacher,
                    as: "Teachers",
                    include: [
                        {
                            attributes: ['id', 'denomination'],
                            model: Charge,
                            as: "Charge"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Organic_unit,
                            as: "Organic_unit"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Contract_type,
                            as: "Contract_type"
                        }
                    ]
                }
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async retrivePersonTeacherGOD(req, res) {
        try {
            let record = await Model.findOne({
                where: {id: req.params.id},
                attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                include: {
                    attributes: ['id', 'id_charge', 'id_organic_unit', 'id_contract_type', 'date_start', 'date_end', 'state'],
                    required: true,
                    model: Teacher,
                    as: "Teachers",
                    include: [
                        {
                            attributes: ['id', 'denomination'],
                            model: Charge,
                            as: "Charge"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Organic_unit,
                            as: "Organic_unit"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Contract_type,
                            as: "Contract_type"
                        }
                    ]
                }
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },

    // MODUDOLO ESTUDIANTES
    async createPersonStudent(req, res) {
        let archive = "";

        let tmp_path;

        if (req.files.file) {
            try {

                archive = req.body.document_number + '.' + req.files.file.name.split('.').pop();
                tmp_path = req.files.file.path;
                let target_path = url_person_photography + archive;
                await fs.rename(tmp_path, target_path);

            } catch (e) {
                await fs.unlink(tmp_path);
                res.status(444).send(e)
            }

        }

        try {
            await ST.transaction(async (t) => {
                    //REGISTER PERSON

                    let person = await Model.findOne({where: {document_number: req.body.document_number}}, {transaction: t});
                    if (person) throw "Ya existen registros con ese numero de DNI";


                    let photo = archive;


                    let max = await Model.max('id', {paranoid: false}, {transaction: t});
                    let personData = await Model.create({
                        id: max + 1,
                        id_civil_status: req.body.id_civil_status,
                        id_ubigeo_birth: req.body.id_ubigeo_birth,
                        id_ubigeo_resident: req.body.id_ubigeo_resident,
                        photo: photo,
                        code: req.body.code,
                        email: req.body.email,
                        document_number: req.body.document_number,
                        name: req.body.name,
                        phone: req.body.phone,
                        cell_phone: req.body.cell_phone,
                        address: req.body.address,
                        paternal: req.body.paternal,
                        maternal: req.body.maternal,
                        gender: req.body.gender,
                        birth_date: req.body.birth_date,
                        student_state: true,
                    }, {transaction: t});
                    //CREATE STUDENT****************************************************
                    let maxStudent = await Student.max('id', {paranoid: false}, {transaction: t});
                    const studentData = await Student.create({
                        id: maxStudent + 1,
                        id_person: personData.id,
                        id_organic_unit: req.body.id_organic_unit,
                        id_plan: req.body.id_plan,
                        id_admission_plan: req.body.id_admission_plan,
                        id_cost_admission: req.body.id_cost_admission,
                        id_concept: req.body.id_concept,
                        id_program: req.body.id_program,
                        discount: req.body.discount,
                        type: "Estudiante"
                    }, {transaction: t});
                    //CREATE PAYMENT****************************************************
                    let costAdmissionPlan = await Cost_admission_plan.findByPk(req.body.id_cost_admission);
                    let maxPayment = await Payment.max('id', {paranoid: false}, {transaction: t});
                    await Payment.create({
                        id: maxPayment + 1,
                        id_student: studentData.id,
                        id_organic_unit: req.body.id_organic_unit,
                        id_program: req.body.id_program,
                        id_cost_admission: costAdmissionPlan.id,
                        id_concept: req.body.id_concept,
                        id_semester: req.body.id_process,
                        amount: costAdmissionPlan.amount,
                        payment_date: req.body.payment_date,
                        denomination: "Inscripción",
                        order_number: 1,
                        generate: 0,//0 por que no se genera documentos con este concepto
                        type: 'Pendiente',
                    }, {transaction: t});

                    // //CREATE STUDEN_STATE****************************************************
                    // let maxStudentState = await Student_state.max('id', {paranoid: false}, {transaction: t});
                    // await Student_state.create({
                    //     id: maxStudentState + 1,
                    //     id_student: studentData.id,
                    //     id_process: req.body.id_process,
                    //     description: "Inscrito",
                    //     code: 1,
                    //
                    // }, {transaction: t});
                }
            );
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, err: err})
        }

    },
    async listPersonStudentGOD(req, res) {
        let record = [];
        let temp = [];
        try {
            record = await Model.findAll({
                attributes: ['id', 'document_number', 'email', 'photo', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name'], 'student_state'],
                where: {"student_state": true},
                include: {
                    attributes: ["id", "id_person", "id_organic_unit", "id_plan", "id_admission_plan", "id_work_plan", "type", "state"],
                    required: true,
                    model: Student,
                    as: "Students",
                    include: {
                        attributes: ['id', 'denomination'],
                        model: Organic_unit,
                        as: "Organic_unit"
                    }


                },

            });
            record.map(r => {
                let denomination = "";
                r.Students.map(k =>
                    denomination = denomination + " / " + k.Organic_unit.denomination
                );
                temp.push(
                    {
                        "id": r.id,
                        "document_number": r.document_number,
                        "email": r.email,
                        "photo": r.photo,
                        "name": r.name,
                        "student_state": r.student_state,
                        "Organic_unit": denomination

                    }
                )


            });
            res.status(200).send(temp)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async listPersonStudent(req, res) {
        let record = [];
        let temp = [];
        try {
            record = await Model.findAll({
                attributes: ['id', 'document_number', 'email', 'photo', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name'], 'student_state'],
                where: {"student_state": true},
                include: {
                    attributes: ["id", "id_person", "id_organic_unit", "id_plan", "id_admission_plan", "id_work_plan", "type", "state"],
                    required: true,
                    where: {id_organic_unit: req.body.id_organic_unit},
                    model: Student,

                    as: "Students",
                    include: {
                        attributes: ['id', 'denomination'],
                        model: Organic_unit,
                        as: "Organic_unit"
                    }


                },

            });
            record.map(r => {
                let denomination = "";
                r.Students.map(k =>
                    denomination = denomination + " / " + k.Organic_unit.denomination
                );
                temp.push(
                    {
                        "id": r.id,
                        "document_number": r.document_number,
                        "email": r.email,
                        "photo": r.photo,
                        "name": r.name,
                        "student_state": r.student_state,
                        "Organic_unit": denomination

                    }
                )


            });
            res.status(200).send(temp)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async retrivePersonStudent(req, res) {

        try {
            let record = await Model.findOne({
                where: {id: req.params.id},
                attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                include: {
                    // attributes: ['id', 'id_charge', 'id_organic_unit', 'id_contract_type', 'date_start', 'date_end', 'state'],
                    // required: true,
                    where: {id_organic_unit: req.body.id_organic_unit, state: true},
                    model: Student,
                    as: "Students",
                    include: [
                        {
                            attributes: ['id', 'denomination'],
                            model: Programs,
                            as: "Program"
                        },
                        {
                            attributes: ['id', 'id_concept', 'id_cost_admission', 'payment_date', 'order_number', 'denomination', 'amount', 'type', 'state'],
                            where: {order_number: 1},
                            model: Payment,
                            as: "Payment"
                        },
                        {
                            attributes: ['id', 'id_student', 'id_user', 'observation', 'state', 'denomination', 'type', 'updated_at', 'voucher_amount', 'voucher_code', 'voucher_date', 'voucher_url'],
                            model: Movement,
                            as: "Movement"
                        },
                        {
                            attributes: ['id', 'description'],
                            model: Plan,
                            as: "Plan"
                        },
                        {
                            attributes: ['id', 'description'],
                            model: Admission_plan,
                            as: "Admission_plan"
                        },

                        {
                            attributes: ['id', 'description'],
                            model: Work_plan,
                            as: "Work_plan"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Organic_unit,
                            as: "Organic_unit"
                        },
                        {
                            attributes: ['denomination'],
                            model: Concept,
                            as: "Concept"
                        },
                    ]
                },

            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async retrivePersonStudentGOD(req, res) {
        try {
            let record = await Model.findOne({
                where: {id: req.params.id},
                attributes: ['id', 'document_number', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                include: {
                    // attributes: ['id', 'id_charge', 'id_organic_unit', 'id_contract_type', 'date_start', 'date_end', 'state'],
                    // required: true,
                    model: Student,
                    as: "Students",
                    include: [
                        {
                            attributes: ['id', 'denomination'],
                            model: Programs,
                            as: "Program"
                        },
                        {
                            attributes: ['id', 'id_concept', 'id_cost_admission', 'payment_date', 'order_number', 'denomination', 'amount', 'type', 'state'],
                            where: {order_number: 1},
                            model: Payment,
                            as: "Payment"
                        },
                        {
                            attributes: ['id', 'id_student', 'id_user', 'observation', 'state', 'denomination', 'type', 'updated_at', 'voucher_amount', 'voucher_code', 'voucher_date', 'voucher_url'],
                            model: Movement,
                            as: "Movement"
                        },
                        {
                            attributes: ['id', 'description'],
                            model: Plan,
                            as: "Plan"
                        },
                        {
                            attributes: ['id', 'description'],
                            model: Admission_plan,
                            as: "Admission_plan"
                        },

                        {
                            attributes: ['id', 'description'],
                            model: Work_plan,
                            as: "Work_plan"
                        },
                        {
                            attributes: ['id', 'denomination'],
                            model: Organic_unit,
                            as: "Organic_unit"
                        },
                        {
                            attributes: ['denomination'],
                            model: Concept,
                            as: "Concept"
                        },
                    ]
                },

            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },

    // MODULO PROFILE
    async createPersonProfile(req, res) {
        let archive = "";
        let tmp_path;
        if (req.files.file) {
            try {

                archive = req.body.document_number + '.' + req.files.file.name.split('.').pop();
                tmp_path = req.files.file.path;
                let target_path = url_person_photography + archive;

                await fs.rename(tmp_path, target_path);

            } catch (e) {
                await fs.unlink(tmp_path);
                res.status(444).send(e)
            }

        }


        try {
            await ST.transaction(async (t) => {
                //REGISTER PERSON
                let person = await Model.findOne({where: {document_number: req.body.document_number}}, {transaction: t});
                if (person) throw "Ya existen registros con ese numero de DNI";
                let photo = archive;


                let max = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: max + 1,
                    id_civil_status: req.body.id_civil_status,
                    id_ubigeo_birth: req.body.id_ubigeo_birth,
                    id_ubigeo_resident: req.body.id_ubigeo_resident,
                    photo: photo,
                    code: req.body.code,
                    email: req.body.email,
                    document_number: req.body.document_number,
                    name: req.body.name,
                    phone: req.body.phone,
                    cell_phone: req.body.cell_phone,
                    address: req.body.address,
                    paternal: req.body.paternal,
                    maternal: req.body.maternal,
                    gender: req.body.gender,
                    birth_date: req.body.birth_date
                }, {transaction: t});

            });
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (err) {
            console.log(err);
            res.status(445).send({message: err, err: message.ERROR_TRANSACTION})
        }

    },
    async updatePersonProfile(req, res) {
        let archive = "";
        let tmp_path;
        if (req.files.file) {
            try {

                archive = req.body.document_number + '.' + req.files.file.name.split('.').pop();
                tmp_path = req.files.file.path;
                let target_path = url_person_photography + archive;

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
                //REGISTER PERSON
                let person = await Model.findByPk(req.params.id);

                if (!person) throw "Registro no encontrado";
                let photo = archive !== "" ? archive : person.photo;


                await person.update({

                    id_civil_status: req.body.id_civil_status,
                    id_ubigeo_birth: req.body.id_ubigeo_birth,
                    id_ubigeo_resident: req.body.id_ubigeo_resident,
                    photo: photo,
                    code: req.body.code,
                    email: req.body.email,
                    document_number: req.body.document_number,
                    name: req.body.name,
                    phone: req.body.phone,
                    cell_phone: req.body.cell_phone,
                    address: req.body.address,
                    paternal: req.body.paternal,
                    maternal: req.body.maternal,
                    gender: req.body.gender,
                    birth_date: req.body.birth_date,

                }, {transaction: t});

            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            console.log(err);
            res.status(445).send({message: err, err: message.ERROR_TRANSACTION})
        }

    },
    async listPersonProfileGOD(req, res) {
        try {
            let record = await Model.findAll({
                attributes: ['id', 'document_number', 'address', 'gender', 'birth_date', 'phone', 'email', 'photo', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name'], 'updated_at'],
                order: [['updated_at', 'desc']]
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async listPersonProfile(req, res) {
        try {
            let record = await Model.findAll({
                attributes: ['id', 'document_number', 'address', 'gender', 'birth_date', 'phone', 'email', 'photo', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name'], 'updated_at'],
                order: [['updated_at', 'desc']]

            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }
    },
    async retrivePersonProfile(req, res) {
        try {
            let record = await Model.findOne({
                where: {id: req.params.id},
                include: [
                    {
                        attributes: ['id', 'description'],
                        model: District,
                        as: "Districts_birth",
                        include: {
                            attributes: ['id', 'description'],
                            model: Province,
                            as: "Province",
                            include: {
                                attributes: ['id', 'description'],
                                model: Department,
                                as: "Department",
                                include: {
                                    attributes: ['id', 'description'],
                                    model: Country,
                                    as: "Country"
                                }
                            }
                        }

                    },
                    {
                        attributes: ['id', 'description'],
                        model: District,
                        as: "Districts_reside",
                        include: {
                            attributes: ['id', 'description'],
                            model: Province,
                            as: "Province",
                            include: {
                                attributes: ['id', 'description'],
                                model: Department,
                                as: "Department",
                                include: {
                                    attributes: ['id', 'description'],
                                    model: Country,
                                    as: "Country"
                                }
                            }
                        }

                    },
                ]
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async retrivePersonProfileGOD(req, res) {
        try {
            let record = await Model.findOne({
                where: {id: req.params.id},
                // attributes: ['id', 'document_number', 'email', 'photo', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],

                include: [
                    {
                        attributes: ['id', 'description'],
                        model: District,
                        as: "Districts_birth",
                        include: {
                            attributes: ['id', 'description'],
                            model: Province,
                            as: "Province",
                            include: {
                                attributes: ['id', 'description'],
                                model: Department,
                                as: "Department",
                                include: {
                                    attributes: ['id', 'description'],
                                    model: Country,
                                    as: "Country"
                                }
                            }
                        }

                    },
                    {
                        attributes: ['id', 'description'],
                        model: District,
                        as: "Districts_reside",
                        include: {
                            attributes: ['id', 'description'],
                            model: Province,
                            as: "Province",
                            include: {
                                attributes: ['id', 'description'],
                                model: Department,
                                as: "Department",
                                include: {
                                    attributes: ['id', 'description'],
                                    model: Country,
                                    as: "Country"
                                }
                            }
                        }

                    },
                    // {
                    //     model: Student,
                    //     as: 'Students',
                    //     include: {
                    //         model: Program,
                    //         as: 'Program'
                    //     }
                    // }
                ]

            });

            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    async retrivePersonStudentProgram(req, res) {
        try {
            let record = await Student.findAll({
                where: {id_person: req.params.id},

                include: {
                    model: Program,
                    as: 'Program'
                },
                order: [
                    ['created_at', 'ASC']
                ],
            });

            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
// BUSCAR SI EXISTE PERSONA
    async validatePersonDni(req, res) {
        try {
            let record = await Model.findOne({
                attributes: ['id', 'photo', 'email', [Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name']],
                where: {document_number: req.params.dni}
            });
            if (record) {
                res.status(200).send({Person: record, message: "Ya existen registros con ese numero de DNI"})
            } else {
                res.status(200).send({Person: record, message: "No existen registros con ese numero de DNI"})
            }

        } catch (err) {
            console.log(err);
            res.status(445).send({message: err, err: message.ERROR_TRANSACTION})
        }

    },
};
