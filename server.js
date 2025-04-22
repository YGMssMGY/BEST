require("dotenv").config({ path: ".env.local" });
let fastify=require("fastify")({ logger: true });
let { fromPath }=require("pdf2pic");
let fs=require("fs/promises");
let path=require("path");
let port=process.env.PORT_NUMBER;
let imagesDir=path.join(__dirname, "images");
let pdfPath=path.join(__dirname, "/magazines/BEST_Magazine_Mockup.pdf");
async function ensureImagesDir(){
    try{
        await fs.access(imagesDir);
    }
    catch{
        await fs.mkdir(imagesDir,{ recursive: true });
    }
}
fastify.register(require("@fastify/static"),{
    root: __dirname,
    maxAge: 0
});
fastify.register(require("@fastify/static"),{
    root: imagesDir,
    prefix: "/images/",
    decorateReply: false
});
fastify.get("/pdf", async (request, reply)=>{
    reply.header("Content-Type", "application/pdf");
    return reply.sendFile(pdfPath);
});
fastify.get("/pdf-to-img", async (request, reply)=>{
    reply.raw.writeHead(200,{
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    });
    try{
        let files=await fs.readdir(imagesDir);
        await Promise.all(files.map(file=> fs.unlink(path.join(imagesDir, file))));
        let converter=fromPath(pdfPath,{
            density: 300,
            savePath: imagesDir,
            format: "png",
            width: 800
        });
        let{ pages: totalPages }=await converter.info();
        await converter.bulk(-1);
        reply.raw.write(`event: totalpages\ndata: ${totalPages}\n\n`);
        reply.raw.write(`event: generatedpages\ndata: ${totalPages}\n\n`);
    }
    catch (error){
        console.error("PDF Processing Error:", error);
        reply.raw.write(`event: error\ndata: ${error.message}\n\n`);
    }
    finally{
        reply.raw.end();
    }
});
async function start(){
    await ensureImagesDir();
    await fastify.listen({ port, host: "::"});
    console.log(`Server running on http://localhost:${port}`);
}
start().catch(err=>{
    console.error("Server startup error:", err);
    process.exit(1);
});