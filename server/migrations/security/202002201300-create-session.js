'use strict';
module.exports = {
    up:async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Session', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_user: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: {
                        tableName: 'User',
                        schema: 'security'
                    },
                    key: 'id',
                    as: 'id_user'
                }
            },
            token: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            device_name: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            ip: {
                allowNull: false,
                type: Sequelize.STRING(50)
            },
            mac: {
                allowNull: false,
                type: Sequelize.STRING(20)
            },
            device_type: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            browser: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            logueado: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            state: {
                allowNull: false,
                type: Sequelize.ENUM('En línea', 'Ausente', 'Ausencia extendida', 'No moletar', 'Invisible')
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
            schema: 'security'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Session', {schema: 'security'});
    }
};
