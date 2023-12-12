const registersControllers = require('./mvc/registers/registers.controllers')


const cors = require('cors')
const registersRouter = require('./mvc/registers/registers.routes')
const stationsRouter = require('./mvc/stations/stations.routes')
const initModels = require('./mvc/initModels')

const db = require('./dabase')
const express = require('express')
const app = express()



app.use(express.json())

const corsOption = {
    credentials: true,
    origin: '*'
}

app.use(cors(corsOption));

db.authenticate()
    .then(() => { console.log('DB authenticated') })
    .catch(err => { console.log(err) })

db.sync()
    .then(() => { console.log('DB synced') })
    .catch(err => { console.log(err) })

initModels()

const { port } = require('./config')
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'OK',
        users: `localhost:${port}/api/v1`
    })
})


app.use('/api/v1/registers', registersRouter)
app.use('/api/v1/stations', stationsRouter)


app.listen(port, () => {
    console.log(`server started at ${port}`)
})




// ----------  MOSQUITO -----------

// const registersServices = require('../mvc/registers/registers.services')

const { default: axios } = require('axios')
// const express = require('express')
// const app = express()
// app.use(express.json())

const mqtt = require('mqtt')
const config = require('./config')
const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt')

const createRegister = async (body) => {
    const { station, hum, temp, values, type } = body
    console.log('create')
    await registersControllers.createRegister({ station, hum, temp, values, type })
        .then(data => { return data })
        .catch((err) => { return data })
}

client.on('connect', function () {
    client.subscribe(config.topic, function (err) {
        // if (!err) {
        //     client.publish('vite3-notification-test',
        //         JSON.stringify({ "station": "ESP1", "values": { "H": 74.2, "T": 25.5 }, "createdAt": new Date() })
        //         // "gdfg"
        //     )

        // }

    })
})

client.on('message', async function (topic, message) {
    // message is Buffer
    const subtopic = topic.split('/')[1]
    console.log("message recived: ", message.toString())
    console.log("topic: ", topic.split('/')[1])

    if (subtopic === 'all') {
        jsonMessage = JSON.parse(message)
        console.log(jsonMessage)
        // jsonMessage.forEach(element => {
            const body = jsonMessage
            console.log(body)
            // createRegister(body)
            axios.post(config.dburl + '/registers', body)
                .then(response => console.log(response))
                .catch(err => console.log(err))
        // });
    }

    if (subtopic === 'alerts') {
        const body = JSON.parse(message)
        console.log({ ...body, type: 'alert' })

        // createRegister({ ...body, type: 'alert' })
        axios.post(config.dburl + '/registers', body)
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }

    if (subtopic === 'notifications') {
        const body = JSON.parse(message)
        console.log({ ...body, type: 'notification' })

        // createRegister({ ...body, type: 'notification' })
        // axios.post(config.dburl + '/registers', body)
        //     .then(response => console.log(response))
        //     .catch(err => console.log(err))
    }





    // client.end()
})


