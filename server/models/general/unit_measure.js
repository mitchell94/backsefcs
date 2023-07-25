'use strict';
module.exports = (sequelize, DataTypes) => {
    const Unit_measure = sequelize.define('Unit_measure', {
        description: {allowNull: true, type: DataTypes.STRING},
        equivalence: {allowNull: true, type: DataTypes.SMALLINT},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        raw: true,
        tableName: "Unit_measure",
        schema: 'general'
    });
    Unit_measure.associate = function (models) {
    };
    return Unit_measure;
};


