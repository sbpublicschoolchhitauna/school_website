
fetch("https://api.open-meteo.com/v1/forecast?latitude=26.87&longitude=83.32&current_weather=true")
.then(r=>r.json()).then(d=>{
 if(!d.current_weather)return;
 const t=d.current_weather.temperature;
 const m=document.getElementById("greetMsg");
 if(!m)return;
 if(t>35)m.innerText+=" 🌡️ आज बहुत गर्मी है, पानी पिएँ";
 else if(t<10)m.innerText+=" ❄️ आज ठंड है, गरम कपड़े पहनें";
});
