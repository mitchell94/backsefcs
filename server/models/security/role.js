'use strict';
module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        denomination: {allowNull: false, type: DataTypes.TEXT},
        type: {
            allowNull: true,
            type: DataTypes.STRING(20)
        },
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},

    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Role",
        schema: 'security'
    });
    Role.associate = function (models) {
        // associations can be defined here
    };
    return Role;
};
