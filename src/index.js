import express from "express"
import productsRoutes from './routes/products.routes.js';
import categoriesRoutes from './routes/categories.routes.js'
import cors from 'cors'
const app = express()
const port = 3000


app.use(express.json())
app.use(cors());

app.use('/api',productsRoutes)
app.use('/api',categoriesRoutes)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))