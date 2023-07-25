'use strict';
module.exports = (sequelize, DataTypes) => {
    const Identification_document = sequelize.define('Identification_document', {
        denomination: {allowNull: false, type: DataTypes.STRING(255)},
        abbreviation: {allowNull: false, type: DataTypes.STRING(255)},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Identification_document",
        schema: 'general'
    });
    Identification_document.associate = function (models) {
        // associations can be defined here

    };
    return Identification_document;
};
