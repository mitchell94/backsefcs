const express = require('express');
const registration = express.Router();
const verifyToken = require('../middlewares/auth');


const RegistrationController = require('../controllers/registration').RegistrationController;
const ScheduleController = require('../controllers/registration').ScheduleController;
const HoraryController = require('../controllers/registration').HoraryController;
const RegistrationCourseController = require('../controllers/registration').RegistrationCourseController;


registration.get('/registration-course/registration/:id_registration', verifyToken, RegistrationCourseController.listRegistrationCourseByRegistration);
registration.post('/horary', verifyToken, HoraryController.createHorary);
registration.get('/horary/:id_schedule', verifyToken, HoraryController.listHoraryBySchedule);
registration.delete('/horary/:id_schedule', verifyToken, HoraryController.destroyHorary);


registration.post('/schedule', verifyToken, ScheduleController.createSchedule);
registration.post('/schedule/massive', verifyToken, ScheduleController.createScheduleMassive);
registration.get('/schedule-program/:id_program/:id_process', verifyToken, ScheduleController.listScheduleByProgram);
registration.get('/schedule/admission-plan/:id_schedule', verifyToken, ScheduleController.listScheduleAdmissionPlan);
registration.get('/schedule/student/:id_schedule/:id_admission_plan', verifyToken, ScheduleController.listScheduleStundent);
registration.get('/schedule/registration-course/:id_schedule', verifyToken, ScheduleController.listRegistrationCourseStudentBySchedule);
registration.get('/schedule-teacher/:id_course/:id_process', verifyToken, ScheduleController.listTeacherScheduleByProcessCourse);
registration.get('/schedule-course/:id_program/:id_process', verifyToken, ScheduleController.listScheduleCourseByProgramProcess);
registration.get('/schedule/:id', verifyToken, ScheduleController.retrieve);
registration.patch('/schedule/:id', verifyToken, ScheduleController.updateSchedule);
registration.delete('/schedule/:id', verifyToken, ScheduleController.destroySchedule);


registration.patch('/registration/course', RegistrationController.listRegistrationCourse);
registration.get('/registration/retirement/:id_student', verifyToken, RegistrationController.listRegistrationRetirement);
registration.patch('/registration/organic-unit/semester/:id_process', RegistrationController.listRegistrationByOrganicUnitSemester);
registration.post('/registration', verifyToken, RegistrationController.createRegistration);
registration.patch('/registration/:id', verifyToken, RegistrationController.updateRegistration);
registration.patch('/registration/update-state/:id_registration', verifyToken, RegistrationController.updateStateRegistration);
registration.get('/registration/:id_student/registration-course', verifyToken, RegistrationController.listRegistrationCourseStudent);
registration.get('/registration/:id_student/registration-course/ultimate', verifyToken, RegistrationController.listUltimateRegistrationCourseStudent);
registration.get('/registration/:id_course/requirement-course', verifyToken, RegistrationController.listSeeRequirement);

registration.patch('/registration-course/note', verifyToken, RegistrationController.updateRegistrationCourse);
registration.patch('/registration-course-note', verifyToken, RegistrationController.updateRegistrationCourseNote);


registration.get('/registration/:id_student/student', verifyToken, RegistrationController.listRegistrationStundent);
registration.patch('/registration/grade/student/:id_registration', verifyToken, RegistrationController.updateGradeStudentCourse);
registration.patch('/registration/remove/student/:id_registration', verifyToken, RegistrationController.updateRemoveStudentCourse);
registration.patch('/registration/student/retirement', verifyToken, RegistrationController.updateRegistrationRetirement);
registration.get('/registration/:id', verifyToken, RegistrationController.retrieve);

registration.delete('/registration/:id', verifyToken, RegistrationController.destroyRegistration);
registration.patch('/leave-registration/:id', verifyToken, RegistrationController.leaveRegistration);

registration.post('/registration/no/', verifyToken, RegistrationController.createNoRegistration);
registration.delete('/registration/no/:id', verifyToken, RegistrationController.destroyNoRegistration);



module.exports = registration;
