const express = require('express');
const web = express.Router();

const InscriptionController = require('../controllers/web').InscriptionController;
const ProgramController = require('../controllers/web').ProgramController;
const AdmissionController = require('../controllers/web').AdmissionController;

web.get('/inscriptions/:id', InscriptionController.list);
web.post('/inscriptions', InscriptionController.create);

web.get('/programs', ProgramController.list);

web.get('/admissions', AdmissionController.list);

module.exports = web;