
(function(){
const d=new Date();
const mmdd=String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const festMap={
 "01-26":"🇮🇳 गणतंत्र दिवस की शुभकामनाएँ",
 "08-15":"🇮🇳 स्वतंत्रता दिवस की शुभकामनाएँ",
 "10-02":"🕊️ गांधी जयंती की शुभकामनाएँ",
 "11-01":"🪔 दीपावली की शुभकामनाएँ"
};
if(!festMap[mmdd])return;
const name=localStorage.studentName||"Students";
const box=document.createElement("div");
box.id="greet3d";
box.innerHTML=`<div class=lottie-box></div>
<div class=greet-title>${festMap[mmdd]} ${name}</div>
<div class=greet-msg>आज का दिन हमारे लिए विशेष है</div>`;
document.body.appendChild(box);box.classList.add("show");
speechSynthesis.speak(new SpeechSynthesisUtterance(festMap[mmdd]+" "+name));
setTimeout(()=>box.remove(),10000);
})();
