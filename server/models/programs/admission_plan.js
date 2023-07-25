'use strict';
module.exports = (sequelize, DataTypes) => {
    const Admission_plan = sequelize.define('Admission_plan', {
        id_program: {allowNull: false, type: DataTypes.INTEGER,},
        id_plan: {allowNull: false, type: DataTypes.INTEGER,},
        id_process: {allowNull: false, type: DataTypes.INTEGER,},
        description: {allowNull: false, type: DataTypes.STRING(200)},
        number_student: {allowNull: true, type: DataTypes.SMALLINT},
        date_start: {allowNull: false, type: DataTypes.STRING(30)},
        date_end: {allowNull: true, type: DataTypes.STRING(30)},
        date_class: {allowNull: true, type: DataTypes.STRING(30)},
        duration: {allowNull: true, type: DataTypes.SMALLINT},
        type_process: {
            allowNull: false,
            type: DataTypes.ENUM('Regular'),
            defaultValue: 'Regular'
        },
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        raw: true,
        tableName: "Admission_plan",
        schema: 'programs'
    });
    Admission_plan.associate = function (models) {
        Admission_plan.belongsTo(models.Academic_semester, {
            foreignKey: 'id_process',
            targetKey: 'id',
            as: 'Process',
            onDelete: 'CASCADE',
        });
        Admission_plan.belongsTo(models.Plan, {
            foreignKey: 'id_plan',
            targetKey: 'id',
            as: 'Plan',
            onDelete: 'CASCADE',
        });
        Admission_plan.belongsTo(models.Programs, {
            foreignKey: 'id_program',
            targetKey: 'id',
            as: 'Program',
            onDelete: 'CASCADE'
        });
        Admission_plan.belongsTo(models.Academic_semester, {
            foreignKey: 'id_process',
            targetKey: 'id',
            as: 'Academic_semester',
            onDelete: 'CASCADE'
        });

        Admission_plan.hasOne(models.Student, {
            foreignKey: 'id_admission_plan',
            as: 'Student',
        });
        Admission_plan.hasOne(models.Cost_admission_plan, {
            foreignKey: 'id_admission_plan',
            as: 'Cost_admission_plan',
        });
        Admission_plan.hasMany(models.Cost_admission_plan, {
            foreignKey: 'id_admission_plan',
            as: 'Cost_admission_plans',
        });
    };
    return Admission_plan;
};


