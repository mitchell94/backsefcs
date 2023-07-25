'use strict';
module.exports = (sequelize, DataTypes) => {
    const Academic_degree = sequelize.define('Academic_degree', {
        denomination: {allowNull: false, type: DataTypes.STRING(50)},
        abbreviation: {allowNull: false, type: DataTypes.STRING(5)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Academic_degree",
        schema: 'general'
    });

    Academic_degree.associate = function (models) {
        //
    };
    return Academic_degree;
};
