'use strict';
module.exports = (sequelize, DataTypes) => {
    const Egress_comission = sequelize.define('Egress_comission', {
        id_work_plan: {allowNull: false, type: DataTypes.INTEGER},
        id_concept: {allowNull: false, type: DataTypes.INTEGER},
        id_person: {allowNull: false, type: DataTypes.INTEGER},
        amount: {allowNull: true, type: DataTypes.NUMERIC(7, 2)},
        number_month: {allowNull: true, type: DataTypes.SMALLINT},
        charge: {allowNull: true, type: DataTypes.STRING},
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
        tableName: "Egress_comission",
        schema: 'programs'
    });
    Egress_comission.associate = function (models) {
        Egress_comission.belongsTo(models.Person, {
            foreignKey: 'id_person',
            targetKey: 'id',
            as: 'Person',
            onDelete: 'CASCADE'
        });
        Egress_comission.belongsTo(models.Concept, {
            foreignKey: 'id_concept',
            targetKey: 'id',
            as: 'Concept',
            onDelete: 'CASCADE'
        });
    };
    return Egress_comission;
};
