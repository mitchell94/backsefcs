'use strict';
module.exports = (sequelize, DataTypes) => {
    const Egress_teacher = sequelize.define('Egress_teacher', {
        id_work_plan: {allowNull: false, type: DataTypes.INTEGER},
        id_concept: {allowNull: false, type: DataTypes.INTEGER},
        id_person: {allowNull: false, type: DataTypes.INTEGER},
        id_course: {allowNull: false, type: DataTypes.INTEGER},
        price_hour: {allowNull: true, type: DataTypes.NUMERIC(7, 2)},
        cant: {allowNull: true, type: DataTypes.SMALLINT},
        observation: {allowNull: true, type: DataTypes.STRING},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        raw: true,
        tableName: "Egress_teacher",
        schema: 'programs'
    });
    Egress_teacher.associate = function (models) {
        Egress_teacher.belongsTo(models.Person, {
            foreignKey: 'id_person',
            targetKey: 'id',
            as: 'Person',
            onDelete: 'CASCADE'
        });
        Egress_teacher.belongsTo(models.Course, {
            foreignKey: 'id_course',
            targetKey: 'id',
            as: 'Course',
            onDelete: 'CASCADE'
        });
    };
    return Egress_teacher;
};

