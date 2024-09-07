import { Sequelize, Model, DataTypes } from 'sequelize';


const createClientModel = (sequelize: Sequelize) => {
  const Client = sequelize.define('Client', {
    client: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true
  }); 

  return Client;
};

export default createClientModel;
