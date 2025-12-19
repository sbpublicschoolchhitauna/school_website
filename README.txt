
SBPSC FREE PWA SETUP

1. Upload all files to the same folder as index.html
2. Add below lines inside <head> of index.html:

<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#0b5fa8">

3. Add this before </body>:

<script>
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
</script>

4. Open website in Chrome → Install App

100% FREE – No Play Store – Auto Update Enabled
