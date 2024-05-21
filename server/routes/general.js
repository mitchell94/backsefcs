const express = require('express');
const general = express.Router();
const verifyToken = require('../middlewares/auth');

const AcademicCalendarController = require('../controllers/general').AcademicCalendarController;
const AcademicSemesterController = require('../controllers/general').AcademicSemesterController;
const AcademicDegreeController = require('../controllers/general').AcademicDegreeController;
const ActivityTypeController = require('../controllers/general').ActivityTypeController;
const ActivityController = require('../controllers/general').ActivityController;
const BuildingOrganicUnitController = require('../controllers/general').BuildingOrganicUnitController;
const BuildingController = require('../controllers/general').BuildingController;
const CampusController = require('../controllers/general').CampusController;
const ChargeController = require('../controllers/general').ChargeController;
const CivilStatusController = require('../controllers/general').CivilStatusController;
const DocumentTypeController = require('../controllers/general').DocumentTypeController;
const DocumentController = require('../controllers/general').DocumentController;
const IdentificationDocumentController = require('../controllers/general').IdentificationDocumentController;
const OpenAcademicController = require('../controllers/general').OpenAcademicController;
const OrganicUnitController = require('../controllers/general').OrganicUnitController;
const OrganicUnitChargeController = require('../controllers/general').OrganicUnitChargeController;
const SemesterActivityController = require('../controllers/general').SemesterActivityController;
const SemesterController = require('../controllers/general').SemesterController;
const SocialNetworkController = require('../controllers/general').SocialNetworkController;
const StudyLevelController = require('../controllers/general').StudyLevelController;
const TypeBuildingController = require('../controllers/general').TypeBuildingController;
const TypeOrganicUnitController = require('../controllers/general').TypeOrganicUnitController;
const UbigeoController = require('../controllers/general').UbigeoController;
const UitController = require('../controllers/general').UitController;
const BankController = require('../controllers/general').BankController;
const BankAccountController = require('../controllers/general').BankAccountController;
const ContractTypeController = require('../controllers/general').ContractTypeController;
const AcademicPeriodController = require('../controllers/general').AcademicPeriodController;
const ConceptController = require('../controllers/general').ConceptController;
const CategoryConcept = require('../controllers/general').CategoryConcept;
const UnitMeasure = require('../controllers/general').UnitMeasure;
const MaterialController = require('../controllers/general').MaterialController;
const LocationController = require('../controllers/general').LocationController;
const RequerimentController = require('../controllers/general').RequerimentController;
const ReportController = require('../controllers/general').ReportController;
const GeneralController = require('../controllers/general').GeneralController;
const MigrateController = require('../controllers/general').MigrateController;

general.get('/discount', verifyToken, GeneralController.listDiscount);
general.get('/authority', verifyToken, GeneralController.listAuthority);
general.get('/update-authority/:id', verifyToken, GeneralController.updateStateAuthority);
general.get('/config', verifyToken, GeneralController.listConfig);
general.get('/update-config/:id', verifyToken, GeneralController.updateStateConfig);

general.get('/material', verifyToken, MaterialController.listMaterial);
general.patch('/search-material/:parameter', verifyToken, MaterialController.searchMaterial);
general.get('/material/type/:type', verifyToken, MaterialController.listMaterialByType);
general.post('/material', verifyToken, MaterialController.createMaterial);
general.patch('/material/:id', verifyToken, MaterialController.updateMaterial);
general.delete('/material/:id', verifyToken, MaterialController.destroyMaterial);

general.get('/unit-measure', verifyToken, UnitMeasure.listUnitMeasure);
general.post('/unit-measure', verifyToken, UnitMeasure.createUnitMeasure);
general.patch('/unit-measure/:id', verifyToken, UnitMeasure.updateUnitMeasure);
general.delete('/unit-measure/:id', verifyToken, UnitMeasure.destroyUnitMeasure);

general.get('/category-concept', verifyToken, CategoryConcept.listCategoryConcept);
general.post('/category-concept', verifyToken, CategoryConcept.createCategoryConcept);
general.patch('/category-concept/:id', verifyToken, CategoryConcept.updateCategoryConcept);
general.delete('/category-concept/:id', verifyToken, CategoryConcept.destroyCategoryConcept);

