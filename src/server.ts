import express from "express";
import routes from "./routes";
import path from 'path'

const app = express()
app.use(routes)
const PORT = 3333


//rota estatica
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.listen(PORT, () => {
    console.log(`Server is running port ${PORT}`)
})