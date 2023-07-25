'use strict';
module.exports = (sequelize, DataTypes) => {
    const Entry = sequelize.define('Entry', {
        id_work_plan: {allowNull: false, type: DataTypes.INTEGER},
        id_concepts: {allowNull: false, type: DataTypes.INTEGER},
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
        tableName: "Entry",
        schema: 'programs'
    });
    Entry.associate = function (models) {
        Entry.belongsTo(models.Concept, {
            foreignKey: 'id_concepts',
            targetKey: 'id',
            as: 'Concept',
            onDelete: 'CASCADE',
        });
    };
    return Entry;
};


