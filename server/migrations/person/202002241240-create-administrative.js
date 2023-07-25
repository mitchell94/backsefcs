'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Administrative', {
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
            id_organic_unit: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            id_charge: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            date_start: {
                allowNull: true,
                type: Sequelize.STRING(30)
            },
            date_end: {
                allowNull: true,
                type: Sequelize.STRING(30)
            },
            id_contract_type: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            denomination: {
                allowNull: true,
                type: Sequelize.STRING(255)
            },
            fixed_teacher: {
                allowNull: true,
                type: Sequelize.BOOLEAN,
                defaultValue: false
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
        await queryInterface.dropTable('Administrative', {schema: 'person'});
    }
};
