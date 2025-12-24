(function(){

  /* ❌ दिन में 1 बार */
  const today = new Date().toDateString();
  if(localStorage.greetedDate === today) return;
  localStorage.greetedDate = today;

  const hour = new Date().getHours();

  let title="", text="", emoji="", bg="", sunMode="", voiceText="";

  /* ⏰ TIME LOGIC */
  if(hour>=5 && hour<12){
    title="Good Morning 🌞";
    emoji="😊📚";
    text="आज का दिन आपके सपनों को सच करने का मौका है।\nपूरे मन से पढ़ाई करें और आगे बढ़ें।";
    bg="linear-gradient(to top,#4facfe,#00f2fe)";
    sunMode="sunrise";
    voiceText="गुड मॉर्निंग विद्यार्थी। आज पढ़ाई से जीत पक्की है। मेहनत करो और आगे बढ़ो।";
  }
  else if(hour>=12 && hour<16){
    title="Good Afternoon 🌤️";
    emoji="🙂📖";
    text="नियमित अभ्यास ही सफलता की कुंजी है।\nखुद पर भरोसा बनाए रखें।";
    bg="linear-gradient(to top,#43cea2,#185a9d)";
    voiceText="गुड आफ्टरनून विद्यार्थी। आप बहुत अच्छा कर रहे हैं। सीखते रहिए।";
  }
  else if(hour>=16 && hour<20){
    title="Good Evening 🌇";
    emoji="⭐😊";
    text="आज की मेहनत कल की सफलता बनेगी।\nखुद पर विश्वास रखें।";
    bg="linear-gradient(to top,#fa709a,#fee140)";
    sunMode="sunset";
    voiceText="गुड ईवनिंग विद्यार्थी। आज आपने जो सीखा वही आपकी ताकत है।";
  }
  else{
    title="Good Night 🌙";
    emoji="😴✨";
    text="आज का दिन शानदार रहा।\nअब आराम करें और कल नई ऊर्जा के साथ मिलेंगे।";
    bg="linear-gradient(to top,#141e30,#243b55)";
    voiceText="गुड नाइट विद्यार्थी। अच्छे सपने देखो और कल फिर मेहनत करेंगे।";
  }

  /* 🧩 BUILD HTML */
  const overlay=document.createElement("div");
  overlay.id="greetingOverlay";
  overlay.style.background=bg;

  overlay.innerHTML=`
    ${sunMode ? `<div class="sun ${sunMode}"></div>` : ``}
    <div class="greeting-box">
      <div class="greeting-emoji">${emoji}</div>
      <div class="greeting-title">${title}</div>
      <div class="greeting-text">${text.replace(/\n/g,"<br>")}</div>
    </div>
  `;

  document.body.appendChild(overlay);

  /* 🎤 HINDI VOICE */
  setTimeout(()=>{
    if("speechSynthesis" in window){
      const speech=new SpeechSynthesisUtterance(voiceText);
      speech.lang="hi-IN";
      speech.rate=0.95;
      speech.pitch=1;
      window.speechSynthesis.speak(speech);
    }
  },800);

  /* ⏳ AUTO CLOSE 5s */
  setTimeout(()=>{
    overlay.classList.add("hide");
    setTimeout(()=>overlay.remove(),1200);
  },5000);

})();
