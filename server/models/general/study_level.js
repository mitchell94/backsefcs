'use strict';
module.exports = (sequelize, DataTypes) => {
    const Study_level = sequelize.define('Study_level', {
        denomination: {allowNull: false, type: DataTypes.STRING(255)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',

        raw: true,
        paranoid: true,
        underscored: true,
        tableName:"Study_level",
        schema: 'general'
    });
    Study_level.associate = function (models) {
        // associations can be defined here 


    };
    return Study_level;
};