general.post('/concepts', verifyToken, ConceptController.create);
general.get('/concepts', verifyToken, ConceptController.listConcepts);
general.get('/concepts/category-concept/:id_category_concept', verifyToken, ConceptController.listConceptByCategoryConceptID);
general.get('/concepts/des/:description', verifyToken, ConceptController.listConceptByDescription);
general.get('/concepts/like/:description', verifyToken, ConceptController.listConceptByLike);
general.get('/concepts/like/:description/:type', verifyToken, ConceptController.listConceptByLikeAndType);
general.get('/concepts/id/:id', verifyToken, ConceptController.listConceptByID);
general.get('/concepts/type/:type', verifyToken, ConceptController.listConceptByType);
general.get('/concepts/inscription/:id_admission_plan/web', verifyToken, ConceptController.listConceptsInscriptionWeb);
general.get('/concepts/requeriment-inscription', verifyToken, ConceptController.listConceptsRequeriment);

general.patch('/concepts/:id', verifyToken, ConceptController.updateConcept);
general.delete('/concepts/:id', verifyToken, ConceptController.destroy);


general.get('/academic-period', verifyToken, AcademicPeriodController.list);

general.post('/contract-type', verifyToken, ContractTypeController.create);
general.get('/contract-type', verifyToken, ContractTypeController.list);

general.patch('/contract-type/:id', verifyToken, ContractTypeController.update);
general.delete('/contract-type/:id', verifyToken, ContractTypeController.destroy);

general.post('/academic-calendar', verifyToken, AcademicCalendarController.createAcademicCalendar);
general.get('/academic-calendar', verifyToken, AcademicCalendarController.listAcademicCalendar);

general.get('/academic-calendar/:id_academic_calendar/process', verifyToken, AcademicCalendarController.listProcessByAcademicCalendarID);
general.get('/academic-calendar/open-course', verifyToken, AcademicCalendarController.listAcademicOpenCourse);

general.get('/academic-calendar/all', verifyToken, AcademicCalendarController.listAcademicCalendarAll);

general.get('/academic-calendar/actual', verifyToken, AcademicCalendarController.listAcademicCalendarActual);
general.get('/academic-calendar/actual/work-plan', verifyToken, AcademicCalendarController.listAcademicCalendarActualWorkPlan);
general.get('/academic-calendar/:id_organic_unit/actual/:activity/nav', verifyToken, AcademicCalendarController.listAcademicOrganicUnitNav);

general.get('/academic-calendar/academic-semester-activity/:denomination', verifyToken, AcademicCalendarController.listAcademicCalendarAcademicSemesterActivityByActivity);

general.patch('/academic-calendar/:id_academic_calendar', verifyToken, AcademicCalendarController.update);
general.delete('/academic-calendar/:id', verifyToken, AcademicCalendarController.destroy);

general.patch('/semester-activity/:id/actual', verifyToken, AcademicCalendarController.actualActivityState);

general.post('/academic-semester', verifyToken, AcademicSemesterController.create);
general.get('/academic-semester/:id_academic_calendar', verifyToken, AcademicSemesterController.list);
general.get('/academic-semester/academic-calendar/all', verifyToken, AcademicSemesterController.listAcademicSemesterAndAcademicCalendar);
general.get('/academic-semester/academic-calendar/admission-plan/:id_admission_plan', AcademicSemesterController.listAcademicSemesterAndAcademicCalendarByAdmissionPlan);
general.patch('/academic-semester/:id', verifyToken, AcademicSemesterController.update);
general.delete('/academic-semester/:id', verifyToken, AcademicSemesterController.destroy);

general.post('/academic-degree', verifyToken, AcademicDegreeController.create);
general.get('/academic-degree', verifyToken, AcademicDegreeController.list);
general.get('/academic-degree/:id', verifyToken, AcademicDegreeController.retrieve);
general.patch('/academic-degree/:id', verifyToken, AcademicDegreeController.update);
general.delete('/academic-degree/:id', verifyToken, AcademicDegreeController.destroy);

general.post('/activity-type', verifyToken, ActivityTypeController.createActivityType);
general.get('/activity-type', verifyToken, ActivityTypeController.listActivityType);
general.get('/activity-type/:id', verifyToken, ActivityTypeController.retrieveActivityType);
general.patch('/activity-type/:id', verifyToken, ActivityTypeController.updateActivityType);
general.delete('/activity-type/:id', verifyToken, ActivityTypeController.destroyActivityType);

general.post('/activity', verifyToken, ActivityController.create);
general.get('/activity', verifyToken, ActivityController.list);
general.get('/activitys', verifyToken, ActivityController.lists);
general.patch('/activity/:id', verifyToken, ActivityController.update);
general.delete('/activity/:id', verifyToken, ActivityController.destroy);


