'use strict';
module.exports = (sequelize, DataTypes) => {
    const Postulant = sequelize.define('Postulant', {
        id_organic_unit: {allowNull: false, type: DataTypes.INTEGER},
        id_program: {allowNull: false, type: DataTypes.INTEGER},
        id_plan: {allowNull: false, type: DataTypes.INTEGER},
        id_admission_plan: {allowNull: false, type: DataTypes.INTEGER},
        id_process: {allowNull: false, type: DataTypes.INTEGER},
        id_cost_admission_plan: {allowNull: false, type: DataTypes.INTEGER},
        code: {allowNull: true, type: DataTypes.STRING(10)},
        code_cost: {allowNull: true, type: DataTypes.STRING(10)},
        document_number: {allowNull: false, type: DataTypes.STRING(15)},
        name: {allowNull: false, type: DataTypes.STRING(255)},
        phone: {allowNull: true, type: DataTypes.STRING(12)},
        email: {allowNull: true, type: DataTypes.STRING(150)},
        send_mail: {allowNull: true, type: DataTypes.BOOLEAN, defaultValue: true},
        description: {allowNull: true, type: DataTypes.STRING(255)},
        voucher_code: {allowNull: true, type: DataTypes.STRING(255)},
        voucher_amount: {allowNull: true, type: DataTypes.STRING(255)},
        voucher_date: {allowNull: true, type: DataTypes.STRING(255)},
        voucher_url: {allowNull: true, type: DataTypes.STRING(255)},
        observation: {allowNull: true, type: DataTypes.STRING(255)},
        voucher_state: {
            allowNull: false,
            type: DataTypes.ENUM('Pendiente', 'Registrado', 'Aceptado', 'Anulado', 'Observado'),
            defaultValue: 'Pendiente'
        },
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Postulant",
        schema: 'person'
    });
    Postulant.associate = function (models) {

        Postulant.belongsTo(models.Programs, {
            foreignKey: 'id_program',
            targetKey: 'id',
            as: 'Programs',
            onDelete: 'CASCADE',
        });
        Postulant.belongsTo(models.Academic_semester, {
            foreignKey: 'id_process',
            targetKey: 'id',
            as: 'Academic_semester',
            onDelete: 'CASCADE',
        });
        // Postulant.belongsTo(models.Entry, {
        //     foreignKey: 'id_entry',
        //     targetKey: 'id',
        //     as: 'Entrys',
        //     onDelete: 'CASCADE',
        // });
        Postulant.belongsTo(models.Cost_admission_plan, {
            foreignKey: 'id_cost_admission_plan',
            targetKey: 'id',
            as: 'Cost_admission_plans',
            onDelete: 'CASCADE',
        });
    };
    return Postulant;
};
