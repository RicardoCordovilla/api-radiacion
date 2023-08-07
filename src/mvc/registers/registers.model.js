const { DataTypes } = require("sequelize")
const db = require('../../dabase')
const Stations = require("../stations/stations.model")

const Registers = db.define('registers', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    stationtitle: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    values: {
        type: DataTypes.JSON,
        allowNull: true
    },
    temp: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    hum: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    date: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    time: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: 'hour'
    },
})

module.exports = Registers