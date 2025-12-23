
(function(){
const dob=localStorage.studentDOB_FULL;
if(!dob)return;
const b=new Date(dob),t=new Date();
if(b.getDate()!=t.getDate()||b.getMonth()!=t.getMonth())return;
const age=t.getFullYear()-b.getFullYear();
const name=localStorage.studentName||"Student";
const box=document.createElement("div");
box.id="greet3d";
box.innerHTML=`<div class=lottie-box></div><div class=greet-title>🎂 Happy Birthday ${name}</div>
<div class=greet-msg>आज आपका ${age}वाँ जन्मदिन है 🎉</div>`;
document.body.appendChild(box);box.classList.add("show");
speechSynthesis.speak(new SpeechSynthesisUtterance(`Happy Birthday ${name}. आज आपका ${age}वाँ जन्मदिन है`));
setTimeout(()=>box.remove(),10000);
})();
