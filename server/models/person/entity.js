'use strict';
module.exports = (sequelize, DataTypes) => {
    const Entity = sequelize.define('Entity', {

        id_person: {allowNull: false, type: DataTypes.INTEGER},
        id_organic_unit: {allowNull: false, type: DataTypes.INTEGER},

        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Entity",
        schema: 'person'
    });
    Entity.associate = function (models) {
        // associations can be defined here
    };
    return Entity;
};