general.post('/b-organic-unit', verifyToken, BuildingOrganicUnitController.create);
general.get('/b-organic-unit', verifyToken, BuildingOrganicUnitController.list);
general.get('/b-organic-unit/:id', verifyToken, BuildingOrganicUnitController.retrieve);
general.patch('/b-organic-unit/:id', verifyToken, BuildingOrganicUnitController.update);
general.delete('/b-organic-unit/:id', verifyToken, BuildingOrganicUnitController.destroy);

general.get('/organic-unit/campus/:id_campus', verifyToken, OrganicUnitController.listUnitByCampus);


general.post('/building', verifyToken, BuildingController.create);
general.get('/building', verifyToken, BuildingController.list);
general.get('/building/:id', verifyToken, BuildingController.retrieve);
general.patch('/building/:id', verifyToken, BuildingController.update);
general.delete('/building/:id', verifyToken, BuildingController.destroy);

general.post('/campus', verifyToken, CampusController.createCampus);
general.get('/campus', verifyToken, CampusController.listCampus);
general.get('/campus/:id', verifyToken, CampusController.retrieve);
general.patch('/campus/:id', verifyToken, CampusController.update);
general.delete('/campus/:id', verifyToken, CampusController.destroy);

general.post('/charge', verifyToken, ChargeController.create);
general.get('/charge', verifyToken, ChargeController.getCharges);
general.get('/charge/:id', verifyToken, ChargeController.retrieve);
general.patch('/charge/:id', verifyToken, ChargeController.update);
general.delete('/charge/:id', verifyToken, ChargeController.destroyCharge);

general.post('/civil-status', verifyToken, CivilStatusController.create);
general.get('/civil-status', verifyToken, CivilStatusController.list);
general.get('/civil-status/:id', verifyToken, CivilStatusController.retrieve);
general.patch('/civil-status/:id', verifyToken, CivilStatusController.update);
general.delete('/civil-status/:id', verifyToken, CivilStatusController.destroy);

general.post('/document-type', verifyToken, DocumentTypeController.create);
general.get('/document-type', verifyToken, DocumentTypeController.listDocumentType);
general.get('/document-type/:id', verifyToken, DocumentTypeController.retrieve);
general.patch('/document-type/:id', verifyToken, DocumentTypeController.update);
general.delete('/document-type/:id', verifyToken, DocumentTypeController.destroy);


general.post('/document', verifyToken, DocumentController.createDocument);
general.get('/document/:id_unit_organic', verifyToken, DocumentController.list);
general.get('/document-curriculum/:id_unit_organic', verifyToken, DocumentController.listCurriculum);
general.patch('/document/:id', verifyToken, DocumentController.updateDocument);
general.delete('/document/:id', verifyToken, DocumentController.destroyDocument);

general.post('/identification-document', verifyToken, IdentificationDocumentController.create);
general.get('/identification-document', verifyToken, IdentificationDocumentController.list);
general.get('/identification-document/:id', verifyToken, IdentificationDocumentController.retrieve);
general.patch('/identification-document/:id', verifyToken, IdentificationDocumentController.update);
general.delete('/identification-document/:id', verifyToken, IdentificationDocumentController.destroy);

general.post('/open-academic', verifyToken, OpenAcademicController.create);
general.get('/open-academic', verifyToken, OpenAcademicController.list);
general.get('/open-academic/:id', verifyToken, OpenAcademicController.retrieve);
general.patch('/open-academic/:id', verifyToken, OpenAcademicController.update);
general.delete('/open-academic/:id', verifyToken, OpenAcademicController.destroy);


general.post('/organic-unit', verifyToken, OrganicUnitController.create);
general.get('/organic-unit', verifyToken, OrganicUnitController.listUnitOrganic);
general.get('/organic-unit/all/unit', verifyToken, OrganicUnitController.listAllUnitOrganic);

general.get('/organic-unit/list', verifyToken, OrganicUnitController.listAll);
general.get('/organic-unit/:id', verifyToken, OrganicUnitController.retrieve);
general.patch('/organic-unit/:id', verifyToken, OrganicUnitController.update);
general.get('/update-organic-unit/:id', verifyToken, OrganicUnitController.updateStateUnitOrganic);
general.delete('/organic-unit/:id', verifyToken, OrganicUnitController.destroy);
general.get('/organic-unit/search/:parameter', verifyToken, OrganicUnitController.search_organic_unit);


