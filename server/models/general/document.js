'use strict';
module.exports = (sequelize, DataTypes) => {
    const Document = sequelize.define('Document', {
        id_parent: {allowNull: true, type: DataTypes.INTEGER},
        id_document_type: {allowNull: false, type: DataTypes.INTEGER},
        id_unit_organic: {allowNull: false, type: DataTypes.INTEGER},
        topic: {allowNull: true, type: DataTypes.TEXT},
        emission_date: {allowNull: true, type: DataTypes.STRING(30)},
        code: {allowNull: true, type: DataTypes.TEXT},
        content: {allowNull: true, type: DataTypes.TEXT},
        archive: {allowNull: true, type: DataTypes.STRING(50)},
        expedient: {allowNull: true, type: DataTypes.STRING(50)},
        receibed_date: {allowNull: true, type: DataTypes.STRING(30)},
        state: {allowNull: false, type: DataTypes.BOOLEAN,defaultValue:true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Document",
        schema: 'general'

    });
    Document.associate = function (models) {
        // associations can be defined here
        Document.belongsTo(models.Document_type, {
            foreignKey: 'id_document_type',
            targetKey: 'id',
            as: 'Document_type',
            onDelete: 'CASCADE',
        });

        Document.belongsTo(models.Organic_unit, {
            foreignKey: 'id_unit_organic',
            targetKey: 'id',
            as: 'Organic_unit',
            onDelete: 'CASCADE',
        });
    };
    return Document;
};
