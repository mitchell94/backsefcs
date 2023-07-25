'use strict';
module.exports = (sequelize, DataTypes) => {
    const Teacher = sequelize.define('Teacher', {
        id_person: {allowNull: true, type: DataTypes.INTEGER},
        id_organic_unit: {allowNull: false, type: DataTypes.INTEGER},
        id_schedule: {allowNull: false, type: DataTypes.INTEGER},
        id_charge: {allowNull: true, type: DataTypes.INTEGER},
        date_start: {allowNull: true, type: DataTypes.STRING(30)},
        date_end: {allowNull: true, type: DataTypes.STRING(30)},
        id_contract_type: {allowNull: true, type: DataTypes.INTEGER},
        denomination: {allowNull: true, type: DataTypes.STRING(255)},
        principal: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false},
        fixed_teacher: {allowNull: true, type: DataTypes.BOOLEAN, defaultValue: false},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Teacher",
        schema: 'person'
    });
    Teacher.associate = function (models) {

        Teacher.belongsTo(models.Person, {
            foreignKey: 'id_person',
            targetKey: 'id',
            as: 'Person',
            onDelete: 'CASCADE',
        });

        Teacher.belongsTo(models.Charge, {
            foreignKey: 'id_charge',
            targetKey: 'id',
            as: 'Charge',
            onDelete: 'CASCADE',
        });
        Teacher.belongsTo(models.Schedule, {
            foreignKey: 'id_schedule',
            targetKey: 'id',
            as: 'Schedule',
            onDelete: 'CASCADE',
        });
        Teacher.belongsTo(models.Organic_unit, {
            foreignKey: 'id_organic_unit',
            targetKey: 'id',
            as: 'Organic_unit',
            onDelete: 'CASCADE',
        });
        Teacher.belongsTo(models.Contract_type, {
            foreignKey: 'id_contract_type',
            targetKey: 'id',
            as: 'Contract_type',
            onDelete: 'CASCADE',
        });
        Teacher.hasMany(models.Horary, {
            foreignKey: 'id_teacher',
            as: 'Horarys',
        });

    };
    return Teacher;
};
