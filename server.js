let path=require("path");
let fastify=require("fastify")({logger: false});
let PORT=1331;
let publicDir=path.join(__dirname, "public");
fastify.register(require("@fastify/static"),{
    root: publicDir,
    prefix: "/",
    setHeaders: (res, filePath)=>{
        let ext=path.extname(filePath).toLowerCase();
        if ([".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".svg"].includes(ext)){
            res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
        }
        else if ([".woff", ".woff2", ".ttf", ".otf", ".eot"].includes(ext)){
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
    },
    cacheControl: false,
    maxAge: 0,
    immutable: false
});
fastify.addHook("onSend", async (request, reply, payload)=>{
    try{
        let contentType=String(reply.getHeader("content-type")||reply.getHeader("Content-Type")||"");
        if (!/text\/html/i.test(contentType)){
            return payload;
        }
        let inject=`<link rel="preload" href="/NotoSans-VariableFont_wdth_wght.ttf" as="font" type="font/ttf" crossorigin>`;
        if (Buffer.isBuffer(payload)){
            let str=payload.toString("utf8");
            if (/<\/head>/i.test(str)){
                str=str.replace(/<\/head>/i, `${inject}\n</head>`);
                return Buffer.from(str, "utf8");
            }
            else{
                return payload;
            }
        }
        if (typeof payload=="string"){
            if (/<\/head>/i.test(payload)){
                return payload.replace(/<\/head>/i, `${inject}\n</head>`);
            }
            return payload;
        }
        request.log.debug({msg: "onSend: payload not modified (not string/buffer)", type: typeof payload});
        return payload;
    }
    catch (err){
        request.log.error({msg: "onSend injection failed", error: err});
        return payload;
    }
});
fastify.setNotFoundHandler((request, reply)=>{
    reply.code(404).type("text/plain").send("404 Not Found");
});
fastify.setErrorHandler((error, request, reply)=>{
    request.log.error(error);
    reply.code(500).type("text/plain").send(`Server error: ${error.message}`);
});
let start=async()=>{
    try{
        await fastify.listen({port: PORT, host: "::"});
        console.log(`Server running at http://localhost:${PORT}`);
    }
    catch (err){
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};
start();