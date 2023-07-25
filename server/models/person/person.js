'use strict';
module.exports = (sequelize, DataTypes) => {
    const Person = sequelize.define('Person', {
        id_identification_document: {allowNull: true, type: DataTypes.INTEGER, defaultValue: 1},
        id_civil_status: {allowNull: true, type: DataTypes.INTEGER},
        id_ubigeo_birth: {allowNull: true, type: DataTypes.INTEGER},
        id_ubigeo_resident: {allowNull: true, type: DataTypes.INTEGER},
        id_nationality: {allowNull: true, type: DataTypes.INTEGER, defaultValue: 85},
        // id_type_document_number: {allowNull: true, type: DataTypes.INTEGER},
        photo: {allowNull: true, type: DataTypes.STRING(50)},
        email: {allowNull: true, type: DataTypes.STRING(150)},
        document_number: {allowNull: false, type: DataTypes.STRING(15)},
        name: {allowNull: true, type: DataTypes.STRING(60)},
        paternal: {allowNull: true, type: DataTypes.STRING(60)},
        maternal: {allowNull: true, type: DataTypes.STRING(60)},
        gender: {allowNull: true, type: DataTypes.ENUM('Masculino', 'Femenino')},
        birth_date: {allowNull: true, type: DataTypes.STRING(30)},
        phone: {allowNull: true, type: DataTypes.STRING(12)},
        cell_phone: {allowNull: true, type: DataTypes.STRING(12)},
        address: {allowNull: true, type: DataTypes.STRING(150)},
        student_state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false},
        teacher_state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false},
        administrative_state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false},
        just_last_name: {allowNull: true, type: DataTypes.BOOLEAN, defaultValue: true},
        state: {allowNull: true, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Person",
        schema: 'person'
    });
    Person.associate = function (models) {
        // associations can be defined her
        Person.hasOne(models.Administrative, {
            foreignKey: 'id_person',
            as: 'Administrative',
        });
        Person.hasMany(models.Administrative, {
            foreignKey: 'id_person',
            as: 'Administratives',
        });


        Person.hasOne(models.Teacher, {
            foreignKey: 'id_person',
            as: 'Teacher',
        });
        Person.hasMany(models.Teacher, {
            foreignKey: 'id_person',
            as: 'Teachers',
        });
        Person.hasOne(models.Student, {
            foreignKey: 'id_person',
            as: 'Student',
        });
        Person.hasMany(models.Student, {
            foreignKey: 'id_person',
            as: 'Students',
        });


        Person.hasOne(models.User, {
            foreignKey: 'id_person',
            as: 'User',
        });

        Person.belongsTo(models.Civil_status, {
            foreignKey: 'id_civil_status',
            targetKey: 'id',
            as: 'Civil_status',
            onDelete: 'CASCADE'
        });
        Person.belongsTo(models.District, {
            foreignKey: 'id_ubigeo_birth',
            targetKey: 'id',
            as: 'Districts_birth',
            onDelete: 'CASCADE'
        });
        Person.belongsTo(models.District, {
            foreignKey: 'id_ubigeo_resident',
            targetKey: 'id',
            as: 'Districts_reside',
            onDelete: 'CASCADE'
        });
    };
    return Person;
};
