'use strict';
module.exports = (sequelize, DataTypes) => {
    const Type_organic_unit = sequelize.define('Type_organic_unit', {
        denomination: {allowNull: false, type: DataTypes.STRING(255)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Type_organic_unit",
        schema: 'general'
    });
    Type_organic_unit.associate = function (models) {
        // associations can be defined here
        Type_organic_unit.hasMany(models.Organic_unit, {
            foreignKey: 'id_type_organic_unit',
            as: 'Organic_unit'
        });
    };
    return Type_organic_unit;
};
