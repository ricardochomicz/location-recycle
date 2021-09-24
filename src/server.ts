import express from "express";
import routes from "./routes";
import path from 'path'

const app = express()
const PORT = 3000
app.use(routes)

//rota estatica
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.listen(PORT, () => {
    console.log(`Server is running port ${PORT}`)
})