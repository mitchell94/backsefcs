'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Role', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            denomination: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            type: {
                allowNull: true,
                type: Sequelize.ENUM('Administrativo', 'Docente', 'Estudiante', 'Entidad')
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
        await queryInterface.dropTable('Role', {schema: 'security'});
    }
};
