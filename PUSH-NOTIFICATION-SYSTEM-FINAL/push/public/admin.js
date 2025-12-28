async function login(){
  const r = await fetch("/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({password:pw.value})
  });
  if(r.ok){
    dash.style.display="block";
  }else alert("Wrong Password");
}

async function send(){
  await fetch("/schedule",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      site:site.value,
      title:title.value,
      body:body.value,
      image:image.value,
      url:url.value,
      time:new Date(time.value).getTime()
    })
  });
  alert("✅ Notification Scheduled");
}
