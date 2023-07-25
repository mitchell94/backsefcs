'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User_intranet', {
        id_person: {allowNull: true, type: DataTypes.INTEGER},
        user: {allowNull: false, type: DataTypes.STRING(15)},
        pass: {allowNull: false, type: DataTypes.STRING(255)},
        type: {allowNull: false, type: DataTypes.STRING(255)},
        end_date: {allowNull: false, type: DataTypes.STRING(30)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},

    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "User_intranet",
        schema: 'security'
    });
    User.associate = function (models) {


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
