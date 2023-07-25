'use strict';
module.exports = (sequelize, DataTypes) => {
    const Requeriment = sequelize.define('Requeriment', {
        id_academic_degree: {allowNull: false, type: DataTypes.INTEGER},
        id_concept: {allowNull: false, type: DataTypes.INTEGER},
        description: {allowNull: false, type: DataTypes.TEXT},
        type_entry: {allowNull: false, type: DataTypes.STRING},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Requeriment",
        schema: 'general'
    });
    Requeriment.associate = function (models) {
        // associations can be defined here

        Requeriment.belongsTo(models.Concept, {
            foreignKey: 'id_concept',
            targetKey: 'id',
            as: 'Concept',
            onDelete: 'CASCADE'
        });

        Requeriment.belongsTo(models.Academic_degree, {
            foreignKey: 'id_academic_degree',
            targetKey: 'id',
            as: 'Academic_degree',
            onDelete: 'CASCADE'
        });
    };
    return Requeriment;
};
