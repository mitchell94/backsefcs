const express = require('express');
const programs = express.Router();
const verifyToken = require('../middlewares/auth');

const CourseController = require('../controllers/programs').CourseController;
const ProgramsController = require('../controllers/programs').ProgramsController;
const CycleController = require('../controllers/programs').CycleController;
const PlanController = require('../controllers/programs').PlanController;
const WorkPlanController = require('../controllers/programs').WorkPlanController;
const AdmissionPlanController = require('../controllers/programs').AdmissionPlanController;
const DetailWorkPlanController = require('../controllers/programs').DetailWorkPlanController;
const OrganizationWorkPlanController = require('../controllers/programs').OrganizationWorkPlanController;
const EntryWorkPlanController = require('../controllers/programs').EntryWorkPlanController;
const EgressAdministrativePlanController = require('../controllers/programs').EgressAdministrativePlanController;
const EgressComissionPlanController = require('../controllers/programs').EgressComissionPlanController;
const EgressTeacherPlanController = require('../controllers/programs').EgressTeacherPlanController;
const EgressMateriallanController = require('../controllers/programs').EgressMateriallanController;
const CostAdmissionPlanController = require('../controllers/programs').CostAdmissionPlanController;
const DocumentBookController = require('../controllers/programs').DocumentBookController;
const ActaBookController = require('../controllers/programs').ActaBookController;
const ProjectController = require('../controllers/programs').ProjectController;


programs.get('/project/organic-unit/:id', ProjectController.listProjectByOrganicUnitID);
programs.post('/project-tesis', verifyToken, ProjectController.createProjectTesis);
programs.post('/project-tesis/:id', verifyToken, ProjectController.updateProjectTesis);
// programs.patch('/acta-book-close/:id_acta', verifyToken, ActaBookController.closeActaBook);
// programs.get('/acta-book/schedule/:id_schedule', verifyToken, ActaBookController.listActaBookBySchedule);
// programs.get('/acta-book/:id_process', verifyToken, ActaBookController.listActaBook);


programs.post('/acta-book', verifyToken, ActaBookController.createActaBook);
programs.patch('/acta-book-close/:id_acta', verifyToken, ActaBookController.closeActaBook);
programs.get('/acta-book/schedule/:id_schedule', verifyToken, ActaBookController.listActaBookBySchedule);
programs.get('/acta-book/:id_process', verifyToken, ActaBookController.listActaBook);


programs.get('/document-book-payment', verifyToken, DocumentBookController.listDocumentPayment);
programs.get('/document-book/:id', DocumentBookController.listDocumentBook);
programs.patch('/document-book/upload/:id', DocumentBookController.uploadDocumentBook);
programs.post('/document-book', verifyToken, DocumentBookController.createDocumentBook);
programs.patch('/document-book/:id', verifyToken, DocumentBookController.updateDocumentBook);

programs.get('/egress-material/:id_work_plan', verifyToken, EgressMateriallanController.listEgressMaterialByWorkPlanID);
programs.post('/egress-material', verifyToken, EgressMateriallanController.createEgressMaterial);
programs.patch('/egress-material/:id', verifyToken, EgressMateriallanController.updateEgressMaterial);
programs.delete('/egress-material/:id', verifyToken, EgressMateriallanController.destroyEgressMaterial);

programs.get('/egress-teacher/:id_work_plan', verifyToken, EgressTeacherPlanController.listEgressTeacherByWorkPlanID);
programs.post('/egress-teacher', verifyToken, EgressTeacherPlanController.createEgressTeacher);
programs.patch('/egress-teacher/:id', verifyToken, EgressTeacherPlanController.updateEgressTeacher);
programs.delete('/egress-teacher/:id', verifyToken, EgressTeacherPlanController.destroyEgressTeacher);

programs.get('/egress-comission/:id_work_plan', verifyToken, EgressComissionPlanController.listEgressComissionByWorkPlanID);
programs.post('/egress-comission', verifyToken, EgressComissionPlanController.createEgressComission);
programs.patch('/egress-comission/:id', verifyToken, EgressComissionPlanController.updateEgressComission);
programs.delete('/egress-comission/:id', verifyToken, EgressComissionPlanController.destroyEgressComission);

