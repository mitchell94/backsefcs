"use strict";

module.exports = (sequelize, DataTypes) => {
    const InscriptionWeb = sequelize.define(
        "InscriptionWeb",
        {
            id_program: { allowNull: true, type: DataTypes.INTEGER },
            id_admission: { allowNull: true, type: DataTypes.INTEGER },
            document: { allowNull: true, type: DataTypes.STRING(50) },
            first_name: { allowNull: true, type: DataTypes.STRING(150) },
            last_name: { allowNull: true, type: DataTypes.STRING(150) },
            email: { allowNull: true, type: DataTypes.STRING(100) },
            phone: { allowNull: true, type: DataTypes.STRING(60) },
        },
        {
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            paranoid: true,
            underscored: true,
            tableName: "inscriptions",
            schema: "web",
        }
    );
    InscriptionWeb.associate = function (models) {
        InscriptionWeb.belongsTo(models.ProgramWeb, {
            targetKey: 'id',
            foreignKey: "id_program",
            as: "ProgramWeb",
        });
        InscriptionWeb.belongsTo(models.AdmissionWeb, {
            targetKey: 'id',
            foreignKey: "id_admission",
            as: "AdmissionWeb",
        });
    };
    return InscriptionWeb;
};
