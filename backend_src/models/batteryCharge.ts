import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';


const createBatteryChargeModel = (sequelize: Sequelize) => {
  const BatteryCharge = sequelize.define('BatteryCharge', {
    startTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    initial: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    final: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  return BatteryCharge; 
};

export default createBatteryChargeModel;
