const { Op } = require('sequelize')
const Stations = require('./stations.model')

const createStation = async (data) => {
    const newRegister = await Stations.create({
        title: data.title,
        alias: data.alias,
        flowername: data.flowername,
        beds: data.beds,
        humRange: data.humrange,
        tempRange: data.temprange
    })
    return newRegister
}

const getStations = async () => {
    const data = await Stations.findAll({
        where: {
            enable: true,
        }
    })
    return data
}

const getStation = async (stationtitle) => {
    const data = await Stations.findOne({
        where: { title: stationtitle }
    })
    return data
}

const updateStation = async (station, body) => {
    const data = await Stations.update(body,
        {
            where: { title: station }
        })
    return data
}
module.exports = {
    createStation,
    getStations,
    getStation,
    updateStation
}