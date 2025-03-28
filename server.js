require("dotenv").config({ path: ".env.local" });
const express=require("express");
const{ fromPath }=require("pdf2pic");
const fs=require("fs");
const path=require("path");
const app=express();
const port=process.env.PORT_NUMBER;
const imagesDir=path.join(__dirname, "images");
const pdfPath=path.join(__dirname, "BEST Magazine Mockup.pdf");
if (!fs.existsSync(imagesDir)){
    fs.mkdirSync(imagesDir);
}
app.use(express.static(__dirname));
app.get("/pdf-to-img", async (req, res)=>{
    fs.readdir(imagesDir, (err, files)=>{
        if (err) console.error("Error reading images directory:", err);
        files.forEach(file=>{
            fs.unlink(path.join(imagesDir, file), err=>{
                if (err) console.error("Error deleting file:", err);
            });
        });
    });
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    try{
        const converter=fromPath(pdfPath, {
            density: 300,
            savePath: imagesDir,
            format: "png",
            width: 800
        });
        const totalPages=await converter.info().then(info=>info.pages);
        for (let i=1; i<=totalPages; i++){
            await converter.bulk(-1);
            res.write(`event: generatedpages\ndata: ${i}\n\n`);
        }
        res.write(`event: totalpages\ndata: ${totalPages}\n\n`);
    }
    catch (error){
        console.error("PDF Processing Error:", error);
        res.write(`event: error\ndata: ${error.message}\n\n`);
    }
    res.end();
});
app.use("/images", express.static(imagesDir));
app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
});
