const connectToMongo=require('./db');

connectToMongo();
var cors = require('cors')

const express = require('express')
const app = express()
const port = 5000

app.use(cors())



app.use(express.json())

//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNoteBook backend listening on port http://localhost:${port}`)
})


