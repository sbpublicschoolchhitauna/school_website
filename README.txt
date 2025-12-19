SBPSC FINAL PWA ZIP (100% FREE)

STEP 1:
इस ZIP के सारे files को
GitHub repo में upload करें
जहाँ index.html है

STEP 2:
index.html में <head> के अंदर जोड़ें:

<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#0b5fa8">

STEP 3:
</body> से पहले जोड़ें:

<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').then(r=>r.update());
}
</script>

STEP 4 (IMPORTANT):
Mobile में:
- Old App uninstall करें
- Chrome → Clear Cache
- Website खोलें
- Install App करें

अब App हर बार खुलेगा + auto update होगा
