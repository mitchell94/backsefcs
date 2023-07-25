'use strict';
const {Observation_project} = require("../index");
module.exports = (sequelize, DataTypes) => {
    const Programs = sequelize.define('Programs', {
        id_unit_organic_register: {allowNull: false, type: DataTypes.INTEGER},// unidada organica que registra el programa de estudio
        id_unit_organic_origin: {allowNull: false, type: DataTypes.INTEGER}, //unidada organica que general el programa de estudio
        id_academic_degree: {allowNull: false, type: DataTypes.INTEGER},
        code: {allowNull: false, type: DataTypes.STRING(10)},
        denomination: {allowNull: false, type: DataTypes.TEXT},
        description: {allowNull: true, type: DataTypes.TEXT},
        mesh: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Programs",
        schema: 'programs'
    });
    Programs.associate = function (models) {
        // associations can be defined here
        Programs.belongsTo(models.Organic_unit, {
            foreignKey: 'id_unit_organic_register',
            targetKey: 'id',
            as: 'Organic_unit_register',
            onDelete: 'CASCADE',
        });
        Programs.belongsTo(models.Organic_unit, {
            foreignKey: 'id_unit_organic_origin',
            targetKey: 'id',
            as: 'Organic_unit_origin',
            onDelete: 'CASCADE',
        });
        Programs.belongsTo(models.Academic_degree, {
            foreignKey: 'id_academic_degree',
            targetKey: 'id',
            as: 'Academic_degree',
            onDelete: 'CASCADE',
        });


        Programs.hasOne(models.Plan, {
            foreignKey: 'id_program',
            as: 'Plan',
        });

        Programs.hasMany(models.Plan, {
            foreignKey: 'id_program',
            as: 'Plans',
        });
        Programs.hasMany(models.Program_document, {
            foreignKey: 'id_program',
            as: 'Program_documents',
        });
        Programs.hasMany(models.Movement, {
            foreignKey: 'id_program',
            as: 'Movements',
        });
        Programs.hasMany(models.Admission_plan, {
            foreignKey: 'id_program',
            as: 'Admission_plans',
        });

        Programs.hasOne(models.Work_plan, {
            foreignKey: 'id_program',
            as: 'Work_plan',
        });

        Programs.hasOne(models.Registration, {
            foreignKey: 'id_program',
            as: 'Registration',
        });
        Programs.hasMany(models.Registration, {
            foreignKey: 'id_program',
            as: 'Registrations',
        });
        Programs.hasOne(models.Admission_plan, {
            foreignKey: 'id_program',
            as: 'Admission_plan',
        });
        Programs.hasOne(models.Student, {
            foreignKey: 'id_program',
            as: 'Student',
        });
    };


    return Programs;
};
