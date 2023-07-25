'use strict';
module.exports = (sequelize, DataTypes) => {
    const Requeriment_delivered = sequelize.define('Requeriment_delivered', {
        id_student: {allowNull: false, type: DataTypes.INTEGER},
        id_requeriment: {allowNull: true, type: DataTypes.INTEGER},
        observation: {allowNull: true, type: DataTypes.STRING},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Requeriment_delivered",
        schema: 'person',


    });
    Requeriment_delivered.associate = function (models) {
        // associations can be defined here
        Requeriment_delivered.belongsTo(models.Requeriment, {
            foreignKey: 'id_requeriment',
            targetKey: 'id',
            as: 'Requeriment',
            onDelete: 'CASCADE',
        });
    };
    return Requeriment_delivered;
};
