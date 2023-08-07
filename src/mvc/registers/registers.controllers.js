const { Op } = require("sequelize")
const Registers = require("./registers.model")
const Stations = require("../stations/stations.model")



const digits = (num) => {
    let digit = num < 10 ? '0' + num : num + ''
    return digit
}

const formatDate = (date) => {
    const fecha = new Date(date)
    let stringDate = fecha.getFullYear() + '-' + digits(fecha.getMonth() + 1) + '-' + digits(fecha.getDate())
    return stringDate
}

const formatTime = (date) => {
    const time = new Date(date)
    let stringTime = digits(time.getHours() + ':' + digits(time.getMinutes()))
    return stringTime
}





const promedio = async (stationtitle, type, currentLocalDate) => {
    const sum = await Registers.sum(type, {
        where: {
            stationtitle,
            type: 'hour',
            date: {
                [Op.between]: [currentLocalDate, currentLocalDate]
            }
        }
    })

    const count = await Registers.count({
        where: {
            stationtitle,
            type: 'hour',
            date: {
                [Op.between]: [currentLocalDate, currentLocalDate]
            }
        }
    })

    return (sum / count).toFixed(2)

}

const updateRegisterDay = async (date, stationtitle) => {
    const updateRegisterDay = await Registers.update(
        {
            hum: await promedio(stationtitle, 'hum', date),
            temp: await promedio(stationtitle, 'temp', date)
        }, {
        where: {
            stationtitle,
            date,
            type: 'day'
        }
    })
    return updateRegisterDay
}

const createRegister = async (data) => {

    const getMaxMinRange = await Stations.findOne({
        where: { title: data.station }

    })
    const tempRange = getMaxMinRange.tempRange
    const humRange = getMaxMinRange.humRange

    // console.log('===================', getMaxMinRange)



    // if (data.temp > tempRange.max) sendAlert(`Temperatura ${data.temp}°C alta en:  
    // Equipo: ${data.station},
    // Secction: ${getMaxMinRange.alias}, 
    // Camas: ${getMaxMinRange.beds}    
    // `)

    const currentDate = new Date()

    // console.log(currentDate.toLocaleDateString("es-EC", { timeZone: 'America/Lima' }, { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-'))
    // console.log(currentDate.toLocaleTimeString("es-EC", { timeZone: 'America/Lima' }, { hour: '2-digit', minute: '2-digit' }))
    const currentLocalDate = formatDate(currentDate.toLocaleDateString("es-EC", { timeZone: 'America/Lima' }, { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-'))
    const currentLocalTime = (currentDate.toLocaleTimeString("es-EC", { timeZone: 'America/Lima' }, { hour: '2-digit', minute: '2-digit' }).slice(0, 5))

    const newRegisterDay = await Registers.findOrCreate({
        where: { type: 'day', date: currentLocalDate, stationtitle: data.station },
        defaults: {
            stationtitle: data.station,
            temp: data.temp,
            hum: data.hum,
            values: data.values,
            date: currentLocalDate,
            time: currentLocalTime,
            type: 'day'
        }
    })

    const newRegister = await Registers.create({
        stationtitle: data.station,
        temp: data.temp,
        hum: data.hum,
        values: data.values,
        date: currentLocalDate,
        time: currentLocalTime,
    })

    updateRegisterDay(currentLocalDate, data.station)

    return newRegister
}

const getAllRegisters = async () => {
    const data = await Registers.findAll({
        // include: [
        //     {
        //         model: Stations,
        //         as: "station"
        //     }
        // ]
    })
    return data
}
const getRegisters = async (stationtitle) => {
    const data = await Registers.findAll({
        where: {
            stationtitle
        },
        // include: [
        //     {
        //         model: Stations,
        //         as: "station"
        //     }
        // ]
    })
    return data
}

const getRegistersByDate = async (startDate, endDate, stationtitle) => {

    if (startDate === endDate) {
        const data = await Registers.findAll(
            {
                where: {
                    stationtitle,
                    type: 'hour',
                    date: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                order: [['createdAt']]
            }
        )
        return data
    }

    else {
        const data = await Registers.findAll(
            {
                where: {
                    stationtitle,
                    type: 'day',
                    date: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                order: [['createdAt']]
            }
        )
        return data
    }


}

const getLast = async (stationtitle) => {
    const data = await Registers.findOne({
        limit: 1,
        where: {
            stationtitle,
            createdAt: { [Op.not]: null }
        },
        order: [['createdAt', 'DESC']]
    })
    return data
}

const deleteRegister = async (id) => {
    const data = await Registers.destroy({
        where: { id },
        force: true
    })
    return data
}

module.exports = {
    createRegister,
    getAllRegisters,
    getRegisters,
    getLast,
    getRegistersByDate,
    deleteRegister
}