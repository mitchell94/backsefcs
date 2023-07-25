'use strict';
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        id_student: {allowNull: false, type: DataTypes.INTEGER},
        id_program: {allowNull: true, type: DataTypes.INTEGER},
        id_organic_unit: {allowNull: true, type: DataTypes.INTEGER},
        id_registration: {allowNull: true, type: DataTypes.INTEGER},
        id_concept: {allowNull: true, type: DataTypes.INTEGER},
        id_cost_admission: {allowNull: true, type: DataTypes.INTEGER},
        id_semester: {allowNull: true, type: DataTypes.INTEGER},
        payment_date: {allowNull: true, type: DataTypes.STRING(50)},
        amount: {allowNull: false, type: DataTypes.NUMERIC(20, 2)},
        denomination: {allowNull: true, type: DataTypes.STRING(255)},
        order_number: {allowNull: true, type: DataTypes.SMALLINT},
        type: {
            allowNull: false,
            type: DataTypes.ENUM('Pagado', 'Aceptado', 'Pendiente', 'Regularizado', 'Registrado', 'Confirmado', 'Anulado', 'Retirado')
        },
        generate: {// (0 no corresponde | 1 si | 1 no)
            allowNull: false,
            type: DataTypes.SMALLINT,
            defaultValue: 0
        },
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},

    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Payment",
        schema: 'accounting'
    });


    Payment.associate = function (models) {
        // associations can be defined here
        Payment.belongsTo(models.Concept, {
            foreignKey: 'id_concept',
            targetKey: 'id',
            as: 'Concept',
            onDelete: 'CASCADE'
        });
        Payment.belongsTo(models.Academic_semester, {
            foreignKey: 'id_semester',
            targetKey: 'id',
            as: 'Academic_semester',
            onDelete: 'CASCADE'
        });
        Payment.belongsTo(models.Student, {
            foreignKey: 'id_student',
            targetKey: 'id',
            as: 'Student',
            onDelete: 'CASCADE'
        });

        Payment.belongsTo(models.Programs, {
            foreignKey: 'id_program',
            targetKey: 'id',
            as: 'Program',

        });
        Payment.hasOne(models.Document_book, {
            foreignKey: 'id_payment',
            as: 'Document_book',
        });


    };
    return Payment;
};
