'use strict';
module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define('Session', {
        id_user: {allowNull: false, type: DataTypes.UUID},
        token: {allowNull: false, type: DataTypes.TEXT},
        device_name: {allowNull: true, type: DataTypes.STRING(50)},
        ip: {allowNull: false, type: DataTypes.STRING(50)},
        mac: {allowNull: false, type: DataTypes.STRING(20)},
        device_type: {allowNull: true, type: DataTypes.TEXT},
        browser: {allowNull: true, type: DataTypes.TEXT},
        logueado: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},

    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Session",
        schema: 'security'
    });
    Session.associate = function (models) {
        // associations can be defined here
    };
    return Session;
};
