'use strict';
module.exports = (sequelize, DataTypes) => {
    const Ubigeo = sequelize.define('Ubigeo', {
        district: {allowNull: false, type: DataTypes.STRING(100)},
        province: {allowNull: false, type: DataTypes.STRING(100)},
        department: {allowNull: false, type: DataTypes.STRING(100)},
        code: {allowNull: false, type: DataTypes.STRING(100)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        schema: 'general'
    });
    Ubigeo.associate = function (models) {


    };
    return Ubigeo;
};