general.post('/organic-unit-charge', verifyToken, OrganicUnitChargeController.create);
general.get('/organic-unit-charge', verifyToken, OrganicUnitChargeController.list);
general.get('/organic-unit-charge/:id', verifyToken, OrganicUnitChargeController.retrieve);
general.patch('/organic-unit-charge/:id', verifyToken, OrganicUnitChargeController.update);
general.delete('/organic-unit-charge/:id', verifyToken, OrganicUnitChargeController.destroy);

//general.post('/semester-activity', verifyToken, SemesterActivityController.create);
general.post('/semester-activity/create', verifyToken, SemesterActivityController.createSemesterActivity);
general.patch('/semester-activity', verifyToken, SemesterActivityController.list);
general.get('/semester-activity/list/:id_program/:id_process', SemesterActivityController.listSemesterActivity);
general.patch('/semester-activity/retrive', SemesterActivityController.retriveSemesterActivity);
general.patch('/semester-activity/registration', SemesterActivityController.retriveSemesterActivityRegistration);
general.patch('/semester-activity/finish', SemesterActivityController.finishSemesterActivity);
general.patch('/semester-activity/state', SemesterActivityController.updateStateSemesterActivity);
general.patch('/semester-activity/update/:id', verifyToken, SemesterActivityController.updateSemesterActivity);
general.delete('/semester-activity/:id', verifyToken, SemesterActivityController.destroy);

general.post('/semester', verifyToken, SemesterController.create);
general.get('/semester', verifyToken, SemesterController.list);
general.get('/semester-actual', verifyToken, SemesterController.listActual);
general.get('/semester/:id', verifyToken, SemesterController.retrieve);
general.patch('/semester/:id', verifyToken, SemesterController.update);
general.delete('/semester/:id', verifyToken, SemesterController.destroy);

general.post('/social-network', verifyToken, SocialNetworkController.create);
general.get('/social-network', verifyToken, SocialNetworkController.list);
general.get('/social-network/:id', verifyToken, SocialNetworkController.retrieve);
general.patch('/social-network/:id', verifyToken, SocialNetworkController.update);
general.delete('/social-network/:id', verifyToken, SocialNetworkController.destroy);

general.post('/study-level', verifyToken, StudyLevelController.create);
general.get('/study-level', verifyToken, StudyLevelController.list);
general.get('/study-level/:id', verifyToken, StudyLevelController.retrieve);
general.patch('/study-level/:id', verifyToken, StudyLevelController.update);
general.delete('/study-level/:id', verifyToken, StudyLevelController.destroy);

general.post('/type-building', verifyToken, TypeBuildingController.create);
general.get('/type-building', verifyToken, TypeBuildingController.list);
general.get('/type-building/:id', verifyToken, TypeBuildingController.retrieve);
general.patch('/type-building/:id', verifyToken, TypeBuildingController.update);
general.delete('/type-building/:id', verifyToken, TypeBuildingController.destroy);

general.post('/type-organic-unit', verifyToken, TypeOrganicUnitController.create);
general.get('/type-organic-unit', verifyToken, TypeOrganicUnitController.list);
general.get('/type-organic-unit/:type/type', verifyToken, TypeOrganicUnitController.listType);
general.get('/type-organic-unit/:id', verifyToken, TypeOrganicUnitController.retrieve);
general.patch('/type-organic-unit/:id', verifyToken, TypeOrganicUnitController.update);
general.delete('/type-organic-unit/:id', verifyToken, TypeOrganicUnitController.destroy);


general.get('/ubigeo/pais', verifyToken, UbigeoController.listCountry);
general.get('/ubigeo-nacional/:id_parent', verifyToken, UbigeoController.listPeru);
general.get('/ubigeo/province/:id', verifyToken, UbigeoController.listProvince);
general.get('/ubigeo/district/:id', verifyToken, UbigeoController.listDistrict);

general.post('/uit', verifyToken, UitController.createUit);
general.get('/uit', verifyToken, UitController.listUit);
general.get('/uit/:id', verifyToken, UitController.updateActualUit);
general.get('/uit/year/actual', verifyToken, UitController.listActualUit);
general.patch('/uit/:id', verifyToken, UitController.updateUit);
general.delete('/uit/:id', verifyToken, UitController.destroyUit);


