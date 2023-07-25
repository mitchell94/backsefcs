'use strict';
module.exports = (sequelize, DataTypes) => {
    const Campus = sequelize.define('Campus', {
        id_district: {allowNull: true, type: DataTypes.INTEGER},
        code: {allowNull: false, type: DataTypes.STRING(255)},
        denomination: {allowNull: false, type: DataTypes.STRING(255)},
        type: {allowNull: false, type: DataTypes.ENUM('Matrix', 'Subsidiary')},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Campus",
        schema: 'general'
    });
    Campus.associate = function (models) {
        // associations can be defined here
        Campus.belongsTo(models.District, {
            foreignKey: 'id_district',
            targetKey: 'id',
            as: 'District',
            onDelete: 'CASCADE'
        });
    };
    return Campus;
};
