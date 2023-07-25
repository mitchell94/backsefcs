'use strict';
module.exports = (sequelize, DataTypes) => {
    const Concept = sequelize.define('Concept', {
        id_category_concept: {allowNull: true, type: DataTypes.INTEGER},
        order: {allowNull: true, type: DataTypes.SMALLINT},
        denomination: {allowNull: true, type: DataTypes.STRING},
        type: {allowNull: false, type: DataTypes.ENUM('INGRESO', 'EGRESO')},
        generate: {allowNull: true, type: DataTypes.BOOLEAN, defaultValue: false},
        percent: {allowNull: true, type: DataTypes.NUMERIC(7, 2)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Concept",
        schema: 'general'
    });
    Concept.associate = function (models) {
        Concept.belongsTo(models.Category_concept, {
            foreignKey: 'id_category_concept',
            targetKey: 'id',
            as: 'Category_concept',
            onDelete: 'CASCADE'
        });
        Concept.hasOne(models.Entry, {
            foreignKey: 'id_concepts',
            as: 'Entry',
        });
        Concept.hasOne(models.Cost_admission_plan, {
            foreignKey: 'id_concept',
            as: 'Cost_admission_plan',
        });
    };
    return Concept;
};
