'use strict';
module.exports = (sequelize, DataTypes) => {
    const Province = sequelize.define('Province', {
        id_department: {allowNull: false, type: DataTypes.INTEGER},
        description: {allowNull: false, type: DataTypes.STRING},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        schema: 'general'
    });
    Province.associate = function (models) {
        Province.belongsTo(models.Department, {
            foreignKey: 'id_department',
            targetKey: 'id',
            as: 'Department',
            onDelete: 'CASCADE'
        });
    };
    return Province;
};