programs.get('/egress-administrative/:id_work_plan', verifyToken, EgressAdministrativePlanController.listEgressAdministrativeByWorkPlanID);
programs.post('/egress-administrative', verifyToken, EgressAdministrativePlanController.createEgressAdministrative);
programs.patch('/egress-administrative/:id', verifyToken, EgressAdministrativePlanController.updateEgressAdministrative);
programs.delete('/egress-administrative/:id', verifyToken, EgressAdministrativePlanController.destroyEgressAdministrative);


programs.get('/entry-work-plan/:id_work_plan', verifyToken, EntryWorkPlanController.listEntryByWorkPlanID);
programs.post('/entry-work-plan', verifyToken, EntryWorkPlanController.createEntryWorkPlan);
programs.patch('/entry-work-plan/:id', verifyToken, EntryWorkPlanController.updateEntryWorkPlan);
programs.delete('/entry-work-plan/:id', verifyToken, EntryWorkPlanController.destroyEntryWorkPlan);


programs.get('/organization-work-plan/:id_work_plan', verifyToken, OrganizationWorkPlanController.listOrganizationWorkPlanByID);
programs.post('/organization-work-plan', verifyToken, OrganizationWorkPlanController.createOrganizationWorkPlan);
programs.patch('/organization-work-plan/:id', verifyToken, OrganizationWorkPlanController.updateOrganizationWorkPlan);
programs.delete('/organization-work-plan/:id', verifyToken, OrganizationWorkPlanController.destroyOrganizationWorkPlan);

programs.get('/detail-work-plan/:id_work_plan', verifyToken, DetailWorkPlanController.listDetailWorkPlanByID);
programs.post('/detail-work-plan', verifyToken, DetailWorkPlanController.createDetailWorkPlan);
programs.patch('/detail-work-plan/:id', verifyToken, DetailWorkPlanController.updateDetailWorkPlan);
programs.delete('/detail-work-plan/:id', verifyToken, DetailWorkPlanController.destroyDetailWorkPlan);

programs.get('/work-plan/programs/:id_program', verifyToken, WorkPlanController.listWorkPlanByProgram);
programs.get('/work-plan/programs/:id_program/web', verifyToken, WorkPlanController.listOneWorkPlanByProgramIDWeb);
programs.get('/work-plan/programs/:id_program/s', verifyToken, WorkPlanController.listWorkPlanByProgramIDS);
programs.get('/work-plan/:id', verifyToken, WorkPlanController.listWorkPlanByID);
programs.get('/work-plan/total-projection/:id', verifyToken, WorkPlanController.listWorkPlanTotalProjectionByID);
programs.post('/work-plan', verifyToken, WorkPlanController.createWorkPlan);
programs.patch('/work-plan/:id', verifyToken, WorkPlanController.updateWorkPlan);
programs.delete('/work-plan/:id', verifyToken, WorkPlanController.destroyWorkPlan);

programs.get('/admission-plan/programs/:id_program', verifyToken, AdmissionPlanController.listAdmissionPlanByProgram);
programs.get('/admission-plan/programs/:id_program/report', verifyToken, AdmissionPlanController.listAdmissionPlanByProgramIDReport);

programs.get('/admission-plan/programs/:id_program/s', verifyToken, AdmissionPlanController.listAdmissionPlanByProgramIDS);

programs.get('/admission-plan/:id', verifyToken, AdmissionPlanController.listAdmissionPlanByID);
programs.get('/admission-plan/cost/program/:id_admission_plan', AdmissionPlanController.retriveAdmissionPlanByID);
programs.get('/admission-plan/total-projection/:id', verifyToken, AdmissionPlanController.listAdmissionPlanTotalProjectionByID);
programs.post('/admission-plan', verifyToken, AdmissionPlanController.createAdmissionPlan);
programs.patch('/admission-plan/:id', verifyToken, AdmissionPlanController.updateAdmissionPlan);
programs.delete('/admission-plan/:id', verifyToken, AdmissionPlanController.destroyAdmissionPlan);


