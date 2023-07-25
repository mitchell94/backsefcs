'use strict';
module.exports = (sequelize, DataTypes) => {
    const Program_document = sequelize.define('Program_document', {
        id_program: {allowNull: false, type: DataTypes.INTEGER},
        id_document: {allowNull: true, type: DataTypes.INTEGER},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Program_document",
        schema: 'programs'
    });
    Program_document.associate = function (models) {
        // associations can be defined here
        Program_document.belongsTo(models.Document, {
            foreignKey: 'id_document',
            targetKey: 'id',
            as: 'Document',
            onDelete: 'CASCADE',
        });
    };
    return Program_document;
};
