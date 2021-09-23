const express = require('express')

const app = express()

app.get('/', (req, res) => {
    // return res.json({message: 'Olá'})
    return res.send('Olá DEV')
})

app.listen(3000, () => {
    console.log('Server running...')
})