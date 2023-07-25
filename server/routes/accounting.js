const express = require('express');
const auth = require('../middlewares/auth');
const accounting = express.Router();
const verifyToken = require('../middlewares/auth');
const {UserIntranetController} = require("../controllers/intranet");

const MovementController = require('../controllers/accounting').MovementController;
const BoxController = require('../controllers/accounting').BoxController;
const PaymentController = require('../controllers/accounting').PaymentController;
const EgressController = require('../controllers/accounting').EgressController;


// accounting.post('/payment', PaymentController.create);
accounting.get('/payment-operation/:id', verifyToken, UserIntranetController.listConceptOperation);
accounting.get('/payment/student/:id', verifyToken, PaymentController.listPaymentStudent);
accounting.get('/payment/student/:id/operation', verifyToken, PaymentController.listPaymentStudentOperation);
accounting.get('/payment/student/:id/retirement', verifyToken, PaymentController.listPaymentRetirementByStudent);
accounting.post('/payment', verifyToken, PaymentController.createPayment);
accounting.patch('/payment-update/:id_payment', verifyToken, PaymentController.updatePayment);

accounting.patch('/payment/state', verifyToken, PaymentController.updateStatePayment);
accounting.patch('/payment/total-balance', verifyToken, PaymentController.listTotalBalance);
accounting.delete('/payment/:id', verifyToken, PaymentController.destroyPayment);


// accounting.get('/payment/:id', PaymentController.retrieve);
// accounting.patch('/payment/:id', PaymentController.update);
// accounting.delete('/payment/:id', PaymentController.destroy);
accounting.post('/movement', verifyToken, MovementController.createMovement);
accounting.patch('/movement/:id', verifyToken, MovementController.updateMovement);
accounting.get('/movement/student/:id_student', verifyToken, MovementController.listMovement);
accounting.get('/movement/pendient/:id_organic_unit', MovementController.listMovementPendientByOrganicUnit);
accounting.get('/movement/student/search/:parameter', MovementController.searchVoucherStudent);
accounting.delete('/movement/:id', verifyToken, MovementController.destroyMovement);


accounting.get('/egress/teacher/admission-plan/:id_admission_plan', verifyToken, EgressController.listTeacherEgressByPlan);
accounting.get('/egress/total/admission-plan/:id_admission_plan', verifyToken, EgressController.listTotalEgressByPlan);
accounting.get('/egress/administrative/admission-plan/:id_admission_plan', verifyToken, EgressController.listAdministrativeEgressByPlan);
accounting.get('/egress/material/admission-plan/:id_admission_plan', verifyToken, EgressController.listMaterialEgressByPlan);
accounting.post('/egress/teacher', verifyToken, EgressController.createEgressTeacher);
accounting.post('/egress/material', verifyToken, EgressController.createEgressMaterial);
accounting.post('/egress/administrative', verifyToken, EgressController.createEgressAdministrative);
accounting.patch('/egress/teacher/:id_egress', verifyToken, EgressController.updateEgressTeacher);
accounting.patch('/egress/material/:id_egress', verifyToken, EgressController.updateEgressMaterial);
accounting.patch('/egress/administrative/:id_egress', verifyToken, EgressController.updateEgressAdministrative);
accounting.delete('/egress/teacher/:id_egress', verifyToken, EgressController.destroyEgressTeacher);
accounting.delete('/egress/administrative/:id_egress', verifyToken, EgressController.destroyEgressAdministrative);
accounting.delete('/egress/material/:id_egress', verifyToken, EgressController.destroyEgressMaterial);
module.exports = accounting;
