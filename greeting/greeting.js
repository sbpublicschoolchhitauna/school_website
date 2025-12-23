
(function(){
const today=new Date().toDateString();
if(localStorage.greetDone===today)return;
const name=localStorage.studentName||"Students";
const h=new Date().getHours();
let title,msg;
if(h>=5&&h<12){title=`🌞 Good Morning ${name}`;msg="आज का दिन सीखने का है";}
else if(h<16){title=`☀️ Good Afternoon ${name}`;msg="मेहनत करते रहो";}
else if(h<20){title=`🌸 Good Evening ${name}`;msg="आपने अच्छा किया";}
else{title=`🌙 Good Night ${name}`;msg="अच्छी नींद लें";}
const box=document.createElement("div");
box.id="greet3d";
box.innerHTML=`<div class=lottie-box></div><div class=greet-title>${title}</div><div class=greet-msg id=greetMsg>${msg}</div>`;
document.body.appendChild(box);box.classList.add("show");
speechSynthesis.speak(new SpeechSynthesisUtterance(title+" "+msg));
setTimeout(()=>{box.remove();localStorage.greetDone=today},8000);
})();
