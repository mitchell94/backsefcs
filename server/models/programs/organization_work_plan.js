'use strict';
module.exports = (sequelize, DataTypes) => {
    const Organization_work_plan = sequelize.define('Organization_work_plan', {
        id_work_plan: {allowNull: false, type: DataTypes.INTEGER},
        id_person: {allowNull: false, type: DataTypes.INTEGER},
        charge: {allowNull: true, type: DataTypes.STRING},
        observation: {allowNull: true, type: DataTypes.STRING},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        raw: true,
        tableName: "Organization_work_plan",
        schema: 'programs'
    });
    Organization_work_plan.associate = function (models) {
        Organization_work_plan.belongsTo(models.Person, {
            foreignKey: 'id_person',
            targetKey: 'id',
            as: 'Person',
            onDelete: 'CASCADE'
        });
    };
    return Organization_work_plan;
};

