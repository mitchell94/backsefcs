'use strict';
module.exports = (sequelize, DataTypes) => {
    const Student_discount = sequelize.define('Student_discount', {
        id_student: {allowNull: false, type: DataTypes.INTEGER},
        id_discount: {allowNull: true, type: DataTypes.INTEGER},
        id_document: {allowNull: true, type: DataTypes.INTEGER},
        amount: {allowNull: true, type: DataTypes.NUMERIC(7, 2)},
        observation: {allowNull: true, type: DataTypes.STRING},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Student_discount",
        schema: 'person'
    });
    Student_discount.associate = function (models) {

        Student_discount.belongsTo(models.Discount, {
            foreignKey: 'id_discount',
            targetKey: 'id',
            as: 'Discount',
            onDelete: 'CASCADE',
        });
    };
    return Student_discount;
};
