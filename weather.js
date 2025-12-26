/* ================= WEATHER OVERLAY SYSTEM ================= */

(function(){

const API_KEY = "d8418db7ef0e7570b33152730184776e";
const CITY = "Gorakhpur";

document.addEventListener("DOMContentLoaded", ()=>{

  const layer  = document.getElementById("weatherEffect");
  const toggle = document.getElementById("weatherToggle");
  const info   = document.getElementById("weatherInfo");

  if(!layer || !toggle || !info){
    console.error("❌ Weather elements missing");
    return;
  }

  let enabled = localStorage.weatherON !== "false";
  toggle.innerText = enabled ? "🌦️ Weather ON" : "🚫 Weather OFF";

  toggle.onclick = ()=>{
    enabled = !enabled;
    localStorage.weatherON = enabled;
    toggle.innerText = enabled ? "🌦️ Weather ON" : "🚫 Weather OFF";
    if(!enabled) layer.innerHTML="";
    else loadWeather();
  };

  function clear(){ layer.innerHTML=""; }

  function snow(){
    clear();
    for(let i=0;i<90;i++){
      const s=document.createElement("div");
      s.className="snow";
      s.innerText="❄";
      s.style.left=Math.random()*100+"vw";
      s.style.fontSize=(12+Math.random()*10)+"px";
      s.style.animationDuration=(6+Math.random()*6)+"s";
      layer.appendChild(s);
    }
  }

  function fog(){
    clear();
    const f=document.createElement("div");
    f.className="fog";
    layer.appendChild(f);
  }

  function rain(thunder){
    clear();
    for(let i=0;i<140;i++){
      const r=document.createElement("div");
      r.className="rain";
      r.style.left=Math.random()*100+"vw";
      r.style.animationDuration=(.7+Math.random())+"s";
      layer.appendChild(r);
    }
    if(thunder){
      const t=document.createElement("div");
      t.className="thunder";
      layer.appendChild(t);
    }
  }

  async function loadWeather(){
    if(!enabled) return;
    try{
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      const temp = Math.round(data.main.temp);
      const condition = data.weather[0].main;

      info.innerHTML = `${temp}°C · <span id="liveTime"></span>`;

      if(temp <= 7)      fog();
      else if(temp <= 15) snow();
      else if(condition.includes("Rain")) rain(true);
      else clear();

    }catch(e){
      console.error("Weather error", e);
    }
  }

  function updateTime(){
    const d = new Date();
    let h = d.getHours();
    let m = d.getMinutes().toString().padStart(2,"0");
    let am = h>=12?"PM":"AM";
    h = h%12 || 12;
    const t=document.getElementById("liveTime");
    if(t) t.innerText = `${h}:${m} ${am}`;
  }

  updateTime();
  setInterval(updateTime,60000);
  loadWeather();

});

})();
