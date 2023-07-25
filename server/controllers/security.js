'use strict';
//////////////////////////////////SECURITY////////////////////////////////////////
//////////////////////////////////SECURITY////////////////////////////////////////
//////////////////////////////////SECURITY////////////////////////////////////////
const SessionController = require('./security/session');
const ModuleController = require('./security/module');
const PrivilegeController = require('./security/privilege');
const RoleController = require('./security/role');
const UserController = require('./security/user');
/*******************************************************************************/

module.exports = {
    SessionController,
    ModuleController,
    PrivilegeController,
    RoleController,
    UserController
};
