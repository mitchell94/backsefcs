'use strict';
module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define('Department', {
        id_country: {allowNull: false, type: DataTypes.INTEGER},
        description: {allowNull: false, type: DataTypes.STRING(100)},
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
    Department.associate = function (models) {
        Department.belongsTo(models.Country, {
            foreignKey: 'id_country',
            targetKey: 'id',
            as: 'Country',
            onDelete: 'CASCADE'
        });

    };
    return Department;
};
