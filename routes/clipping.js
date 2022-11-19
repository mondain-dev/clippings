import express from 'express'
var router = express.Router()

import fs from 'fs'

import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import rehypeStringify from 'rehype-stringify'

import config from "../config.js"

router.get("/*", (req, res) => {
    var clippingFile = decodeURI(config.DIR_CLIPPINGS + req.path)
    if(clippingFile.toLowerCase().endsWith('.html') || clippingFile.toLowerCase().endsWith('.htm')){
        res.sendFile(clippingFile)
    }
    else if(clippingFile.toLowerCase().endsWith('.md')){
        fs.readFile(clippingFile, 'utf8', (err, data) => {
            unified()
            .use(remarkParse)
            .use(remarkFrontmatter)
            .use(remarkGfm)
            .use(remarkRehype)
            .use(rehypeStringify)
            .process(data, (err, file) => {
                res.send("<!DOCTYPE html><html><head> <link rel=\"stylesheet\" href=\"..\/css\/foghorn.css\"><\/head><body>" + String(file) + "<\/body><\/html>")
            })
        })
    }
    else if(clippingFile.toLowerCase().endsWith('.pdf')) {
        var pdfStream = fs.createReadStream(clippingFile);
        var stat = fs.statSync(clippingFile);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'inline; filename=' + clippingFile.split('/').reverse()[0]);
        pdfStream.pipe(res);
    }
    else {
        var otherStream = fs.createReadStream(clippingFile);
        var stat = fs.statSync(clippingFile);
        res.setHeader('Content-Length', stat.size);
        otherStream.pipe(res);
    }
})

export default router