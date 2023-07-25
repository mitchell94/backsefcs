'use strict';
module.exports = (sequelize, DataTypes) => {
    const Student_document = sequelize.define('Student_document', {
        id_student: {allowNull: false, type: DataTypes.INTEGER},
        id_document: {allowNull: true, type: DataTypes.INTEGER},
        id_registration: {allowNull: true, type: DataTypes.INTEGER},
        note: {allowNull: true, type: DataTypes.SMALLINT, defaultValue: 0},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Student_document",
        schema: 'person'
    });
    Student_document.associate = function (models) {
        // associations can be defined here
        Student_document.belongsTo(models.Document, {
            foreignKey: 'id_document',
            targetKey: 'id',
            as: 'Document',
            onDelete: 'CASCADE',
        });

    };
    return Student_document;
};
