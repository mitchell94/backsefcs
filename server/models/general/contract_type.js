'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contract_type = sequelize.define('Contract_type', {
    denomination: {allowNull: false, type: DataTypes.STRING},
    abbreviation: {allowNull: true, type: DataTypes.STRING},
    state: {allowNull: false, type: DataTypes.BOOLEAN,defaultValue:true},
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
    underscored: true,
    tableName:"Contract_type",
    schema: 'general'
  });
  Contract_type.associate = function(models) {
    // associations can be defined here
  };
  return Contract_type;
};
