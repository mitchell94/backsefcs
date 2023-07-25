'use strict';
module.exports = (sequelize, DataTypes) => {
    const Open_academic = sequelize.define('Open_academic', {
        id_academic_calendar: {allowNull: false, type: DataTypes.INTEGER},
        denomination: {allowNull: false, type: DataTypes.STRING(100)},
        date_start: {allowNull: true, type: DataTypes.STRING(30)},
        date_end: {allowNull: true, type: DataTypes.STRING(30)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Open_academic",
        schema: 'general'
    });
    Open_academic.associate = function (models) {
        // associations can be defined here
    };
    return Open_academic;
};
