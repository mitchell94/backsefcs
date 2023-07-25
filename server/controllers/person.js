'use strict';
//////////////////////////////////PERSON////////////////////////////////////////
//////////////////////////////////PERSON////////////////////////////////////////
//////////////////////////////////PERSON////////////////////////////////////////

const PersonController = require('./person/person');
const StudyController = require('./person/study');
const WorkController = require('./person/work');
const PostulantController = require('./person/postulant');
const StudentController = require('./person/student');
const TeacherController = require('./person/teacher');
const AdministrativeController = require('./person/administrative');
const RequerimentDeliveredController = require('./person/requeriment_delivered');
const StudentDiscountController = require('./person/student_disconunt');

/*******************************************************************************/


module.exports = {
    StudentDiscountController,
    RequerimentDeliveredController,
    StudentController,
    AdministrativeController,
    TeacherController,
    PersonController,
    StudyController,
    WorkController,
    PostulantController,

};
