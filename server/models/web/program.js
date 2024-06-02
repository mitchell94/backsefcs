'use strict';
module.exports = (sequelize, DataTypes) => {
    const ProgramWeb = sequelize.define('ProgramWeb', {
        name: {allowNull: true, type: DataTypes.STRING(255)},
        short_name: {allowNull: true, type: DataTypes.STRING(255)},
    }, {
        timestamps: false,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "programs",
        schema: 'web'
    });
    // Program.associate = function (models) {
    //     Program.hasMany(models.Inscription, {
    //         foreignKey: "id_program",
    //         as: "Inscription",
    //     });
    // };
    return ProgramWeb;
};
