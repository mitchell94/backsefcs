'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Programs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_unit_organic_origin: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            id_unit_organic_register: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            id_academic_degree: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            code: {
                allowNull: false,
                type: Sequelize.STRING(10),
            },
            denomination: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            description: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            mesh: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            state: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            abbreviation: {
                allowNull: false,
                type: Sequelize.STRING,
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
            schema: 'programs'
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Programs', {schema: 'programs'});
    }
};
