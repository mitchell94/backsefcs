'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Category_concept', {
            id: {
                allowNull: true,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            order: {
                allowNull: true,
                type: Sequelize.SMALLINT
            },
            description: {
                allowNull: true,
                type: Sequelize.STRING(100)
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
        await queryInterface.dropTable('Category_concept', {schema: 'general'});
    }
};
