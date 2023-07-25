const Sequelize = require('sequelize');
const appRoot = require('app-root-path');
const Fn = Sequelize.fn;
const fs = require('fs');
const Col = Sequelize.col;
const message = require('../../messages');
const Op = Sequelize.Op;
const Student = require('../../models').Student;
const ST = Student.sequelize;
const moment = require('moment');
const abox = require('../Abox');
const _ = require('lodash');
const Movement = require('../../models').Movement;
const Admission_plan = require('../../models').Admission_plan;
const Program = require('../../models').Programs;
const Organic_unit = require('../../models').Organic_unit;
const Campus = require('../../models').Campus;
const Person = require('../../models').Person;
const Plan = require('../../models').Plan;
const District = require('../../models').District;
const Province = require('../../models').Province;
const Department = require('../../models').Department;
const Academic_semester = require('../../models').Academic_semester;
const Academic_calendar = require('../../models').Academic_calendar;
const Concept = require('../../models').Concept;
const Academic_degree = require('../../models').Academic_degree;
const Registration = require('../../models').Registration;
const Registration_course = require('../../models').Registration_course;
const Course = require('../../models').Course;
const Horary = require('../../models').Horary;
const Ciclo = require('../../models').Ciclo;
const Country = require('../../models').Country;
const Acta_book = require('../../models').Acta_book;
const Schedule = require('../../models').Schedule;
const Authority = require('../../models').Authority;
const Teacher = require('../../models').Teacher;
const Bank = require('../../models').Bank;
const System_configuration = require('../../models').System_configuration;
const Payment = require('../../models').Payment;
const Requeriment_delivered = require('../../models').Requeriment_delivered;
const Document_book = require('../../models').Document_book;
const Social_network = require('../../models').Social_network;
const Study_level = require('../../models').Study_level;
const Civil_status = require('../../models').Civil_status;
const Identification_document = require('../../models').Identification_document;
const Unit_measure = require('../../models').Unit_measure;
const Document_type = require('../../models').Document_type;
const Document = require('../../models').Document;
const Activity_type = require('../../models').Activity_type;
const Activity = require('../../models').Activity;
const Semester = require('../../models').Semester;
const Semester_activity = require('../../models').Semester_activity;
const Type_building = require('../../models').Type_building;
const Building = require('../../models').Building;
const Type_organic_unit = require('../../models').Type_organic_unit;
const Charge = require('../../models').Charge;
const Organic_unit_charge = require('../../models').Organic_unit_charge;
const Category_concept = require('../../models').Category_concept;
const Material = require('../../models').Material;
const Build_organic_unit = require('../../models').Build_organic_unit;
const Contract_type = require('../../models').Contract_type;
const Academic_period = require('../../models').Academic_period;
const Bank_account = require('../../models').Bank_account;
const Uit = require('../../models').Uit;
const Requeriment = require('../../models').Requeriment;
const Discount = require('../../models').Discount;

