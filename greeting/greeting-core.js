
async function runGreetingScene(){
 const h=new Date().getHours();
 const name=localStorage.studentName||"Students";
 let mode="",text="";
 if(h>=5&&h<12){mode="morning";text=`🌞 Good Morning ${name}`;}
 else if(h>=16&&h<20){mode="evening";text=`🌇 Good Evening ${name}`;}
 else return;

 const key="sceneDone_"+mode;
 if(localStorage[key])return;
 localStorage[key]="yes";

 const box=document.createElement("div");
 box.id="greetScene";
 box.className="show "+mode;
 box.innerHTML=`
  <div class="sky"></div>
  <div class="sun"></div>
  <div class="cloud"></div>
  <div class="bird">🐦🐦</div>
  <div class="cartoon">🙋‍♂️</div>
  <div class="greetText">${text}</div>
 `;
 document.body.appendChild(box);

 applyWeatherSky();
 runGreetingVoice(text);

 setTimeout(()=>box.remove(),9000);
}
window.addEventListener("load",runGreetingScene);
