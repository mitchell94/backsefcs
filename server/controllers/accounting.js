'use strict';
//////////////////////////////////ACCOUNTING////////////////////////////////////////
//////////////////////////////////ACCOUNTING////////////////////////////////////////
//////////////////////////////////ACCOUNTING////////////////////////////////////////
const MovementController = require('./accounting/movement');
const BoxController = require('./accounting/box');
const PaymentController = require('./accounting/payment');
const EgressController = require('./accounting/egress');
/*******************************************************************************/


module.exports = {
    EgressController,
    MovementController,
    BoxController,
    PaymentController,
};
