import express from 'express'
var router = express.Router()

import fs from 'fs'

import {unified} from 'unified'
import remarkParse from 'remark-parse'
import extract  from "remark-extract-frontmatter"
import frontmatter from 'remark-frontmatter'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from "rehype-raw"
import rehypeMeta from "rehype-meta"
import rehypeDocument  from "rehype-document"
import rehypeStringify from 'rehype-stringify'
import rehypeKatex from 'rehype-katex'
import yaml from "yaml"

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
           .use(remarkMath)
           .use(extract, { yaml: yaml.parse, name: 'meta' })
           .use(frontmatter)
        //    .use(() => (data) => {
        //         data.children.filter( (e) => e.type=="yaml").forEach( e => {
        //             e.type = "code"
        //             e.lang = "yaml"
        //         });
        //         console.dir(data);
        //     })
           .use(remarkGfm)
           .use(remarkRehype, {"allowDangerousHtml": true})
           .use(rehypeRaw)
           .use(rehypeKatex)
           .use(rehypeDocument, {
                css: ['../css/foghorn.css', 'https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css']
            })
           .use(rehypeMeta)
           .use(rehypeStringify)
           .process(data, (err, file) => {
               res.send(String(file))
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