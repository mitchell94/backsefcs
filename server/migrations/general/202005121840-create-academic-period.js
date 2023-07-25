'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Academic_period', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            denomination: {
                allowNull: false,
                type: Sequelize.STRING(200)
            },
            abbreviation: {
                allowNull: true,
                type: Sequelize.STRING(15)
            },
            period: {
                allowNull: true,
                type: Sequelize.SMALLINT
            },
            cant_mouth: {
                allowNull: true,
                type: Sequelize.SMALLINT
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
        await queryInterface.dropTable('Academic_period', {schema: 'general'});
    }
};
