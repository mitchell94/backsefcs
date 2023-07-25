'use strict';
//////////////////////////////////GENERAL////////////////////////////////////////
//////////////////////////////////GENERAL////////////////////////////////////////
//////////////////////////////////GENERAL////////////////////////////////////////
const AcademicCalendarController = require('./general/academic_calendar');
const AcademicSemesterController = require('./general/academic_semester');
const AcademicDegreeController = require('./general/academic_degree');
const ActivityTypeController = require('./general/activity_type');
const ActivityController = require('./general/activity');
const BuildingOrganicUnitController = require('./general/building_organic_unit');
const BuildingController = require('./general/building');
const CampusController = require('./general/campus');
const ChargeController = require('./general/charge');
const CivilStatusController = require('./general/civil_status');
const DocumentTypeController = require('./general/document_type');
const DocumentController = require('./general/document');
const IdentificationDocumentController = require('./general/identification_document');
const OpenAcademicController = require('./general/open_academic');
const OrganicUnitController = require('./general/organic_unit');
const OrganicUnitChargeController = require('./general/organic_unit_charge');
const SemesterActivityController = require('./general/semester_activity');
const SemesterController = require('./general/semester');
const SocialNetworkController = require('./general/social_network');
const StudyLevelController = require('./general/study_level');
const TypeBuildingController = require('./general/type_building');
const TypeOrganicUnitController = require('./general/type_organic_unit');
const UbigeoController = require('./general/ubigeo');
const UitController = require('./general/uit');
const BankController = require('./general/bank');
const BankAccountController = require('./general/bank_account');
const ContractTypeController = require('./general/contract_type');
const AcademicPeriodController = require('./general/academic_period');
const ConceptController = require('./general/concept');
const CategoryConcept = require('./general/category_concept');
const UnitMeasure = require('./general/unit_measure');
const MaterialController = require('./general/material');
const LocationController = require('./general/location');
const ReportController = require('./general/report');
const RequerimentController = require('./general/requeriment');
const GeneralController = require('./general/general');
const MigrateController = require('./general/migrate');
/*******************************************************************************/


module.exports = {
    MigrateController,
    GeneralController,
    ReportController,
    RequerimentController,
    LocationController,
    BankAccountController,
    CategoryConcept,
    ConceptController,
    AcademicCalendarController,
    AcademicPeriodController,
    AcademicSemesterController,
    AcademicDegreeController,
    ActivityTypeController,
    ActivityController,
    BuildingOrganicUnitController,
    BuildingController,
    CampusController,
    ChargeController,
    CivilStatusController,
    DocumentTypeController,
    DocumentController,
    IdentificationDocumentController,
    OpenAcademicController,
    OrganicUnitController,
    OrganicUnitChargeController,
    SemesterActivityController,
    SemesterController,
    SocialNetworkController,
    StudyLevelController,
    TypeBuildingController,
    TypeOrganicUnitController,
    UbigeoController,
    UitController,
    MaterialController,
    UnitMeasure,
    BankController,
    ContractTypeController

};
