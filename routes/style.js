import express from 'express'
var router = express.Router()

import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/*", (req, res) => {
    var styleFile = __dirname + '/../views/css/' + decodeURI(req.path)
    if(styleFile.toLowerCase().endsWith('.css')){
        res.sendFile(path.resolve(styleFile))
    }
})

export default router