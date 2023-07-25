'use strict';
module.exports = (sequelize, DataTypes) => {
    const Cost_admission_plan = sequelize.define('Cost_admission_plan', {
        id_admission_plan: {allowNull: false, type: DataTypes.INTEGER},
        id_concept: {allowNull: false, type: DataTypes.INTEGER},
        amount: {allowNull: true, type: DataTypes.NUMERIC(7, 2)},
        cant: {allowNull: true, type: DataTypes.SMALLINT},
        observation: {allowNull: true, type: DataTypes.STRING},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        raw: true,
        tableName: "Cost_admission_plan",
        schema: 'programs'
    });
    Cost_admission_plan.associate = function (models) {
        Cost_admission_plan.belongsTo(models.Concept, {
            foreignKey: 'id_concept',
            targetKey: 'id',
            as: 'Concept',
            onDelete: 'CASCADE',
        });

    };
    return Cost_admission_plan;
};


