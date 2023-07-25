'use strict';
module.exports = (sequelize, DataTypes) => {
    const Document_book = sequelize.define('Document_book', {
        id_concept: {allowNull: false, type: DataTypes.INTEGER},
        id_academic_calendar: {allowNull: false, type: DataTypes.INTEGER},
        id_payment: {allowNull: false, type: DataTypes.INTEGER},
        id_program: {allowNull: false, type: DataTypes.INTEGER},
        id_student: {allowNull: false, type: DataTypes.INTEGER},
        correlative: {allowNull: true, type: DataTypes.STRING},
        file: {allowNull: true, type: DataTypes.STRING},
        type: {allowNull: true, type: DataTypes.STRING},
        observation: {allowNull: true, type: DataTypes.STRING},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
        state_upload: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Document_book",
        schema: 'programs'
    });
    Document_book.associate = function (models) {
        // associations can be defined here
        Document_book.belongsTo(models.Concept, {
            foreignKey: 'id_concept',
            targetKey: 'id',
            as: 'Concept',
            onDelete: 'CASCADE'
        });
        Document_book.belongsTo(models.Academic_calendar, {
            foreignKey: 'id_academic_calendar',
            targetKey: 'id',
            as: 'Academic_calendar',
            onDelete: 'CASCADE'
        });
        Document_book.belongsTo(models.Student, {
            foreignKey: 'id_student',
            targetKey: 'id',
            as: 'Student',
            onDelete: 'CASCADE'
        });

        Document_book.belongsTo(models.Programs, {
            foreignKey: 'id_program',
            targetKey: 'id',
            as: 'Program',

        });
    };


    return Document_book;
};
