const stationsControllers = require('./stations.controllers')

const createStation = (req, res) => {
    const { title, alias, flowername, beds, humrange, temprange } = req.body
    stationsControllers.createStation({ title, alias, flowername, beds, humrange, temprange })
        .then(data => {
            res.status(200).json(data)
        })
        .catch((err) => {
            res.status(404).json({ message: err.message })
        })
}

const getStations = (req, res) => {
    stationsControllers.getStations()
        .then((response) => {
            res.status(200).json(response)
        })
        .catch((err) => {
            res.status(404).json({ message: err.message })
        })
}

const getStation = (req, res) => {
    stationsControllers.getStation(req.params.station)
        .then((response) => {
            res.status(200).json(response)
        })
        .catch((err) => {
            res.status(404).json({ message: err.message })
        })
}

const updateStation = (req, res) => {
    stationsControllers.updateStation(req.params.station, req.body)
        .then((response) => {
            res.status(200).json(response)
        })
        .catch((err) => {
            res.status(404).json({ message: err.message })
        })
}



module.exports = {
    createStation,
    getStations,
    getStation,
    updateStation
}