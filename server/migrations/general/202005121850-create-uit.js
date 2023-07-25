'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Uit', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            year: {
                allowNull: true,
                type: Sequelize.SMALLINT
            },
            amount: {
                allowNull: false,
                type: Sequelize.NUMERIC(7, 2)
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
            schema: 'general'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Uit', {schema: 'general'});
    }
};
