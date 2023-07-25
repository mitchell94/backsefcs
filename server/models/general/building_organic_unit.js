'use strict';
module.exports = (sequelize, DataTypes) => {
    const Building_organic_unit = sequelize.define('Building_organic_unit', {
        id_organic_unit: {allowNull: true, type: DataTypes.INTEGER},
        id_building: {allowNull: true, type: DataTypes.INTEGER}, 
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Building_organic_unit",
        schema: 'general'
    });
    Building_organic_unit.associate = function (models) {
        // associations can be defined here
    };
    return Building_organic_unit;
};