programs.get('/cost-admission-plan/:id_admission_plan', verifyToken, CostAdmissionPlanController.listCostByAdmissionPlanID);
programs.post('/cost-admission-plan', verifyToken, CostAdmissionPlanController.createCostAdmissionPlan);
programs.patch('/cost-admission-plan/:id', verifyToken, CostAdmissionPlanController.updateCostAdmissionPlan);
programs.delete('/cost-admission-plan/:id', verifyToken, CostAdmissionPlanController.destroyCostAdmissionPlan);


programs.post('/programs', verifyToken, ProgramsController.createProgram);
programs.get('/programs/:id', verifyToken, ProgramsController.listProgram);


programs.patch('/programs/:id', verifyToken, ProgramsController.updateProgram);
programs.patch('/programs/online/update/:id', verifyToken, ProgramsController.updateOnlineProgram);
programs.delete('/programs/:id', verifyToken, ProgramsController.destroy);
programs.get('/programs/organic-unit-register/:id', verifyToken, ProgramsController.listProgramByOrganicUnitRegisterID);
programs.get('/programs/all/g', verifyToken, ProgramsController.listProgramGOD);

programs.get('/programs/s-organic-unit-register/:id', verifyToken, ProgramsController.listSimpleProgramByOrganicUnitRegisterID);


programs.post('/program-document', verifyToken, ProgramsController.createProgramDocument);
programs.get('/programs/:id_program/document', verifyToken, ProgramsController.listDocumentProgramByProgramID);
programs.delete('/program-document/:id', verifyToken, ProgramsController.destroyProgramDocument);


programs.get('/plan/programs/:id', verifyToken, PlanController.listPlanByProgramID);
programs.get('/study-plan/programs/:id_program/report', verifyToken, PlanController.listStudyPlanByProgramIDReport);
programs.get('/programs/:id/study-plan', verifyToken, ProgramsController.listProgramIDPlan);

programs.get('/plan/:id_program/cost', verifyToken, PlanController.listPlanCost);
programs.patch('/plan/:id_program/actual', verifyToken, PlanController.updateActualPlan);

programs.post('/plan', verifyToken, PlanController.createPlan);
programs.patch('/plan/:id', verifyToken, PlanController.updatePlan);
programs.patch('/plan/valid/update', verifyToken, PlanController.updateValidPlan);
programs.delete('/plan/:id', verifyToken, PlanController.destroyPlan);

programs.post('/cycle', verifyToken, CycleController.create);
programs.patch('/cycle', verifyToken, CycleController.update);
programs.get('/cycle/:id_plan/plan', verifyToken, CycleController.listCycleByPlan);

programs.get('/cycle/:id_plan/course', verifyToken, CycleController.listCourseByPlanID);
programs.get('/cycle/course/plan/:id_plan', verifyToken, CycleController.listCycleCourseByPlan);
programs.get('/cycle/course/:id_plan/:cycle/course-required', verifyToken, CycleController.listCycleCourseByCycle);
programs.get('/cycle/course/:id_plan/plan', CycleController.listCourseByPlanStudy);


programs.post('/course', verifyToken, CourseController.createCourse);
programs.get('/course/:id', verifyToken, CourseController.listCourse);  //para el select

programs.patch('/course/:id', verifyToken, CourseController.updateCourse);
programs.patch('/course-state/:id', verifyToken, CourseController.disableCourse);
programs.delete('/course/:id', verifyToken, CourseController.destroy)
programs.patch('/search-course/:parameter', verifyToken, CourseController.searchCourse);
programs.patch('/course/registration/student/:id_student', verifyToken, CourseController.listCourseRegistration);


//WEB
programs.get('/programs-report', verifyToken,ProgramsController.listProgramReport);
programs.get('/programs/detail/:id/web', verifyToken, ProgramsController.listProgramDetail);


module.exports = programs;
