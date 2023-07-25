'use strict';
module.exports = (sequelize, DataTypes) => {
    const Work_plan = sequelize.define('Work_plan', {
        id_program: {allowNull: false, type: DataTypes.INTEGER},
        id_plan: {allowNull: false, type: DataTypes.INTEGER},
        id_process: {allowNull: false, type: DataTypes.INTEGER},
        description: {allowNull: false, type: DataTypes.STRING(200)},
        number_student: {allowNull: true, type: DataTypes.SMALLINT},
        days: {allowNull: false, type: DataTypes.JSONB},
        date_start: {allowNull: false, type: DataTypes.STRING(30)},
        date_end: {allowNull: true, type: DataTypes.STRING(30)},
        start_time: {allowNull: false, type: DataTypes.STRING(100)},
        end_time: {allowNull: false, type: DataTypes.STRING(100)},
        foundation: {allowNull: true, type: DataTypes.TEXT},
        objective: {allowNull: true, type: DataTypes.TEXT},
        legal_base: {allowNull: true, type: DataTypes.TEXT},
        request: {allowNull: true, type: DataTypes.TEXT},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        raw: true,
        tableName: "Work_plan",
        schema: 'programs'
    });
    Work_plan.associate = function (models) {
        Work_plan.belongsTo(models.Academic_semester, {
            foreignKey: 'id_process',
            targetKey: 'id',
            as: 'Process',
            onDelete: 'CASCADE',
        });
        Work_plan.belongsTo(models.Plan, {
            foreignKey: 'id_plan',
            targetKey: 'id',
            as: 'Plan',
            onDelete: 'CASCADE',
        });
        Work_plan.belongsTo(models.Programs, {
            foreignKey: 'id_program',
            targetKey: 'id',
            as: 'Program',
            onDelete: 'CASCADE'
        });
        Work_plan.hasMany(models.Entry, {
            foreignKey: 'id_work_plan',
            as: 'Entrys',
        });
    };
    return Work_plan;
};


