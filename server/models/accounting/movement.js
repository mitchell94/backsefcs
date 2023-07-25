'use strict';
module.exports = (sequelize, DataTypes) => {
    const Movement = sequelize.define('Movement', {
        id_student: {allowNull: false, type: DataTypes.INTEGER},
        id_program: {allowNull: true, type: DataTypes.INTEGER},
        id_organic_unit: {allowNull: true, type: DataTypes.INTEGER},
        id_user: {allowNull: true, type: DataTypes.UUID},
        denomination: {allowNull: true, type: DataTypes.STRING(255)},
        voucher_code: {allowNull: true, type: DataTypes.STRING(50)},
        voucher_amount: {allowNull: true, type: DataTypes.NUMERIC(20, 2)},
        voucher_date: {allowNull: true, type: DataTypes.STRING(50)},
        voucher_url: {allowNull: true, type: DataTypes.STRING(50)},
        observation: {allowNull: true, type: DataTypes.STRING(255)},
        type: {
            allowNull: false,
            type: DataTypes.ENUM('Caja Tesorería', 'Deposíto', 'Transferencia')
        },
        state: {
            allowNull: false,
            type: DataTypes.ENUM('Aceptado', 'Observado', 'Regularizado', 'Registrado', 'Anulado')
        }
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Movement",
        schema: 'accounting'
    });
    Movement.associate = function (models) {
        Movement.belongsTo(models.Student, {
            foreignKey: 'id_student',
            targetKey: 'id',
            as: 'Student',
            onDelete: 'CASCADE'
        });


        Movement.belongsTo(models.Programs, {
            foreignKey: 'id_program',
            targetKey: 'id',
            as: 'Program',

        });

        // Movement.belongsTo(models.Organic_unit, {
        //     foreignKey: 'id_unit_organic',
        //     targetKey: 'id',
        //     as: 'Organic_unit',
        //     onDelete: 'CASCADE',
        // });


    };
    return Movement;
};
