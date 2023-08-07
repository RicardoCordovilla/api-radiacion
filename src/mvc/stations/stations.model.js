const { DataTypes } = require("sequelize")
const db = require('../../dabase')

const Stations = db.define('stations', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    alias: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    enable: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    }


}, { freezeTableName: true, timestamps: false })

module.exports = Stations