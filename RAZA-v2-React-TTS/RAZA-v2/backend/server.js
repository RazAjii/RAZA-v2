const express=require("express");
const cors=require("cors");
const rateLimit=require("express-rate-limit");
const path=require("path");
const tts=require("@sefinek/google-tts-api");
const app=express();
const PORT=process.env.PORT||3000;
app.use(cors());app.use(express.json({limit:"100kb"}));
app.use("/api/tts",rateLimit({windowMs:60000,limit:20,standardHeaders:true,legacyHeaders:false}));
const languages=["en","hi","ne"];
app.get("/api/health",(_,res)=>res.json({ok:true,app:"RAZA",version:"2.0"}));
app.get("/api/languages",(_,res)=>res.json(languages));
app.post("/api/tts/generate",async(req,res)=>{
 try{
  const {text,language="en",speed=1}=req.body||{};
  if(typeof text!=="string"||!text.trim())return res.status(400).json({error:"Please enter some text."});
  if(text.length>5000)return res.status(400).json({error:"Maximum 5,000 characters."});
  if(!languages.includes(language))return res.status(400).json({error:"Unsupported language."});
  const chunks=await tts.getAllAudioBase64(text.trim(),{lang:language,slow:Number(speed)<.8,host:"https://translate.google.com",timeout:15000,splitPunct:".,!?;:।？！"});
  const audio=Buffer.concat(chunks.map(x=>Buffer.from(x.base64,"base64")));
  res.json({success:true,mimeType:"audio/mpeg",format:"mp3",audioBase64:audio.toString("base64"),durationEstimate:Math.max(1,Math.round(text.trim().split(/\s+/).length/(Number(speed)*2.3)))});
 }catch(e){console.error(e);res.status(502).json({error:"Voice generation failed. Check your internet connection and try again."})}
});
app.listen(PORT,()=>console.log(`RAZA API running on http://localhost:${PORT}`));