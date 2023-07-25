'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Work', {
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
            id_ubigeo: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
	    id_document: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            date_start: {
                allowNull: false,
                type: Sequelize.STRING(30)
            },
            date_end: {
                allowNull: true,
                type: Sequelize.STRING(30)
            },
            entity: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            charge: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            direction: {
                allowNull: false,
                type: Sequelize.STRING(250)
            },
            cellphone: {
                allowNull: false,
                type: Sequelize.STRING(15)
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
            schema: 'person',
            // onDelete: 'CASCADE',
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Work', {schema: 'person'});
    }
};
