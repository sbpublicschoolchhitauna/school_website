
(function(){
  function speak(text){
    if(!('speechSynthesis' in window)) return;
    const u=new SpeechSynthesisUtterance(text);
    u.lang='hi-IN';u.rate=0.9;
    speechSynthesis.speak(u);
  }
  function runGreeting(){
    const h=new Date().getHours();
    let mode='';
    if(h>=5&&h<12) mode='morning';
    else if(h>=16&&h<20) mode='evening';
    else return;
    const key='greet_done_'+mode;
    if(localStorage.getItem(key)) return;
    localStorage.setItem(key,'1');
    const name=localStorage.studentName||'Students';
    const text=mode==='morning'?'Good Morning '+name:'Good Evening '+name;
    const box=document.createElement('div');
    box.id='greetScene';box.className=mode;
    box.innerHTML=`
      <div class="sun"></div>
      <div class="cloud" style="top:90px"></div>
      <div class="cloud" style="top:140px;animation-delay:5s"></div>
      <div class="birds">🐦 🐦</div>
      <div class="cartoon">🙋‍♂️</div>
      <div class="greetText">${text}</div>`;
    document.body.appendChild(box);
    speak(text);
    setTimeout(()=>box.remove(),9000);
  }
  window.runGreeting=runGreeting;
  window.addEventListener('load',runGreeting);
})();