general.post('/requeriment-inscription', verifyToken, RequerimentController.createRequeriment);
general.get('/requeriment-inscription', verifyToken, RequerimentController.listRequeriment);
general.get('/requeriment-inscription/concept/:id_concept/academic/:id_academic', verifyToken, RequerimentController.listRequerimentByConceptAcademicDegree);
general.get('/requeriment-inscription/:id', verifyToken, RequerimentController.retrieveRequeriment);
general.patch('/requeriment-inscription/:id', verifyToken, RequerimentController.updateRequeriment);
general.delete('/requeriment-inscription/:id', verifyToken, RequerimentController.destroyRequeriment);


general.post('/bank', verifyToken, BankController.createBank);
general.get('/bank', verifyToken, BankController.listBank);
general.get('/bank/:id', verifyToken, BankController.retrieveBank);
general.patch('/bank/:id', verifyToken, BankController.updateBank);
general.delete('/bank/:id', verifyToken, BankController.destroyBank);

general.post('/bank-account', verifyToken, BankAccountController.createBankAccount);
general.get('/bank-account', verifyToken, BankAccountController.listBankAccount);
// general.get('/bank-account/:id',verifyToken, BankAccountController.retrieveBankAccount);
general.patch('/bank-account/:id', verifyToken, BankAccountController.updateBankAccount);
general.delete('/bank-account/:id', verifyToken, BankAccountController.destroyBankAccount);


general.get('/country', verifyToken, LocationController.listCountry);
general.get('/country/:id', verifyToken, LocationController.listOneCountry);
general.get('/country/:id_country/department', verifyToken, LocationController.listCountryDepartment);
general.get('/country/department/:id_department/province', verifyToken, LocationController.listDepartmentProvince);
general.get('/country/department/province/:id_province/district', verifyToken, LocationController.listProvinceDistrict);

//REPORT APIS
general.get('/report-payment/program/admission-plan/:id_admission_plan', verifyToken, ReportController.reportPaymentProgramAdmision);

general.get('/report-inscription/:id_program', verifyToken, ReportController.reportInscription);
general.get('/report-sunedu-entry/:academic_degree/:id_process', verifyToken, ReportController.reportSuneduEntry);
general.get('/report-sunedu-registration/:academic_degree/:id_process', ReportController.reportSuneduRegistration);
general.get('/report-excel-registration/:academic_degree/:id_process', verifyToken, ReportController.reportExcelRegistration);

general.get('/report-excel-payment/program/admission-plan/complete/:id_admission_plan/:id_semester', verifyToken, ReportController.reportExcelPaymentProgramAdmisionTotal);
general.get('/report/liquidation/:id_admission_plan', ReportController.reportLiquidationByAdmissionPlan);

general.get('/report-excel-entry/:academic_degree/:id_process', verifyToken, ReportController.reportExecelEntry);//modulo sunedu excel simple
general.get('/report-excel-entry/organic-unit/:id_organic_unit/:id_process', verifyToken, ReportController.reportExecelEntryOrganicUnit);
general.get('/report-excel-registration/organic-unit/:id_organic_unit/:id_process', ReportController.reportExecelRegistrionOrganicUnit);
general.patch('/report-excel-movement/range', verifyToken, ReportController.reportExecelMovementStudentByRangeDate);
general.patch('/report-movement/range/registration', verifyToken, ReportController.reportDataMovementStudentByRangeDateRegistrationVoucher);
general.get('/report-cert-study/:id_student/:id_document_book',  ReportController.reportCertyStudy2);
general.get('/report-constancy-study/:id_student/:id_document_book', verifyToken, ReportController.reportConstancyStudy);
general.get('/report-constancy-entry/:id_student/:id_document_book', verifyToken, ReportController.reportConstancyEntry);
general.get('/report-constancy-expedito/:id_student/:id_document_book', verifyToken, ReportController.reportConstancyExpedito);
general.get('/report-constancy-egress/:id_student/:id_document_book', verifyToken, ReportController.reportConstancyEgress);
general.get('/report-constancy-adeudar/:id_student/:id_document_book', verifyToken, ReportController.reportConstancyAdeudar);
general.get('/report-constancy-order-merito/:id_student/:id_document_book', ReportController.reportConstancyOrdenMerito);
general.get('/report-constancy-disciplinary/:id_student/:id_document_book', verifyToken, ReportController.reportConstancyDisciplinary);
general.get('/report-constancy-registration/:id_student/:id_document_book', verifyToken, ReportController.reportConstancyRegistration);
general.get('/report-academic-record/:id_student', verifyToken, ReportController.reportAcademicRecord);
general.get('/report-academic-ficha/:id_registration/:id_student', verifyToken, ReportController.reportAcademicFicha);
general.get('/report-acta/:id_acta_book', verifyToken, ReportController.reportActa);
general.get('/report-study-plan/:id_plan', verifyToken,ReportController.reportStudyPlan);

