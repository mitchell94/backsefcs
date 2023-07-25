'use strict';
module.exports = (sequelize, DataTypes) => {
    const Type_building = sequelize.define('Type_building', {
        denomination: {allowNull: false, type: DataTypes.STRING(255)}, 
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Type_building",
        schema: 'general'
    });
    Type_building.associate = function (models) {
        // associations can be defined here
    };
    return Type_building;
};
