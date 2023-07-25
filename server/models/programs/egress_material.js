'use strict';
module.exports = (sequelize, DataTypes) => {
    const Egress_material = sequelize.define('Egress_material', {
        id_work_plan: {allowNull: false, type: DataTypes.INTEGER},
        id_concept: {allowNull: false, type: DataTypes.INTEGER},
        id_material: {allowNull: false, type: DataTypes.INTEGER,},
        id_unit_measure: {allowNull: false, type: DataTypes.INTEGER,},
        cant: {allowNull: true, type: DataTypes.SMALLINT},
        amount: {allowNull: true, type: DataTypes.NUMERIC(7, 2)},
        observation: {allowNull: true, type: DataTypes.STRING},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        raw: true,
        tableName: "Egress_material",
        schema: 'programs'
    });
    Egress_material.associate = function (models) {
        Egress_material.belongsTo(models.Material, {
            foreignKey: 'id_material',
            targetKey: 'id',
            as: 'Material',
            onDelete: 'CASCADE'
        });
        Egress_material.belongsTo(models.Unit_measure, {
            foreignKey: 'id_unit_measure',
            targetKey: 'id',
            as: 'Unit_measure',
            onDelete: 'CASCADE'
        });
    };
    return Egress_material;
};
