const express = require('express');
const person = express.Router();
const verifyToken = require('../middlewares/auth');

const PersonController = require('../controllers/person').PersonController;
const StudyController = require('../controllers/person').StudyController;
const StudentController = require('../controllers/person').StudentController;
const WorkController = require('../controllers/person').WorkController;
const PostulantController = require('../controllers/person').PostulantController;
const TeacherController = require('../controllers/person').TeacherController;
const AdministrativeController = require('../controllers/person').AdministrativeController;
const RequerimentDeliveredController = require('../controllers/person').RequerimentDeliveredController;
const StudentDiscountController = require('../controllers/person').StudentDiscountController;


//ACTUAL FUNCTION
person.post('/person/administrative', verifyToken, PersonController.createPersonAdministrative);
person.patch('/person/administrative', verifyToken, PersonController.listPersonAdministrative);
person.get('/person/administrative/g', verifyToken, PersonController.listPersonAdministrativeGOD);
person.patch('/person/administrative/:id', verifyToken, PersonController.retrivePersonAdministrative);
person.get('/person/administrative/:id/g', verifyToken, PersonController.retrivePersonAdministrativeGOD);

person.post('/person/teacher', verifyToken, PersonController.createPersonTeacher);
person.patch('/person/teacher', verifyToken, PersonController.listPersonTeacher);
person.get('/person/teacher/g', verifyToken, PersonController.listPersonTeacherGOD);
person.patch('/person/teacher/:id', verifyToken, PersonController.retrivePersonTeacher);
person.get('/person/teacher/:id/g', verifyToken, PersonController.retrivePersonTeacherGOD);

person.post('/person/student', verifyToken, PersonController.createPersonStudent);
person.patch('/person/student', verifyToken, PersonController.listPersonStudent);
person.get('/person/student/g', PersonController.listPersonStudentGOD);
person.patch('/person/student/:id', verifyToken, PersonController.retrivePersonStudent);
person.get('/person/student/:id/g', PersonController.retrivePersonStudentGOD);


person.post('/person/profile', verifyToken, PersonController.createPersonProfile);
person.patch('/person/profile-update/:id', verifyToken, PersonController.updatePersonProfile);
person.patch('/person/profile', verifyToken, PersonController.listPersonProfile);
person.get('/person/profile/g', verifyToken,PersonController.listPersonProfileGOD);
person.patch('/person/profile/:id', verifyToken, PersonController.retrivePersonProfile);
person.get('/person/profile/:id/g', verifyToken, PersonController.retrivePersonProfileGOD);
person.get('/person/student/data/:id', verifyToken, PersonController.retrivePersonStudentProgram);

person.post('/student-discount', verifyToken, StudentDiscountController.createStudentDiscount);
person.get('/student-discount/:id_student', verifyToken, StudentDiscountController.listStudentDiscount);
person.delete('/student-discount/:id/:id_admission_plan', verifyToken, StudentDiscountController.destroyStudentDiscount);


// person.post('/teacher', verifyToken, TeacherController.createTeacherCharge);
person.post('/teacher', verifyToken, TeacherController.createTeacher);
person.patch('/teacher/:id', verifyToken, TeacherController.updateTeacherCharge);
person.get('/teacher/schedule/:id_schedule', verifyToken, TeacherController.listTeacherBySchedule);
person.delete('/teacher/:id', verifyToken, TeacherController.destroyTeacher);

person.post('/administrative', verifyToken, AdministrativeController.createAdministrativeCharge);
person.patch('/administrative/:id', verifyToken, AdministrativeController.updateAdministrativeCharge);
person.delete('/administrative/:id', verifyToken, AdministrativeController.destroyAdministrativeCharge);

person.post('/student', verifyToken, StudentController.createStudentProgram);
person.patch('/student/:id', verifyToken, StudentController.updateStudentProgram);
person.patch('/student/state/:id', verifyToken, StudentController.updateStateStudentProgram);
person.patch('/student/observation-update/:id', verifyToken, StudentController.updateObservationStudent);
person.delete('/student/:id', verifyToken, StudentController.destroyStudent);

