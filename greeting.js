(function(){

  /* ✅ दिन में सिर्फ 1 बार */
  const today=new Date().toDateString();
  if(localStorage.greetedDate===today) return;
  localStorage.greetedDate=today;

  const hour=new Date().getHours();

  let title="",text="",emoji="",voice="",sun="",cartoon="",bg="";

  /* 🌦️ WEATHER (simple logic) */
  function getWeatherBg(){
    const r=Math.random();
    if(r<0.25) return "linear-gradient(to top,#4facfe,#00f2fe)";        // clear
    if(r<0.5)  return "linear-gradient(to top,#bdc3c7,#2c3e50)";        // cloudy
    if(r<0.75) return "linear-gradient(to top,#373b44,#4286f4)";        // rain
    return "linear-gradient(to top,#141e30,#243b55)";                   // thunder
  }

  bg=getWeatherBg();

  /* ⏰ TIME LOGIC */
  if(hour>=5 && hour<12){
    title="Good Morning 🌞";
    text="आज का दिन नई शुरुआत का है।\nपूरे मन से पढ़ाई करें।";
    voice="गुड मॉर्निंग विद्यार्थी। आज पढ़ाई से जीत पक्की है।";
    sun="sunrise";
    cartoon="👦🏻";
  }
  else if(hour>=12 && hour<16){
    title="Good Afternoon 🌤️";
    text="निरंतर अभ्यास से ही सफलता मिलती है।";
    voice="गुड आफ्टरनून विद्यार्थी। आप बहुत अच्छा कर रहे हैं।";
    cartoon="👧🏻";
  }
  else if(hour>=16 && hour<20){
    title="Good Evening 🌇";
    text="आज की मेहनत कल चमकेगी।";
    voice="गुड ईवनिंग विद्यार्थी। खुद पर भरोसा रखें।";
    sun="sunset";
    cartoon="👦🏽";
  }
  else{
    title="Good Night 🌙";
    text="अब आराम का समय है।\nकल फिर नई ऊर्जा से मिलेंगे।";
    voice="गुड नाइट विद्यार्थी। अच्छे सपने देखो।";
    cartoon="😴";
  }

  /* 🧩 BUILD UI */
  const o=document.createElement("div");
  o.id="greetingOverlay";
  o.style.background=bg;

  o.innerHTML=`
    ${sun?`<div class="sun ${sun}"></div>`:""}
    <div class="cloud">☁️</div>
    <div class="cloud c2">☁️</div>
    <div class="bird">🐦</div>

    <div class="greeting-box">
      <div class="cartoon">${cartoon}</div>
      <div class="greeting-title">${title}</div>
      <div class="greeting-text">${text.replace(/\n/g,"<br>")}</div>
    </div>
  `;

  document.body.appendChild(o);

  /* 🎤 HINDI VOICE */
  setTimeout(()=>{
    if("speechSynthesis" in window){
      const s=new SpeechSynthesisUtterance(voice);
      s.lang="hi-IN";
      s.rate=.95;
      window.speechSynthesis.speak(s);
    }
  },900);

  /* ⏳ AUTO CLOSE */
  setTimeout(()=>{
    o.classList.add("hide");
    setTimeout(()=>o.remove(),1200);
  },5000);

})();
