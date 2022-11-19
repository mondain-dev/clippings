import glob from "glob"
import config from "./config.js"

import express from "express" 

var app = express()

app.set("view engine", "pug")

app.get("/", (req, res) => {
    glob(config.DIR_CLIPPINGS + "/*", {nodir: true}, (er, files) =>{
        var clippings = files.map(str => str.replace(config.DIR_CLIPPINGS + "/", ""))
        res.render("index", {clippingList: clippings})
    })
    
})

import clippingRouter from './routes/clipping.js';
app.use('/clipping/', clippingRouter)
import styleRouter from './routes/style.js';
app.use('/css/', styleRouter)
app.listen(config.PORT, () => console.log(`Server is up on port ${config.PORT}.`))


export default app;