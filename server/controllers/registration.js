'use strict';
//////////////////////////////////SECURITY////////////////////////////////////////
//////////////////////////////////SECURITY////////////////////////////////////////
//////////////////////////////////SECURITY////////////////////////////////////////
const GroupClassController = require('./registration/group_class');
// const OpenCourseController = require('./registration/open_course');
const RegistrationController = require('./registration/registration');
const ScheduleController = require('./registration/schedule');
const HoraryController = require('./registration/horary');
const RegistrationCourseController = require('./registration/registration_course');
// const StudentScheduleController = require('./registration/student_schedule');
// const TypeCourseController = require('./registration/type_course');

/*******************************************************************************/


module.exports = {
    GroupClassController,
    RegistrationCourseController,
    RegistrationController,
    ScheduleController,
    HoraryController,


};
