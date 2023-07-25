'use strict';
module.exports = (sequelize, DataTypes) => {
    const Detail_work_plan = sequelize.define('Detail_work_plan', {
        id_work_plan: {allowNull: false, type: DataTypes.INTEGER},
        foundation: {allowNull: true, type: DataTypes.TEXT},
        objective: {allowNull: true, type: DataTypes.TEXT},
        legal_base: {allowNull: true, type: DataTypes.TEXT},
        organization: {allowNull: true, type: DataTypes.TEXT},
        request: {allowNull: true, type: DataTypes.TEXT},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        raw: true,
        tableName: "Detail_work_plan",
        schema: 'programs'
    });
    Detail_work_plan.associate = function (models) {
    };
    return Detail_work_plan;
};
