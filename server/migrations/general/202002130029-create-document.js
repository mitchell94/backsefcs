'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Document', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_parent: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Document',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_parent'
                }
            },
            id_document_type: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Document_type',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_document_type'
                }
            },
            id_unit_organic: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            topic: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            emission_date: {
                allowNull: true,
                type: Sequelize.STRING(30)
            },
            code: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            content:{
                allowNull: true,
                type: Sequelize.TEXT
            },
            archive: {
                allowNull: true,
                type: Sequelize.STRING(50)
            },
            expedient: {
                allowNull: true,
                type: Sequelize.STRING(50)
            },
            receibed_date: {
                allowNull: true,
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
            schema: 'general'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Document', {schema: 'general'});
    }
};
