'use strict';
module.exports = (sequelize, DataTypes) => {
    const Bank_account = sequelize.define('Bank_account', {
        id_bank: {allowNull: false, type: DataTypes.INTEGER,},
        number_account: {allowNull: false, type: DataTypes.STRING(50)},
        cci: {allowNull: false, type: DataTypes.STRING(200)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Bank_account",
        schema: 'general'
    });
    Bank_account.associate = function (models) {
        // associations can be defined here
        Bank_account.belongsTo(models.Bank, {
            foreignKey: 'id_bank',
            targetKey: 'id',
            as: 'Bank',
            onDelete: 'CASCADE'
        });
    };
    return Bank_account;
};
