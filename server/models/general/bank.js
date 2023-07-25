'use strict';
module.exports = (sequelize, DataTypes) => {
    const Bank = sequelize.define('Bank', {
        denomination: {allowNull: false, type: DataTypes.STRING(255)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Bank",
        schema: 'general'
    });
    Bank.associate = function (models) {
        // associations can be defined here

    };
    return Bank;
};
