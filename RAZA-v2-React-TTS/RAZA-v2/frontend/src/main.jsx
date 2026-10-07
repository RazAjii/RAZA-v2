import React,{useEffect,useRef,useState} from "react";
import {createRoot} from "react-dom/client";
import {Play,Pause,Square,Download,Trash2,History,Mic2,Sparkles,Settings2,Volume2,Clock3,FileAudio,Menu,X,Plus} from "lucide-react";
import "./styles.css";

const voices=[
 {id:"aarav",name:"Aarav",type:"Young Male",style:"Friendly",tag:"Popular",initial:"A"},
 {id:"kabir",name:"Kabir",type:"Deep Male",style:"Dramatic",tag:"Deep",initial:"K"},
 {id:"rohan",name:"Rohan",type:"Narrator Male",style:"Documentary",tag:"Narrator",initial:"R"},
 {id:"arjun",name:"Arjun",type:"Professional Male",style:"Professional",tag:"Pro",initial:"A"},
 {id:"dev",name:"Dev",type:"Calm Male",style:"Calm",tag:"Calm",initial:"D"},
 {id:"meera",name:"Meera",type:"Warm Female",style:"Warm",tag:"Warm",initial:"M"},
 {id:"riya",name:"Riya",type:"Professional Female",style:"Professional",tag:"Pro",initial:"R"},
 {id:"sana",name:"Sana",type:"Narrator Female",style:"Storytelling",tag:"Story",initial:"S"},
 {id:"anaya",name:"Anaya",type:"Energetic Female",style:"Energetic",tag:"Energy",initial:"A"}
];

const languages=[["en","English","🇺🇸"],["hi","Hindi","🇮🇳"],["ne","Nepali","🇳🇵"]];

function App(){
 const [text,setText]=useState("");
 const [lang,setLang]=useState("en");
 const [voice,setVoice]=useState("arjun");
 const [speed,setSpeed]=useState(1);
 const [pitch,setPitch]=useState(0);
 const [volume,setVolume]=useState(100);
 const [emotion,setEmotion]=useState("Neutral");
 const [style,setStyle]=useState("Natural");
 const [audio,setAudio]=useState(null);
 const [status,setStatus]=useState("");
 const [busy,setBusy]=useState(false);
 const [history,setHistory]=useState(()=>JSON.parse(localStorage.getItem("raza-history")||"[]"));
 const [tab,setTab]=useState("studio");
 const [mobile,setMobile]=useState(false);
 const audioRef=useRef(null);

 useEffect(()=>localStorage.setItem("raza-history",JSON.stringify(history)),[history]);
 const words=text.trim()?text.trim().split(/\s+/).length:0;
 const estimate=Math.max(0,Math.round(words/(2.3*speed)));
 const selected=voices.find(v=>v.id===voice)||voices[0];

 async function generate(){
  if(!text.trim()){setStatus("Enter your script first.");return}
  setBusy(true);setStatus("Generating your RAZA voiceover…");
  try{
   const r=await fetch("/api/tts/generate",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({text,language:lang,voice,speed,pitch,volume:volume/100,emotion,style})});
   const d=await r.json(); if(!r.ok)throw Error(d.error||"Generation failed");
   const src=`data:${d.mimeType};base64,${d.audioBase64}`;
   const item={id:Date.now(),text:text.slice(0,90),language:lang,voice:selected.name,duration:d.durationEstimate,date:new Date().toLocaleString(),src};
   setAudio(item); setHistory(h=>[item,...h].slice(0,20)); setStatus("Ready to use in your video.");
  }catch(e){setStatus(e.message)}
  finally{setBusy(false)}
 }
 function playPreview(){
  if(!text.trim()){setStatus("Enter some text first.");return}
  if("speechSynthesis" in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=speed;u.pitch=1+pitch/20;u.volume=volume/100;speechSynthesis.speak(u);setStatus("Playing browser preview…")}
 }
 function download(item,format="mp3"){
  const a=document.createElement("a");a.href=item.src;a.download=`raza_${item.language}_${item.voice}_${item.id}.${format}`;a.click();
 }
 function load(item){setAudio(item);setText(item.text);setTab("studio");setStatus("Loaded from history.")}
 function remove(id){setHistory(h=>h.filter(x=>x.id!==id));if(audio?.id===id)setAudio(null)}

 return <div className="app">
  <header className="topbar">
   <div className="brand"><div className="brandMark"><Sparkles size={18}/></div><b>RAZA</b><span>AI VOICE STUDIO</span></div>
   <div className="topActions"><button className="ghost" onClick={()=>setTab("history")}><History size={17}/> History <i>{history.length}</i></button><button className="mobileBtn" onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button></div>
  </header>
  <div className="layout">
   <aside className={"sidebar "+(mobile?"open":"")}>
    <div className="sideTitle">WORKSPACE</div>
    <button className={tab==="studio"?"nav active":"nav"} onClick={()=>{setTab("studio");setMobile(false)}}><Mic2/> Voice Studio</button>
    <button className={tab==="history"?"nav active":"nav"} onClick={()=>{setTab("history");setMobile(false)}}><History/> Generation History</button>
    <div className="sideTitle space">CREATE</div>
    <button className="newBtn" onClick={()=>{setText("");setAudio(null);setStatus("");setTab("studio")}}><Plus/> New project</button>
    <div className="sideBottom"><div className="miniCard"><Sparkles size={16}/><div><b>RAZA Free</b><small>Creator workspace</small></div></div></div>
   </aside>

   <main className="main">
    {tab==="history"?<HistoryView history={history} load={load} remove={remove}/>:<>
     <div className="pageHead"><div><div className="eyebrow">VOICE STUDIO</div><h1>Create your next voiceover.</h1><p>Write a script, choose a voice, tune it, and download your audio.</p></div><div className="statusPill"><span className={busy?"pulse":""}></span>{busy?"Generating":"Ready"}</div></div>
     <div className="studioGrid">
      <section className="panel scriptPanel">
       <div className="panelHead"><div><b>Your script</b><small>{words} words • ~{estimate}s</small></div><button className="smallBtn" onClick={()=>setText("")}>Clear</button></div>
       <textarea value={text} onChange={e=>setText(e.target.value)} maxLength={5000} placeholder="Start writing your script here…&#10;&#10;Tip: Short paragraphs and punctuation create more natural pacing."/>
       <div className="textFoot"><span>{text.length.toLocaleString()} / 5,000</span><span>Auto-save enabled</span></div>
       {audio&&<AudioResult item={audio} audioRef={audioRef} download={download}/>}
       <div className="status">{status}</div>
      </section>

      <aside className="panel settingsPanel">
       <div className="panelHead"><b>Voice settings</b><Settings2 size={17}/></div>
       <label>Language</label>
       <div className="langGrid">{languages.map(x=><button className={lang===x[0]?"lang active":"lang"} onClick={()=>setLang(x[0])} key={x[0]}><span>{x[2]}</span>{x[1]}</button>)}</div>
       <label>Voice</label>
       <div className="voiceList">{voices.map(v=><button key={v.id} onClick={()=>setVoice(v.id)} className={voice===v.id?"voiceCard active":"voiceCard"}><div className="avatar">{v.initial}</div><div className="vtext"><b>{v.name}</b><small>{v.type} • {v.style}</small></div><span className="tag">{v.tag}</span></button>)}</div>
       <Control label="Speed" value={`${speed.toFixed(1)}×`} min=".5" max="2" step=".1" val={speed} set={setSpeed}/>
       <Control label="Pitch" value={pitch} min="-10" max="10" step="1" val={pitch} set={setPitch}/>
       <Control label="Volume" value={`${volume}%`} min="0" max="100" step="1" val={volume} set={setVolume}/>
       <div className="two"><div><label>Emotion</label><select value={emotion} onChange={e=>setEmotion(e.target.value)}>{["Neutral","Happy","Sad","Angry","Excited","Calm","Serious","Dramatic","Inspirational","Fearful"].map(x=><option key={x}>{x}</option>)}</select></div><div><label>Style</label><select value={style} onChange={e=>setStyle(e.target.value)}>{["Natural","Professional","Storytelling","Documentary","Gaming","Energetic"].map(x=><option key={x}>{x}</option>)}</select></div></div>
       <button className="generate" disabled={busy} onClick={generate}><Sparkles size={18}/>{busy?"Generating…":"Generate voice"}</button>
       <button className="preview" onClick={playPreview}><Play size={16}/> Browser preview</button>
      </aside>
     </div>
    </>}
   </main>
  </div>
 </div>
}

