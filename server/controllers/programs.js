'use strict';
//////////////////////////////////PROGRAMS////////////////////////////////////////
//////////////////////////////////PROGRAMS////////////////////////////////////////
//////////////////////////////////PROGRAMS////////////////////////////////////////
const CourseController = require('./programs/course');
const ProgramsController = require('./programs/programs');
const CycleController = require('./programs/cycle');
const PlanController = require('./programs/plan');
const WorkPlanController = require('./programs/work_plan');
const AdmissionPlanController = require('./programs/admission_plan');
const DetailWorkPlanController = require('./programs/detail_work_plan');
const OrganizationWorkPlanController = require('./programs/organization_work_plan');
const EntryWorkPlanController = require('./programs/entry_work_plan');
const EgressAdministrativePlanController = require('./programs/egress_administrative');
const EgressComissionPlanController = require('./programs/egress_comission');
const EgressTeacherPlanController = require('./programs/egress_teacher');
const EgressMateriallanController = require('./programs/egress_material');
const CostAdmissionPlanController = require('./programs/cost_admission_plan');
const DocumentBookController = require('./programs/document_book');
const ActaBookController = require('./programs/acta_book');
const ProjectController = require('./programs/project');

/*******************************************************************************/


module.exports = {
    ProjectController,
    ActaBookController,
    DocumentBookController,
    CostAdmissionPlanController,
    EgressMateriallanController,
    EgressTeacherPlanController,
    EgressComissionPlanController,
    EgressAdministrativePlanController,
    EntryWorkPlanController,
    OrganizationWorkPlanController,
    DetailWorkPlanController,
    WorkPlanController,
    AdmissionPlanController,
    PlanController,
    CourseController,
    CycleController,
    ProgramsController,
};
