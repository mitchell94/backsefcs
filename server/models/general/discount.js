'use strict';
module.exports = (sequelize, DataTypes) => {
    const Discount = sequelize.define('Discount', {
        description: {allowNull: false, type: DataTypes.SMALLINT},
        amount: {allowNull: false, type: DataTypes.NUMERIC(7, 2)},
        type: {
            allowNull: false,
            type: DataTypes.ENUM('Estudiante', 'Docente', 'Administrativo')
        },
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Discount",
        schema: 'general'
    });
    Discount.associate = function (models) {
        // associations can be defined here
    };
    return Discount;
};