function Control({label,value,min,max,step,val,set}){return <div className="control"><div><label>{label}</label><span>{value}</span></div><input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(Number(e.target.value))}/></div>}

function AudioResult({item,audioRef,download}){
 const [playing,setPlaying]=useState(false);
 function toggle(){if(!audioRef.current)return; if(audioRef.current.paused){audioRef.current.play();setPlaying(true)}else{audioRef.current.pause();setPlaying(false)}}
 return <div className="resultBox">
  <div className="resultTop"><div><span className="ready">GENERATED</span><b>{item.voice} • {item.language.toUpperCase()}</b></div><span>{item.duration}s</span></div>
  <div className="wave" onClick={toggle}>{Array.from({length:64},(_,i)=><i key={i} style={{height:`${18+Math.abs(Math.sin(i*.8))*58+((i*17)%22)}%`}}/>)}<div className="wavePlay">{playing?<Pause/>:<Play/>}</div></div>
  <audio ref={audioRef} src={item.src} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} controls/>
  <div className="formatRow"><button onClick={()=>download(item,"mp3")}><Download size={16}/> MP3</button><button onClick={()=>download(item,"wav")}><Download size={16}/> WAV*</button><span>*WAV button downloads the generated source when WAV conversion is unavailable.</span></div>
 </div>
}

function HistoryView({history,load,remove}){return <div><div className="pageHead"><div><div className="eyebrow">LIBRARY</div><h1>Generation history.</h1><p>Your recent RAZA voiceovers are stored in this browser.</p></div></div>{!history.length?<div className="empty"><History size={38}/><h3>No generations yet</h3><p>Create your first voiceover from the studio.</p></div>:<div className="historyList">{history.map(x=><div className="historyItem" key={x.id}><div className="historyIcon"><FileAudio/></div><div className="historyText"><b>{x.text||"Untitled voiceover"}</b><small>{x.voice} • {x.language.toUpperCase()} • {x.duration}s • {x.date}</small></div><button onClick={()=>load(x)} className="iconBtn"><Play size={16}/></button><button onClick={()=>remove(x.id)} className="iconBtn danger"><Trash2 size={16}/></button></div>)}</div>}</div>}

createRoot(document.getElementById("root")).render(<App/>);