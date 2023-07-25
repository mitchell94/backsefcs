'use strict';
module.exports = (sequelize, DataTypes) => {
    const Organic_unit_charge = sequelize.define('Organic_unit_charge', {
        id_organic_unit: {allowNull: true, type: DataTypes.INTEGER},
        id_charge: {allowNull: true, type: DataTypes.INTEGER},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Organic_unit_charge",
        schema: 'general'
    });
    Organic_unit_charge.associate = function (models) {
        // associations can be defined here
    };
    return Organic_unit_charge;
};
