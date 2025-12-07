/***** Apps Script: admin-auth-and-actions.js *****
 * Deploy as Web App (doPost used for API)
 * IMPORTANT: Set the ADMIN_PASSWORD in Script Properties (Project Settings > Script properties)
 *   Key: ADMIN_PASSWORD
 *   Value: SBPSC@9044  (or change to a stronger password)
 *
 * Deploy as: Execute as: Me (owner); Who has access: Anyone (or Anyone with link)
 **************************************************/

const ADMIN_PASSWORD_PROP = "ADMIN_PASSWORD";

function getAdminPassword() {
  const p = PropertiesService.getScriptProperties().getProperty(ADMIN_PASSWORD_PROP);
  if (p) return p;
  // fallback (only for quick setup). Remove this fallback for better security.
  return "SBPSC@9044";
}

function createToken(ttlMinutes) {
  const token = Utilities.getUuid();
  const expires = Date.now() + (ttlMinutes || 60) * 60 * 1000;
  const obj = { expires: expires };
  PropertiesService.getScriptProperties().setProperty("adminToken:" + token, JSON.stringify(obj));
  return { token: token, expires: expires };
}

function validateToken(token) {
  if (!token) return false;
  const raw = PropertiesService.getScriptProperties().getProperty("adminToken:" + token);
  if (!raw) return false;
  try {
    const obj = JSON.parse(raw);
    if (obj.expires && Date.now() < obj.expires) return true;
  } catch (e) {}
  return false;
}

function revokeToken(token){
  if(!token) return;
  PropertiesService.getScriptProperties().deleteProperty("adminToken:" + token);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e){
  try{
    const body = e.postData && e.postData.type === 'application/json' ? JSON.parse(e.postData.contents) : (e.parameter || {});
    const action = (body.action || "").toString();

    if(action === "login"){
      const pass = (body.password || "").toString();
      if(pass === getAdminPassword()){
        const t = createToken(180); // token valid for 180 minutes (3 hours)
        return jsonResponse({ ok: true, token: t.token, expires: t.expires });
      } else {
        return jsonResponse({ ok: false, error: "invalid_password" });
      }
    }

    const token = (body.token || "").toString();
    if(!validateToken(token)){
      return jsonResponse({ ok: false, error: "invalid_or_expired_token" });
    }

    if(action === "markPresent"){
      const sheetId = body.sheetId;
      const admissionNo = body.admissionNo || "";
      const dateStr = body.date || new Date().toLocaleDateString();
      const status = body.status || "Present";
      if(!sheetId) return jsonResponse({ ok:false, error:"missing_sheetId" });

      const ss = SpreadsheetApp.openById(sheetId);
      const sh = ss.getSheetByName("Attendance") || ss.insertSheet("Attendance");
      if(sh.getLastRow() === 0) sh.appendRow(["Timestamp","AdmissionNo","Date","Status","By"]);
      sh.appendRow([new Date(), admissionNo, dateStr, status, "teacher"]);
      return jsonResponse({ ok:true, message:"marked" });
    }

    if(action === "updateFee"){
      const sheetId = body.sheetId;
      const rowIndex = Number(body.rowIndex);
      const colIndex = Number(body.colIndex);
      const value = body.value;
      if(!sheetId || !rowIndex || !colIndex) return jsonResponse({ ok:false, error:"missing_params" });
      const ss = SpreadsheetApp.openById(sheetId);
      const sh = ss.getSheetByName("Fee Student Details");
      if(!sh) return jsonResponse({ ok:false, error:"no_sheet" });
      sh.getRange(rowIndex, colIndex).setValue(value);
      return jsonResponse({ ok:true, message:"updated" });
    }

    if(action === "logout"){
      revokeToken(token);
      return jsonResponse({ ok:true, message:"logged_out" });
    }

    return jsonResponse({ ok:false, error:"unknown_action" });

  }catch(err){
    return jsonResponse({ ok:false, error: err.toString() });
  }
}