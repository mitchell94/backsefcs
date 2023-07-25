'use strict';
module.exports = (sequelize, DataTypes) => {
    const Building = sequelize.define('Building', {
        id_parent: {allowNull: true, type: DataTypes.INTEGER},
        id_campus: {allowNull: false, type: DataTypes.INTEGER},
        id_type_building: {allowNull: false, type: DataTypes.INTEGER},
        denomination: {allowNull: false, type: DataTypes.STRING(255)},
        abbreviation: {allowNull: false, type: DataTypes.STRING(255)},
        hierarchy: {allowNull: false, type: DataTypes.INTEGER},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Building",
        schema: 'general'
    });
    Building.associate = function (models) {
        // associations can be defined here
    };
    return Building;
};
