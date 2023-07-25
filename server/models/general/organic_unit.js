'use strict';
module.exports = (sequelize, DataTypes) => {
    const Organic_unit = sequelize.define('Organic_unit', {
        id_parent: {allowNull: true, type: DataTypes.INTEGER},
        id_campus: {allowNull: false, type: DataTypes.INTEGER},
        id_type_organic_unit: {allowNull: false, type: DataTypes.INTEGER},
        denomination: {allowNull: false, type: DataTypes.STRING(255)},
        abbreviation: {allowNull: false, type: DataTypes.STRING(255)},
        code_local: {allowNull: true, type: DataTypes.STRING(10)},
        code_faculty_unit: {allowNull: true, type: DataTypes.STRING(10)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Organic_unit",
        schema: 'general'
    });
    Organic_unit.associate = function (models) {
        // associations can be defined here
        Organic_unit.belongsTo(models.Type_organic_unit, {
            foreignKey: 'id_type_organic_unit',
            targetKey: 'id',
            as: 'Type_organic_unit',
            onDelete: 'CASCADE'
        });
        // FORMA CORTA
        Organic_unit.belongsTo(models.Type_organic_unit, {
            foreignKey: 'id_type_organic_unit',
            targetKey: 'id',
            as: 'T_o_u',
            onDelete: 'CASCADE'
        });
        Organic_unit.belongsTo(models.Campus, {
            foreignKey: 'id_campus',
            targetKey: 'id',
            as: 'Campu',
            onDelete: 'CASCADE'
        });

        Organic_unit.hasMany(models.Organic_unit, {
            foreignKey: 'id_parent',
            as: 'children'
        });
        Organic_unit.hasMany(models.Movement, {
            foreignKey: 'id_organic_unit',
            as: 'Movements'
        });
        Organic_unit.hasMany(models.Egress, {
            foreignKey: 'id_organic_unit',
            as: 'Egresss'
        });

    };
    return Organic_unit;
};
