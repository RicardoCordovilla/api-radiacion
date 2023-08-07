const config = require('../../config')
const registersControllers = require('./registers.controllers')



const createRegister = async (req, res) => {
    const { station, hum, temp, values } = req.body
    console.log('create')
    await registersControllers.createRegister({ station, hum, temp, values })
        .then(data => {
            res.status(200).json(data)
            // socket.emit('auth', "update")
        })
        .catch((err) => {
            res.status(404).json({ message: err.message })
        })
}

const getAllRegisters = (req, res) => {
    registersControllers.getAllRegisters()
        .then((response) => {
            res.status(200).json(response)
        })
        .catch((err) => {
            res.status(404).json({ message: err.message })
        })
}
const getRegisters = (req, res) => {
    const station = req.params.station
    registersControllers.getRegisters(station)
        .then((response) => {
            res.status(200).json(response)
        })
        .catch((err) => {
            res.status(404).json({ message: err.message })
        })
}

const getRegistersByDate = (req, res) => {
    const from = req.query.from
    const to = req.query.to
    const station = req.params.station
    registersControllers.getRegistersByDate(from, to, station)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(400).json({ message: err.message })
        })
}

const getLast = (req, res) => {
    const station = req.params.station
    registersControllers.getLast(station)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(400).json({ message: err.message })
        })
}

const deleteRegister = (req, res) => {
    const id = req.params.id
    registersControllers.deleteRegister(id)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(400).json({ message: err.message })
        })
}



module.exports = {
    createRegister,
    getAllRegisters,
    getRegisters,
    getRegistersByDate,
    getLast,
    deleteRegister
}