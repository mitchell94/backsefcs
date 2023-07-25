'use strict';
module.exports = (sequelize, DataTypes) => {
    const User_role = sequelize.define('User_role', {
        id_user: {allowNull: false, type: DataTypes.UUID},
        id_organic_unit: {allowNull: false, type: DataTypes.INTEGER},
        id_role: {allowNull: true, type: DataTypes.INTEGER},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "User_role",
        schema: 'security'
    });
    User_role.associate = function (models) {
        // associations can be defined here

        User_role.belongsTo(models.Organic_unit, {
            foreignKey: 'id_organic_unit',
            targetKey: 'id',
            as: 'Organic_unit',
            onDelete: 'CASCADE'
        });
        User_role.belongsTo(models.Role, {
            foreignKey: 'id_role',
            targetKey: 'id',
            as: 'Role',
            onDelete: 'CASCADE'
        });
    };
    return User_role;
};
