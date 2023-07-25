'use strict';
module.exports = (sequelize, DataTypes) => {
    const Privilege = sequelize.define('Privilege', {
        id_role: {allowNull: false, type: DataTypes.INTEGER},
        id_module: {allowNull: false, type: DataTypes.INTEGER},
        permit: {allowNull: false, type: DataTypes.ENUM('C', 'R', 'U', 'D')},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},

    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Privilege",
        schema: 'security'
    });
    Privilege.associate = function (models) {
        // associations can be defined here
        Privilege.belongsTo(models.Module, {
            foreignKey: 'id_role',
            targetKey: 'id',
            as: 'Module',
            onDelete: 'CASCADE'
        });
    };
    return Privilege;
};
