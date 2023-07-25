'use strict';
module.exports = (sequelize, DataTypes) => {
    const Semester = sequelize.define('Semester', {
        denomination: {allowNull: false, type: DataTypes.STRING(100)},
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
    Semester.associate = function (models) {
        // associations can be defined here

    };
    return Semester;
};