person.get('/student/:id_student/document', verifyToken, StudentController.listDocumentStudentByStudentID);
person.get('/student/program/admission-plan/:id_admission_plan', StudentController.listStudentAdmissionProgram);
person.get('/student/program/admission-plan/with-registration/:id_admission_plan', StudentController.listStudentAdmissionProgramWithRegistration);
person.get('/student/:id_student', StudentController.retrieveStudent);
person.get('/student/admission-plan/:id_admission_plan/cost-admission-plan', StudentController.retrieveStudentCostAdmissionPlan);


person.get('/search-person-ta:parameter', verifyToken, PersonController.searchPersonTeacherAndAdministrative);
person.get('/search-person-a:parameter', verifyToken, PersonController.searchPersonAdministrative);
person.get('/search-person-t:parameter', verifyToken, PersonController.searchPersonTeacher);
person.patch('/search-teacher/organic-unit/:parameter', verifyToken, PersonController.searchPersonTeacherByOrganicUnit);
person.patch('/search-person/:parameter', verifyToken, PersonController.searchPerson);

person.patch('/search-person-student/:parameter', verifyToken, PersonController.searchPersonStudent);
person.patch('/search-person/student-uo/:parameter', verifyToken, PersonController.searchPersonStudenUnitOrganic);
person.patch('/search-person/student-all/:parameter', verifyToken, PersonController.searchPersonStudenUnitOrganicAll);

person.get('/validate-person-dni/:dni', verifyToken, PersonController.validatePersonDni);


person.get('/requeriment-delivered/student/:id_student', verifyToken,RequerimentDeliveredController.listRequerimentDeliveredByStudent);
person.post('/requeriment-delivered', verifyToken, RequerimentDeliveredController.createRequerimentDelivered);
person.get('/requeriment-delivered/:id', verifyToken, RequerimentDeliveredController.retrieveRequerimentDelivered);
person.patch('/requeriment-delivered/:id', verifyToken, RequerimentDeliveredController.updateRequerimentDelivered);
person.delete('/requeriment-delivered/:id', verifyToken, RequerimentDeliveredController.destroyRequerimentDelivered);


//OLD FUNCTION

person.post('/postulant', verifyToken, PostulantController.createPostulant);
person.get('/postulant/payment/:code', verifyToken, PostulantController.listPaymentByCode);
person.patch('/postulant/:id', verifyToken, PostulantController.createVoucher);
person.get('/postulant/payment/all/g', verifyToken, PostulantController.listPaymentPostulantGOD);
person.get('/postulant/payment/all/:id', verifyToken, PostulantController.listPaymentPostulant);
person.patch('/postulant/valid/:id', verifyToken, PostulantController.validPostulantByID);


person.get('/person', verifyToken, PersonController.list);
person.patch('/person/:id', verifyToken, PersonController.update);
person.patch('/person/change-img/:id', verifyToken, PersonController.updateImage);
person.delete('/person/:id', verifyToken, PersonController.destroy);
person.patch('/student-search-program/:id_program/:parameter', verifyToken, PersonController.searchStudentProgram);
person.get('/student-search/string/:id_organic_unit/:parameter', verifyToken, PersonController.searchStudentString);
person.get('/student-inscription/string/:id_organic_unit/:parameter', verifyToken, PersonController.searchStudentStringInscription);
person.get('/teacher-search/string/:parameter/:id', verifyToken, PersonController.searchTeacherString);
person.get('/person-search/string/:parameter', verifyToken, PersonController.searchPersonString);
person.get('/person/retrive/:id/:id_organic_unit', verifyToken, PersonController.retrievePerson);
person.get('/person/retrive-mode/:id', verifyToken, PersonController.retrievePersonMode);


person.post('/study', verifyToken, StudyController.create);
person.get('/study/:id', verifyToken, StudyController.retrieve);
person.patch('/study/:id', verifyToken, StudyController.update);
person.delete('/study/:id', verifyToken, StudyController.destroy);

person.get('/study/person/:id', verifyToken, StudyController.listPerson);
person.get('/work/person/:id', verifyToken, WorkController.listWorkPerson);


person.post('/work', verifyToken, WorkController.create);
person.get('/work/:id', verifyToken, WorkController.retrieve);
person.patch('/work/:id', verifyToken, WorkController.update);
person.delete('/work/:id', verifyToken, WorkController.destroy);


module.exports = person;
