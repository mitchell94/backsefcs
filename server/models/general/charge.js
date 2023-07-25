'use strict';
module.exports = (sequelize, DataTypes) => {
    const Charge = sequelize.define('Charge', {
        denomination: {allowNull: false, type: DataTypes.STRING(255)},
        abbreviation: {allowNull: true, type: DataTypes.STRING(255)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Charge",
        schema: 'general'
    });
    Charge.associate = function (models) {
        // associations can be defined here
        Charge.hasMany(models.Organic_unit_charge, {
            foreignKey: 'id_charge',
            as: 'Organic_unit_charge'
        });
    };
    return Charge;
};
