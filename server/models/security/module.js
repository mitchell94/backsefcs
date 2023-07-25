'use strict';
module.exports = (sequelize, DataTypes) => {
    const Module = sequelize.define('Module', {
        id_parent: {allowNull: true, type: DataTypes.INTEGER},
        module_name: {allowNull: true, type: DataTypes.STRING(120)},
        type: {allowNull: true, type: DataTypes.ENUM('noItem', 'item', 'group', 'collapse')},
        classes: {allowNull: true, type: DataTypes.STRING(120)},
        icon: {allowNull: true, type: DataTypes.STRING(50)},
        code: {allowNull: true, type: DataTypes.STRING(10)},
        order: {allowNull: false, type: DataTypes.SMALLINT},
        denomination: {allowNull: false, type: DataTypes.STRING(120)},
        url: {allowNull: true, type: DataTypes.STRING(120)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},

    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Module",
        schema: 'security'
    });
    Module.associate = function (models) {
        // associations can be defined here
        Module.hasMany(models.Module, {
            foreignKey: 'id_parent',
            as: 'children'
        });
        Module.hasMany(models.Privilege, {
            foreignKey: 'id_module',
            as: 'Privilege'
        });
    };
    return Module;
};
