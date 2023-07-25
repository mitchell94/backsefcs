'use strict';
module.exports = (sequelize, DataTypes) => {
    const District = sequelize.define('District', {
        id_province: {allowNull: false, type: DataTypes.INTEGER},
        description: {allowNull: false, type: DataTypes.STRING},
        code: {allowNull: false, type: DataTypes.STRING},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        schema: 'general'
    });
    District.associate = function (models) {
        District.belongsTo(models.Province, {
            foreignKey: 'id_province',
            targetKey: 'id',
            as: 'Province',
            onDelete: 'CASCADE'
        });
    };
    return District;
};
