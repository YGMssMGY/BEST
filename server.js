require("dotenv").config({ path: ".env.local" });
let fastify=require("fastify")({ logger: false });
let { fromPath }=require("pdf2pic");
let fs=require("fs/promises");
let path=require("path");
let port=process.env.PORT_NUMBER;
let imagesDir=path.join(__dirname, "images");
let pdfPath=path.join(__dirname, "/magazines/BEST_Magazine_Mockup.pdf");
async function ensureImagesDir(){
    await fs.mkdir(imagesDir,{ recursive: true });
}
fastify.register(require("@fastify/static"),{
    root: __dirname,
    prefix: "/",
    maxAge: 0
});
fastify.register(require("@fastify/static"),{
    root: imagesDir,
    prefix: "/images/",
    decorateReply: false
});
fastify.get("/pdf", (request, reply)=>{
    return reply.sendFile(pdfPath);
});
fastify.get("/pdf-to-img", async (request, reply)=>{
    reply
        .type("text/event-stream")
        .header("Cache-Control", "no-cache")
        .header("Connection", "keep-alive");

    try{
        await fs.rm(imagesDir,{ recursive: true, force: true });
        await fs.mkdir(imagesDir,{ recursive: true });
        let converter=fromPath(pdfPath,{
            density: 300,
            savePath: imagesDir,
            format: "png",
            width: 800,
            concurrency: 4
        });
        let { pages: totalPages }=await converter.info();
        reply.send(`event: totalpages\ndata: ${totalPages}\n\n`);
        await converter.bulk(-1);
        reply.send(`event: generatedpages\ndata: ${totalPages}\n\n`);
    }
    catch (error){
        console.error("PDF Processing Error:", error);
        reply.send(`event: error\ndata: ${error.message}\n\n`);
    }
    finally{
        reply.send("\n");
    }
});
async function start(){
    await ensureImagesDir();
    let address=await fastify.listen({ port, host: "::" });
    console.log(`Server running on http://localhost:${port}`);
}
start().catch(err=>{
    console.error("Server startup error:", err);
    process.exit(1);
});