
async function applyWeatherSky(){
 try{
  const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude=26.87&longitude=83.32&current_weather=true');
  const d=await r.json();
  const sky=document.querySelector('.sky');
  if(!sky)return;
  const t=d.current_weather.temperature;
  if(t>35)sky.style.background='linear-gradient(#ff9a00,#ffe259)';
  else if(t<10)sky.style.background='linear-gradient(#b3cde0,#6497b1)';
 }catch(e){}
}
