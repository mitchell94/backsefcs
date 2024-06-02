'use strict';
module.exports = (sequelize, DataTypes) => {
    const AdmissionWeb = sequelize.define('AdmissionWeb', {
        name: {allowNull: true, type: DataTypes.STRING(150)}
    }, {
        timestamps: false,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "admissions",
        schema: 'web'
    });
    return AdmissionWeb;
};
