'use strict';
module.exports = (sequelize, DataTypes) => {
    const Horary = sequelize.define('Horary', {
        id_schedule: {allowNull: true, type: DataTypes.INTEGER},
        id_teacher: {allowNull: true, type: DataTypes.INTEGER},
        type_course: {allowNull: false, type: DataTypes.STRING},
        days: {allowNull: false, type: DataTypes.STRING(100)},
        ambient: {allowNull: false, type: DataTypes.STRING(100)},
        start_time: {allowNull: false, type: DataTypes.STRING(100)},
        end_time: {allowNull: false, type: DataTypes.STRING(100)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Horary",
        schema: 'registration'
    });
    Horary.associate = function (models) {
        // associations can be defined here

        Horary.belongsTo(models.Teacher, {
            foreignKey: 'id_teacher',
            targetKey: 'id',
            as: 'Teacher',
            onDelete: 'CASCADE'
        });

    };
    return Horary;
};
