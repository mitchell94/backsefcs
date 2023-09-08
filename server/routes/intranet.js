const express = require('express');
const intranet = express.Router();
const verifyToken = require('../middlewares/auth');

const UserIntranetController = require('../controllers/intranet').UserIntranetController;
const ProjectController = require('../controllers/intranet').ProjectController;

intranet.post('/user-intranet', verifyToken, UserIntranetController.createUserIntranet);
intranet.get('/student-program', verifyToken, UserIntranetController.listStudentProgramIntranet);
// MPT
intranet.get('/student-programs-list', verifyToken, UserIntranetController.listStudentPrograms);

intranet.get('/person/profile', verifyToken, UserIntranetController.retrivePersonProfileIntranet);
intranet.get('/administrative-info',verifyToken, UserIntranetController.retriveDataAdministrativeIntranet);
intranet.get('/document-solicited',verifyToken, UserIntranetController.retriveDataDocumentSolicited);
intranet.get('/student-payment', verifyToken, UserIntranetController.listStudentPaymentIntranet);
// intranet.get('/student-payment/:id_student', verifyToken, UserIntranetController.listStudentPaymentIntranet);
intranet.get('/student-movement', verifyToken, UserIntranetController.listStudentMovementIntranet);
// intranet.get('/student-movement/:id_student', verifyToken, UserIntranetController.listStudentMovementIntranet);
intranet.get('/student-requeriment/:id_student', verifyToken, UserIntranetController.listStudentRequeriment);
intranet.post('/student-movement', verifyToken, UserIntranetController.createMovementIntranet);
//TEACHER
intranet.get('/teacher-schedule', verifyToken, UserIntranetController.listTeacherScheduleIntranet);
intranet.get('/teacher-schedule/admission-plan/:id_schedule', verifyToken, UserIntranetController.listTeacherScheduleAdmissionPlan);
intranet.get('/teacher-schedule/student/:id_schedule/:id_admission_plan', verifyToken, UserIntranetController.listTeacherScheduleStundent);
intranet.get('/teacher-acta-book/schedule/student/:id_schedule/:id_admission_plan', verifyToken, UserIntranetController.listTeacherActaBookBySchedule);
intranet.get('/teacher-report-acta/:id_acta_book', verifyToken, UserIntranetController.reportTeacherActa);
///TRAMITES
intranet.get('/student-concept/:id', verifyToken, UserIntranetController.listConceptIntranet);
intranet.get('/student-concept/state/:id_student', verifyToken, UserIntranetController.listStudentConceptValidIntranet);
intranet.get('/student-procedure/:id', verifyToken, UserIntranetController.listProcedureStudentIntranet);

intranet.post('/student-procedure', verifyToken,UserIntranetController.createProcedureStudentIntranet);
intranet.post('/student-procedure/file', verifyToken, UserIntranetController.createComprobanteProcedureIntranet);

intranet.get('/teacher-project', verifyToken, ProjectController.listTeacherProject);
intranet.get('/student-project', verifyToken, ProjectController.listStudentProject);
intranet.get('/only-project-round/:id_project', verifyToken, ProjectController.listOnlyProjectRound);
intranet.get('/retrive-teacher-project/:id_project', verifyToken, ProjectController.retriveTeacherProject);
intranet.post('/teacher-project-round', verifyToken, ProjectController.createTeacherProjectRound);
intranet.patch('/student-project-round', verifyToken, ProjectController.updateStudentProjectRound);
//login
intranet.post('/login', UserIntranetController.validUserIntranet);
// MPT
intranet.patch('/change-password', verifyToken, UserIntranetController.changePassword);
intranet.get('/student-academic-record', verifyToken, UserIntranetController.reportAcademicRecord);

module.exports = intranet;
