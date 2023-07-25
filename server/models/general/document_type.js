'use strict';
module.exports = (sequelize, DataTypes) => {
    const Document_type = sequelize.define('Document_type', {
        denomination: {allowNull: false, type: DataTypes.STRING(100)},
        abbreviation: {allowNull: true, type: DataTypes.STRING(100)}
    }, {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Document_type",
        schema: 'general'
    });
    Document_type.associate = function (models) {
        // associations can be defined here
        Document_type.hasMany(models.Document, {
            foreignKey: 'id_document_type',
            as: 'Document'
        });
    };
    return Document_type;
};
