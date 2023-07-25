'use strict';
module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        id_person: {allowNull: false, type: DataTypes.INTEGER},
        id_organic_unit: {allowNull: false, type: DataTypes.INTEGER},
        id_program: {allowNull: true, type: DataTypes.INTEGER},
        id_plan: {allowNull: false, type: DataTypes.INTEGER},
        id_admission_plan: {allowNull: false, type: DataTypes.INTEGER},
        id_cost_admission: {allowNull: true, type: DataTypes.INTEGER},
        id_concept: {allowNull: true, type: DataTypes.INTEGER},
        id_process_egress: {allowNull: true, type: DataTypes.INTEGER},
        type: {allowNull: true, type: DataTypes.STRING(50)},
        type_entry: {
            allowNull: true,
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        study_modality: {
            allowNull: false,
            type: DataTypes.ENUM('Presencial', 'Semi-Presencial', 'A distancia', 'Pendiente'),
            defaultValue: 'Presencial'
        },
        required_document: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false},
        egress_date: {allowNull: true, type: DataTypes.STRING(30)},
        observation: {allowNull: true, type: DataTypes.TEXT},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Student",
        schema: 'person',


    });
    Student.associate = function (models) {

        // Student.hasMany(models.Requeriment_delivered, {onDelete: 'cascade', hooks: true});

        Student.hasMany(models.Requeriment_delivered, {
            foreignKey: 'id_student',
            as: 'Requeriment_delivereds',

        });

        Student.hasMany(models.Registration, {
            foreignKey: 'id_student',
            as: 'Registration',

        });

        Student.hasOne(models.Payment, {
            foreignKey: 'id_student',
            as: 'Payment',
            onDelete: 'CASCADE'
        });
        Student.hasMany(models.Payment, {
            foreignKey: 'id_student',
            as: 'Payments',
            onDelete: 'CASCADE'
        });
        Student.hasOne(models.Movement, {
            foreignKey: 'id_student',
            as: 'Movement',
            onDelete: 'CASCADE'
        });
        Student.belongsTo(models.Concept, {
            foreignKey: 'id_concept',
            targetKey: 'id',
            as: 'Concept',

        });

        Student.belongsTo(models.Organic_unit, {
            foreignKey: 'id_organic_unit',
            targetKey: 'id',
            as: 'Organic_unit_register',
            onDelete: 'CASCADE',
        });

        Student.belongsTo(models.Organic_unit, {
            foreignKey: 'id_organic_unit',
            targetKey: 'id',
            as: 'Organic_unit',

        });

        Student.belongsTo(models.Programs, {
            foreignKey: 'id_program',
            targetKey: 'id',
            as: 'Program',

        });
        Student.belongsTo(models.Plan, {
            foreignKey: 'id_plan',
            targetKey: 'id',
            as: 'Plan',

        });

        Student.belongsTo(models.Admission_plan, {
            foreignKey: 'id_admission_plan',
            targetKey: 'id',
            as: 'Admission_plan',

        });


        Student.belongsTo(models.Cost_admission_plan, {
            foreignKey: 'id_cost_admission',
            targetKey: 'id',
            as: 'Cost_admission_plan',

        });


        Student.belongsTo(models.Person, {
            foreignKey: 'id_person',
            targetKey: 'id',
            as: 'Person',

        });

    };
    return Student;
};
