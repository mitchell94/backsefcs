'use strict';
module.exports = (sequelize, DataTypes) => {
    const Academic_period = sequelize.define('Academic_period', {
        denomination: {allowNull: false, type: DataTypes.STRING(200)},
        abbreviation: {allowNull: false, type: DataTypes.STRING(15)},
        period: {allowNull: true, type: DataTypes.SMALLINT},
        cant_mouth: {allowNull: true, type: DataTypes.SMALLINT},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Academic_period",
        schema: 'general'
    });
    Academic_period.associate = function (models) {
        // associations can be defined here
    };
    return Academic_period;
};
