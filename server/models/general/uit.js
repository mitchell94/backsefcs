'use strict';
module.exports = (sequelize, DataTypes) => {
    const Uit = sequelize.define('Uit', {
        year: {allowNull: false, type: DataTypes.SMALLINT},
        amount: {allowNull: false, type: DataTypes.NUMERIC(7, 2)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Uit",
        schema: 'general'
    });
    Uit.associate = function (models) {
        // associations can be defined here
    };
    return Uit;
};
