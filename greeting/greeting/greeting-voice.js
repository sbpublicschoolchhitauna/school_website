
function runGreetingVoice(t){
 if(!('speechSynthesis'in window))return;
 const u=new SpeechSynthesisUtterance(t);
 u.lang='hi-IN';u.rate=.9;
 speechSynthesis.speak(u);
}
