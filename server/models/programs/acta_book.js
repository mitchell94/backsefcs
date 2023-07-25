'use strict';

module.exports = (sequelize, DataTypes) => {
    const Acta_book = sequelize.define('Acta_book', {
        id_course: {allowNull: false, type: DataTypes.INTEGER},
        id_program: {allowNull: false, type: DataTypes.INTEGER},
        id_schedule: {allowNull: false, type: DataTypes.INTEGER},
        id_admission_plan: {allowNull: true, type: DataTypes.INTEGER},
        id_process: {allowNull: false, type: DataTypes.INTEGER},
        id_teacher: {allowNull: false, type: DataTypes.INTEGER},
        correlative: {allowNull: true, type: DataTypes.STRING},
        type: {allowNull: true, type: DataTypes.STRING},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Acta_book",
        schema: 'programs'
    });

    Acta_book.associate = function (models) {
        // associations can be defined here


        Acta_book.belongsTo(models.Academic_semester, {
            foreignKey: 'id_process',
            targetKey: 'id',
            as: 'Academic_semester',
            onDelete: 'CASCADE',
        });
        Acta_book.belongsTo(models.Teacher, {
            foreignKey: 'id_teacher',
            targetKey: 'id',
            as: 'Teacher',
            onDelete: 'CASCADE',
        });


        Acta_book.belongsTo(models.Schedule, {
            foreignKey: 'id_schedule',
            targetKey: 'id',
            as: 'Schedule',
            onDelete: 'CASCADE',
        });
        Acta_book.belongsTo(models.Course, {
            foreignKey: 'id_course',
            targetKey: 'id',
            as: 'Course',
            onDelete: 'CASCADE',
        });
        Acta_book.belongsTo(models.Programs, {
            foreignKey: 'id_program',
            targetKey: 'id',
            as: 'Program',
            onDelete: 'CASCADE',
        });
        Acta_book.belongsTo(models.Admission_plan, {
            foreignKey: 'id_admission_plan',
            targetKey: 'id',
            as: 'Admission_plan',
            onDelete: 'CASCADE',
        });

    };


    return Acta_book;
};
