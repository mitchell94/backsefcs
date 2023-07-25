'use strict';
module.exports = (sequelize, DataTypes) => {
    const Ciclo = sequelize.define('Ciclo', {
        id_plan: {allowNull: false, type: DataTypes.INTEGER},
        ciclo: {allowNull: false, type: DataTypes.ENUM("I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X")},
        period: {allowNull: false, type: DataTypes.STRING(2)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Ciclo",
        schema: 'programs'
    });
    Ciclo.associate = function (models) {

        Ciclo.hasMany(models.Course, {
            foreignKey: 'id_ciclo',
            as: 'Course',
        });
        Ciclo.belongsTo(models.Plan, {
            foreignKey: 'id_plan',
            targetKey: 'id',
            as: 'Plan',

        });

    };
    return Ciclo;
};
