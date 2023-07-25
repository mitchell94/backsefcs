'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Student', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_person: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Person',
                        schema: 'person'
                    },
                    key: 'id',
                    as: 'id_person'
                }
            },
            id_program: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            id_organic_unit: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },

            id_plan: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            id_admission_plan: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            id_cost_admission: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_concept: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_process_egress: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            type: {
                allowNull: true,
                type: Sequelize.STRING(50)
            },
            type_entry: {
                allowNull: true,
                type: Sequelize.INTEGER,
                defaultValue: 1
                // 1 Nuevo Ingresante /2 Ingresante anterior al Periodo Académico 2020 - I /3 Intercambio Estudiantil /4 update estate
            },
            study_modality: {
                allowNull: false,
                type: Sequelize.ENUM('Presencial', 'Semi-Presencial', 'A distancia', 'Pendiente'),
                defaultValue: 'Presencial'
            },
            required_document: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            egress_date: {
                allowNull: true,
                type: Sequelize.STRING(30)
            },
            observation: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            state: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE
            }
        }, {
            schema: 'person'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Student', {schema: 'person'});
    }
};
