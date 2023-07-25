'use strict';
module.exports = (sequelize, DataTypes) => {
    const Material = sequelize.define('Material', {
        denomination: {allowNull: true, type: DataTypes.STRING(100)},
        type: {allowNull: true, type: DataTypes.STRING(100)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        raw: true,
        tableName: "Material",
        schema: 'general'
    });
    Material.associate = function (models) {
    };
    return Material;
};

