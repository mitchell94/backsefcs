'use strict';
module.exports = (sequelize, DataTypes) => {
    const Plan = sequelize.define('Plan', {
        id_program: {allowNull: false, type: DataTypes.INTEGER},
        code: {allowNull: false, type: DataTypes.STRING(6)},
        description: {allowNull: false, type: DataTypes.TEXT},
        credit_required: {allowNull: false, type: DataTypes.SMALLINT},
        credit_elective: {allowNull: true, type: DataTypes.SMALLINT},
        mesh: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false},
        valid: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Plan",
        schema: 'programs'
    });
    Plan.associate = function (models) {
        // associations can be defined here

        Plan.hasMany(models.Ciclo, {
            foreignKey: 'id_plan',
            as: 'Ciclos',
        });
        Plan.belongsTo(models.Programs, {
            foreignKey: 'id_program',
            targetKey: 'id',
            as: 'Program',

        });
    };
    return Plan;
};
