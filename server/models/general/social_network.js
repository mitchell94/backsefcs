'use strict';
module.exports = (sequelize, DataTypes) => {
    const Social_network = sequelize.define('Social_network', {
        denomination: {allowNull: false, type: DataTypes.STRING(60)},
        link: {allowNull: false, type: DataTypes.STRING(255)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        raw: true,

        tableName:"Social_network",
        schema: 'general'
    });
    Social_network.associate = function (models) {
        // associations can be defined here
    };
    return Social_network;
};
