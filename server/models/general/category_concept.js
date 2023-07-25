'use strict';
module.exports = (sequelize, DataTypes) => {
    const Category_concept = sequelize.define('Category_concept', {
        order: {allowNull: true, type: DataTypes.SMALLINT},
        description: {allowNull: false, type: DataTypes.STRING(100)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Category_concept",
        schema: 'general'
    });
    Category_concept.associate = function (models) {

    };
    return Category_concept;
};
