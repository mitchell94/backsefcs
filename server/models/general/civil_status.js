'use strict';
module.exports = (sequelize, DataTypes) => {
    const Civil_status = sequelize.define('Civil_status', {
        denomination: {allowNull: false, type: DataTypes.STRING(60)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Civil_status",
        schema: 'general'
    });
    Civil_status.associate = function (models) {
      //
    };
    return Civil_status;
};
