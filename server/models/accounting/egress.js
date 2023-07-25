'use strict';
module.exports = (sequelize, DataTypes) => {
    const Egress = sequelize.define('Egress', {
        id_organic_unit: {allowNull: false, type: DataTypes.INTEGER},
        id_program: {allowNull: false, type: DataTypes.INTEGER},
        id_concept: {allowNull: false, type: DataTypes.INTEGER},
        id_admission_plan: {allowNull: false, type: DataTypes.INTEGER},
        id_administrative: {allowNull: true, type: DataTypes.INTEGER},
        id_teacher: {allowNull: true, type: DataTypes.INTEGER},
        id_material: {allowNull: true, type: DataTypes.INTEGER},
        id_course: {allowNull: true, type: DataTypes.INTEGER},
        order_number: {allowNull: true, type: DataTypes.STRING},
        document_one: {allowNull: true, type: DataTypes.STRING},
        type_teacher: {allowNull: true, type: DataTypes.STRING},
        type: {allowNull: true, type: DataTypes.STRING},
        init_date: {allowNull: true, type: DataTypes.STRING(50)},
        end_date: {allowNull: true, type: DataTypes.STRING(50)},
        state_egress: {allowNull: true, type: DataTypes.STRING(10)},
        amount: {
            allowNull: false,
            type: DataTypes.NUMERIC(7, 2)
        },
        state: {
            allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true
        },
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Egress",
        schema: 'accounting'
    });
    Egress.associate = function (models) {
        // Egress.belongsTo(models.Teacher, {
        //     foreignKey: 'id_teacher',
        //     targetKey: 'id',
        //     as: 'Teacher',
        //     onDelete: 'CASCADE',
        // });
        // Egress.belongsTo(models.Administrative, {
        //     foreignKey: 'id_administrative',
        //     targetKey: 'id',
        //     as: 'Administrative',
        //     onDelete: 'CASCADE',
        // });
        Egress.belongsTo(models.Person, {
            foreignKey: 'id_administrative',
            targetKey: 'id',
            as: 'Administrative',
            onDelete: 'CASCADE',
        });
        Egress.belongsTo(models.Course, {
            foreignKey: 'id_course',
            targetKey: 'id',
            as: 'Course',
            onDelete: 'CASCADE',
        });
        Egress.belongsTo(models.Person, {
            foreignKey: 'id_teacher',
            targetKey: 'id',
            as: 'Teacher',
            onDelete: 'CASCADE',
        });
        Egress.belongsTo(models.Material, {
            foreignKey: 'id_material',
            targetKey: 'id',
            as: 'Material',
            onDelete: 'CASCADE',
        });

        Egress.belongsTo(models.Concept, {
            foreignKey: 'id_concept',
            targetKey: 'id',
            as: 'Concept',
            onDelete: 'CASCADE',
        });
    };
    return Egress;
};
