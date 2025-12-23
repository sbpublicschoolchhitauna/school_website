
function confirmStudent(name,cls){
 if(confirm(`क्या आप यही छात्र हैं?\nनाम: ${name}\nClass: ${cls}`)){
  localStorage.studentName=name;
 }else{
  localStorage.removeItem("studentName");
 }
}
