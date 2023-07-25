'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('User_intranet', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUID,
            },
            id_person: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            user: {
                allowNull: false,
                type: Sequelize.STRING(15)
            },
            pass: {
                allowNull: false,
                type: Sequelize.STRING(255)
            },
            type: {
                allowNull: false,
                type: Sequelize.STRING(30)
            },
            end_date: {
                allowNull: false,
                type: Sequelize.STRING(30)
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
            schema: 'security'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('User_intranet', {schema: 'security'});
    }
};
