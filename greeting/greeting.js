function runGreeting(){
  const name = localStorage.studentName || "Students";
  const h = new Date().getHours();
  let title,msg;

  if(h>=5 && h<12){
    title=`🌞 Good Morning ${name}`;
    msg="आज का दिन सीखने का है";
  }else if(h>=16 && h<20){
    title=`🌸 Good Evening ${name}`;
    msg="आज आपने जो सीखा वही आपकी ताकत है";
  }else if(h>=12 && h<16){
    title=`☀️ Good Afternoon ${name}`;
    msg="मेहनत करते रहो";
  }else{
    title=`🌙 Good Night ${name}`;
    msg="अच्छी नींद लें";
  }

  alert(title); // TEMP test
}
