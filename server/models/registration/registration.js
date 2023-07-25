'use strict';
module.exports = (sequelize, DataTypes) => {
    const Registration = sequelize.define('Registration', {
        id_semester: {allowNull: false, type: DataTypes.INTEGER},
        id_program: {allowNull: true, type: DataTypes.INTEGER},
        id_organic_unit: {allowNull: true, type: DataTypes.INTEGER},
        id_student: {allowNull: false, type: DataTypes.INTEGER},
        type: {allowNull: true, type: DataTypes.STRING},
        number_registration: {allowNull: true, type: DataTypes.STRING},
        observation: {allowNull: true, type: DataTypes.STRING},
        state: {
            allowNull: true,
            type: DataTypes.ENUM('Registrado', 'Retirado', 'Pagado', 'Pendiente', 'Desertado', 'No Matrículado', 'Abandonado')
        },

    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Registration",
        schema: 'registration'
    });
    Registration.associate = function (models) {
        // associations can be defined here
        Registration.hasMany(models.Registration_course, {
            foreignKey: 'id_registration',
            as: 'Registration_course'
        });
        Registration.hasOne(models.Payment, {
            foreignKey: 'id_registration',
            as: 'Payment'
        });
        Registration.hasOne(models.Student_document, {
            foreignKey: 'id_registration',
            as: 'Student_document'
        });

        Registration.belongsTo(models.Academic_semester, {
            foreignKey: 'id_semester',
            targetKey: 'id',
            as: 'Academic_semester',

        });
        Registration.belongsTo(models.Academic_semester, {
            foreignKey: 'id_semester',
            targetKey: 'id',
            as: 'A_s',

        });
        Registration.belongsTo(models.Student, {
            foreignKey: 'id_student',
            targetKey: 'id',
            as: 'Student',

        });
        Registration.belongsTo(models.Programs, {
            foreignKey: 'id_program',
            targetKey: 'id',
            as: 'Program',

        });
        Registration.belongsTo(models.Organic_unit, {
            foreignKey: 'id_organic_unit',
            targetKey: 'id',
            as: 'Organic_unit_register',

        });

    };
    return Registration;
};
