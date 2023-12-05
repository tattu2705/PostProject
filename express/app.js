const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')
const {Server} = require('socket.io')
const mongoose = require('mongoose')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')

const app = express()
app.use(cors())

const fileStorage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4())
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}

app.use(bodyParser.json())
app.use(multer({ storage: fileStorage, fileFilter }).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images')))


app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)


app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500;
    const message = error.message
    const data = error.data
    res.status(status).json(
        { message, data }
    )
})

mongoose.connect(
    'mongodb+srv://tattu2705:nosexnolife123@cluster0.zvdjjox.mongodb.net/messages'
)
    .then(result => {
        const server = app.listen(8080)
        const io = require('./socket').init(server)
        io.on('connection', (socket) => {

        })
        
    })
    .catch(err => console.log(err))