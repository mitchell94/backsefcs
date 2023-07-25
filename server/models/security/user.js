'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id_person: {allowNull: true, type: DataTypes.INTEGER},
        user: {allowNull: false, type: DataTypes.STRING(15)},
        pass: {allowNull: false, type: DataTypes.STRING(255)},
        god: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},

    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "User",
        schema: 'security'
    });
    User.associate = function (models) {
        // associations can be defined here
        User.hasMany(models.User_role, {
            foreignKey: 'id_user',
            as: 'User_roles',
        });
        // // // // // // // // //

        User.belongsTo(models.Person, {
            foreignKey: 'id_person',
            targetKey: 'id',
            as: 'Person',
            onDelete: 'CASCADE'
        });
        // // // // // // // // //
    };
    return User;
};