//CHART APIS
general.get('/chart-inscription/:id_process', verifyToken, ReportController.chartInscriptionProcess);
general.get('/chart-registration/:id_process', verifyToken, ReportController.chartRegistrationProcess);
general.get('/chart-egress/:id_process', verifyToken, ReportController.chartEgressProcess);

general.get('/chart-student-required-document/:state/:id_process', verifyToken, ReportController.chartStudentRequiredDocumentProcess);
general.patch('/chart-movement-entry', verifyToken, ReportController.chartEntryMovement);
general.patch('/chart-movement-een', verifyToken, ReportController.chartEntryEgressNetoMovement);
general.get('/chart-total-student', verifyToken, ReportController.totalStudentByState);
general.get('/chart-total-student-egress', verifyToken, ReportController.totalStudentByStateEgress);
general.get('/chart-total-student-desertion', verifyToken, ReportController.totalStudentByStateDesertion);
general.get('/chart-total-payment-pendient', verifyToken, ReportController.totalStudentPaymentPendient);
general.get('/chart-student-payment-pendient', verifyToken, ReportController.listStudentPaymentPendient);


//WORK DATA APIS
//APIS PARA LA ACTUALIZACION DE DATOS REGISRTATION
general.get('/update-structure-registration-course', ReportController.updateStructureRegistrationCourse);// FALTABA UN CAMPO Y MEDIANTE UN JSON SE GENEREO DICHO CAMPO
general.get('/update-structure-schedule-horary', ReportController.updateStructureScheduleHorary);//GENERA LOS SCHDEULDES GRONOGRAMSA DE CURSOS
general.get('/update-schedule-repiet', ReportController.updateScheduleRepiet);//ELIMINA LOS DATOS DUPLICADOS GENERADOS EN LA FUNCION ANTERIOR
general.get('/update-create-schedule-json-data', ReportController.updateCreateScheduleJsonData);//GENERA LOS SCHDEULDES GRONOGRAMSA DE CURSOS SEGUN ARRAY
general.get('/update-registration-course-shedule-id', ReportController.updateRegisterScheduleIDinRegistrationCourse);//REGISTRAT EL ID SCHEDULE EN CADA REGISTRATION_COURSE
//APIS PARA LA ACTUALIZACION DE DATOS REGISRTATION
general.get('/update-student-required-document', ReportController.updateStudentRequiredDocument);
general.get('/update-student-modality', ReportController.updateStudentModality);//actualiza estudiates a modalidad distrancia apartir 2020
general.get('/update-student-type', ReportController.updateStudentType);// el estado postulante no debe existri por ahora, cambia de postulante a estudiante
general.get('/update-student-number-registration', ReportController.updateStudentNumberRegistration);//actualiza el numero de matriculas regulares o extemporanesa que tiene un estudiante
general.get('/update-student-egress', ReportController.updateStudentEgress);//busca estudiantes que ya aprobaron todos los creditos, y cambia el estado a egresado

general.get('/update-registration-data', ReportController.updateRegistrationData);//actualiza los datos en la tabla Registration que no tiene id_programa e id_organic_unti
general.get('/update-payment-program-organic-unit', ReportController.upatePaymentProgramOrganicUnit);  //actualiza los datos en la tabla PAYMENT que no tiene id_programa e id_organic_unti
general.get('/update-movement-program-organic-unit', ReportController.upateMovementProgramOrganicUnit);//actualiza los datos en la tabla movement que no tiene id_programa e id_organic_unti

general.get('/update-payment-json', ReportController.updatePaymentStructureJson);
general.get('/update-ubigeo-sunedu', ReportController.updateUbigeoSunedu);
general.get('/update-structure/person', ReportController.updateStructurePerson);
general.get('/update-structure/student', ReportController.updateStructureStudent);
general.get('/update-payment/order-number', ReportController.updatePaymentOrderNumber);

general.get('/update-requeriment-student', ReportController.updateRequerimentStudent);// elimina requisistos y genera nuevamente todos almacenando lo que ya estaba registrado
general.get('/migrate-all', MigrateController.migrateAllData);
general.get('/aprovedDesaproved', MigrateController.aprovedDesaproved);



// MPT
general.get('/number-students', ReportController.getNumberStudents);
general.get('/list-calendars', ReportController.getCalendars);
module.exports = general;