moment.locale('es-mx');
module.exports = {

    migrateAllData: async (req, res) => {
        let models = [
            {id: 1, description: 'Country', name: Country},
            {id: 2, description: 'Bank', name: Bank},
            {id: 3, description: 'Social_network', name: Social_network},
            {id: 4, description: 'Department', name: Department},
            {id: 6, description: 'Academic_degree', name: Academic_degree},
            {id: 6, description: 'Province', name: Province},
            {id: 7, description: 'Study_level', name: Study_level},
            {id: 8, description: 'Civil_status', name: Civil_status},
            // {id: 9, description: 'District', name: District},
            {id: 10, description: 'Identification_document', name: Identification_document},
            {id: 11, description: 'Unit_measure', name: Unit_measure},
            // {id: 12, description: 'Document_type', name: Document_type},
            {id: 13, description: 'Document', name: Document},
            {id: 14, description: 'Activity_type', name: Activity_type},
            {id: 15, description: 'Activity', name: Activity},
            {id: 16, description: 'Semester', name: Semester},
            // {id: 17, description: 'Semester', name: Academic_calendar},
            {id: 18, description: 'Academic_semester', name: Academic_semester},
            {id: 19, description: 'Semester_activity', name: Semester_activity},
            {id: 20, description: 'Campus', name: Campus},
            {id: 21, description: 'Type_building', name: Type_building},
            {id: 22, description: 'Building', name: Building},
            {id: 23, description: 'Type_organic_unit', name: Type_organic_unit},
            // {id: 24, description: 'Organic_unit', name: Organic_unit},
            {id: 25, description: 'Build_organic_unit', name: Build_organic_unit},
            {id: 26, description: 'Charge', name: Charge},
            {id: 27, description: 'Organic_unit_charge', name: Organic_unit_charge},
            {id: 28, description: 'Category_concept', name: Category_concept},
            {id: 29, description: 'Material', name: Material},
            {id: 30, description: 'Contract_type', name: Contract_type},
            {id: 31, description: 'Academic_period', name: Academic_period},
            {id: 32, description: 'Bank_account', name: Bank_account},
            {id: 33, description: 'Uit', name: Uit},
            {id: 34, description: 'Requeriment', name: Requeriment},
            {id: 35, description: 'Discount', name: Discount},
            {id: 36, description: 'System_configuration', name: System_configuration},
            {id: 37, description: 'Authority', name: Authority},
        ]

        try {

            for (let i = 0; i < models.length; i++) {

                let record = await models[i].name.findAll();
                await abox.migrateWriteFile(models[i].description + '.json', JSON.stringify(record));

                let finalPath = `${appRoot}/server/data/` + models[i].description + '.json';
                let tempPath = `${appRoot}/` + models[i].description + '.json';
                await abox.migrateRenameFile(tempPath, finalPath)


            }


            res.status(200).send(message.REGISTERED_OK)
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    aprovedDesaproved: async (req, res) => {
        try {

            let program = [];

            program = await Program.findAll({
                attributes: ['id', 'description', 'denomination'],
                where: {state: true},
                include: {
                    attributes: ['id', 'id_semester', 'id_student'],
                    required: true,
                    model: Registration,
                    as: 'Registrations',
                    where: {id_semester: {[Op.gte]: 77}},
                    include: {
                        attributes: ['id', 'state'],
                        required: true,
                        model: Registration_course,
                        as: 'Registration_course'
                    }
                }
            })
            //agrupando
            let data = [];
            for (let i = 0; i < program.length; i++) {
                data.push({
                    id_program: program[i].id,
                    program_denomination: program[i].denomination,
                    Registrations: _.chain(program[i].Registrations).groupBy("id_semester").toJSON()
                })
            }
            //contar
            let result = [];
            for (let i = 0; i < data.length; i++) {

                result.push({
                    id_program: data[i].id_program,
                    program_denomination: data[i].program_denomination,
                    total_matriculados: {
                        '2019-1': data[i].Registrations['77'] ? data[i].Registrations['77'].length : 0,
                        '2019-2': data[i].Registrations['78'] ? data[i].Registrations['78'].length : 0,
                        '2020-1': data[i].Registrations['81'] ? data[i].Registrations['81'].length : 0,
                        '2020-2': data[i].Registrations['82'] ? data[i].Registrations['82'].length : 0,
                        '2021-1': data[i].Registrations['85'] ? data[i].Registrations['85'].length : 0,
                        '2021-2': data[i].Registrations['86'] ? data[i].Registrations['86'].length : 0,
                    }
                })

                for (let j = 0; j < data[i].Registrations['77'].length; j++) {

                    for (let k = 0; k < data[i].Registrations['77'].Registration_course.length; k++) {

                    }
                }
                // result.push({
                //     id_program: data[i].id_program,
                //     program_denomination: data[i].program_denomination,
                //     total_matriculados: {
                //         '2019-1': data[i].Registrations['77'] ? data[i].Registrations['77'].length : 0,
                //         '2019-2': data[i].Registrations['78'] ? data[i].Registrations['78'].length : 0,
                //         '2020-1': data[i].Registrations['81'] ? data[i].Registrations['81'].length : 0,
                //         '2020-2': data[i].Registrations['82'] ? data[i].Registrations['82'].length : 0,
                //         '2021-1': data[i].Registrations['85'] ? data[i].Registrations['85'].length : 0,
                //         '2021-2': data[i].Registrations['86'] ? data[i].Registrations['86'].length : 0,
                //     }
                // })

            }

            res.status(200).send(data)
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
