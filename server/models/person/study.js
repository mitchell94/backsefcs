'use strict';
module.exports = (sequelize, DataTypes) => {
    const Study = sequelize.define('Study', {
        id_person: {allowNull: false, type: DataTypes.INTEGER},
        id_academic_degree: {allowNull: false, type: DataTypes.INTEGER},
        id_document: {allowNull: true, type: DataTypes.INTEGER},
        university: {allowNull: false, type: DataTypes.TEXT},
        title: {allowNull: true, type: DataTypes.TEXT},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Study",
        schema: 'person'
    });
    Study.associate = function (models) {
        // associations can be defined here
        Study.belongsTo(models.Academic_degree, {
            foreignKey: 'id_academic_degree',
            targetKey: 'id',
            as: 'Academic_degree',
            onDelete: 'CASCADE'
        });
        Study.belongsTo(models.Document, {
            foreignKey: 'id_document',
            targetKey: 'id',
            as: 'Document',
            onDelete: 'CASCADE'
        });
    };
    return Study;
};
