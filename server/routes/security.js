const express = require('express');
const security = express.Router();
const verifyToken = require('../middlewares/auth');

const SessionController = require('../controllers/security').SessionController;
const ModuleController = require('../controllers/security').ModuleController;
const PrivilegeController = require('../controllers/security').PrivilegeController;
const RoleController = require('../controllers/security').RoleController;
const UserController = require('../controllers/security').UserController;


security.post('/role', verifyToken, RoleController.create);
security.get('/role', verifyToken, RoleController.list);
security.get('/role/type/:type', verifyToken, RoleController.listTypeRole);
security.get('/role/:id', verifyToken, RoleController.retrieve);
security.patch('/role/:id', verifyToken, RoleController.update);
security.delete('/role/:id', verifyToken, RoleController.destroy);


security.post('/privilege', verifyToken, PrivilegeController.create);
security.get('/privilege', verifyToken, PrivilegeController.list);
security.get('/privilege/:id', verifyToken, PrivilegeController.retrieve);
security.patch('/privilege/:id', verifyToken, PrivilegeController.update);
security.delete('/privilege/:id', verifyToken, PrivilegeController.destroy);


security.post('/module', verifyToken, ModuleController.create);
security.get('/module', verifyToken, ModuleController.list);
security.get('/jsonmodule', verifyToken, ModuleController.listJson);
security.get('/module/nav', ModuleController.listNav);
security.get('/module/nav/role/:id', verifyToken, ModuleController.listNavRole);
security.get('/module/role/:id', verifyToken, ModuleController.listWithRole);
security.get('/module/:id', verifyToken, ModuleController.retrieve);
security.patch('/module/:id', verifyToken, ModuleController.update);
security.delete('/module/:id', verifyToken, ModuleController.destroy);

security.post('/user', verifyToken, UserController.create);
security.post('/user/create', verifyToken, UserController.createDemi);
security.get('/user/:id_user/log', UserController.listUserLogID);
security.patch('/user/demi/update', verifyToken, verifyToken, UserController.updateDemiUserPass);
security.get('/user', verifyToken, UserController.list);
security.get('/users', verifyToken, UserController.listUsers);
security.get('/user/student/:id_person/:id_organic_unit', verifyToken, UserController.listUserStudent);
security.get('/user/teacher/:id_person/:id_organic_unit', verifyToken, UserController.listUserTeacher);
security.get('/user/administrative/:id_person/:id_organic_unit', verifyToken, UserController.listUserAdministrative);
security.patch('/user/update-password/:id', verifyToken, UserController.update_password);
security.get('/user/:id/roles', verifyToken, UserController.listUserID);
security.get('/user/god', verifyToken, UserController.list_user_god);

security.get('/user/:id', verifyToken, UserController.getUserInformation);
security.patch('/user/:id', verifyToken, UserController.update);
security.delete('/user/:id', verifyToken, UserController.destroy);
security.patch('/user/state/:id', verifyToken, UserController.updateStateUser);


//estas apsi no tiene token
security.post('/user/login', UserController.validate_password);
security.post('/session', SessionController.createSession);
security.patch('/session/:id/logout', SessionController.logout);


security.get('/session', SessionController.list);
security.get('/session/:id', SessionController.retrieve);
security.patch('/session/:id', SessionController.update);
security.delete('/session/:id', SessionController.destroy);

module.exports = security;
