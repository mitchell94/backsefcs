'use strict';
module.exports = (sequelize, DataTypes) => {
    const Work = sequelize.define('Work', {
        id_person: {allowNull: false, type: DataTypes.INTEGER},
        id_ubigeo: {allowNull: true, type: DataTypes.INTEGER},
        id_document: {allowNull: true, type: DataTypes.INTEGER},
        date_start: {allowNull: false, type: DataTypes.STRING(30)},
        date_end: {allowNull: true, type: DataTypes.STRING(30)},
        entity: {allowNull: false, type: DataTypes.TEXT},
        charge: {allowNull: true, type: DataTypes.TEXT},
        direction: {allowNull: true, type: DataTypes.STRING(250)},
        cellphone: {allowNull: true, type: DataTypes.STRING(15)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        paranoid: true,
        underscored: true,
        tableName: "Work",
        schema: 'person'
    });
    Work.associate = function (models) {
        // associations can be defined here
        Work.belongsTo(models.Document, {
            foreignKey: 'id_document',
            targetKey: 'id',
            as: 'Doc',
            onDelete: 'CASCADE',
        });


    };
    return Work;
};
