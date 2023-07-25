'use strict';
module.exports = (sequelize, DataTypes) => {
    const Authority = sequelize.define('Authority', {
        id_organic_unit: {allowNull: false, type: DataTypes.INTEGER},
        person: {allowNull: true, type: DataTypes.STRING},
        charge: {allowNull: true, type: DataTypes.STRING},
        type: {allowNull: true, type: DataTypes.STRING},//(certificado,otros docuemnost)
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Authority",
        schema: 'general'
    });
    Authority.associate = function (models) {
        // associations can be defined here
        Authority.belongsTo(models.Organic_unit, {
            foreignKey: 'id_organic_unit',
            targetKey: 'id',
            as: 'Organic_unit',
            onDelete: 'CASCADE'
        });
    };
    return Authority;
};
