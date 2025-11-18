# SB Public School — GitHub Pages Ready Website

इस फ़ोल्डर/ZIP में आपकी static वेबसाइट है जिसे आप सीधे **GitHub Pages** पर host कर सकते हैं.

## क्या है ZIP में
- `index.html` — मुख्य पेज (auto image slider included)
- `images/` — आपकी सभी uploaded images
- `.nojekyll` — GitHub Pages को बताने के लिए कि Jekyll को disable रखें
- `README.md` — यही instruction file

## GitHub Pages पर publish करने के steps (सबसे आसान तरीका)
1. GitHub पर एक नया repository बनाएं, नाम कुछ भी रख सकते हैं (उदाहरण: `sb-public-school`).
2. अपने कंप्यूटर पर terminal खोलें और नीचे commands चलाएँ (replace values where needed):
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   # ZIP खोलकर अंदर की files (index.html, images/, .nojekyll) copy करें इस फोल्डर में
   git add .
   git commit -m "Initial website upload"
   git push origin main
   ```
3. GitHub repository में जाएँ → Settings → Pages (या "Pages" tab) → Branch चुनें (`main` या `gh-pages`) और `Save` दबाएँ।
4. कुछ मिनट के बाद आपकी साइट लाइव हो जाएगी: `https://<your-username>.github.io/<repo-name>/`

## Direct Upload (GUI तरीका)
- GitHub repo में "Add file" → "Upload files" से भी आप ZIP के अंदर की files upload कर सकते हैं, फिर Commit करें और Pages सेट करें।

## नोट्स
- अगर आप repository name को `<your-username>.github.io` रखते हैं (exact match), तो site root पर serve होगा: `https://<your-username>.github.io/`.
- `.nojekyll` फाइल होने से GitHub Pages Jekyll processing skip करेगा और assets ठीक से दिखेंगे.
- अगर आप चाहता/चाहती हैं, तो मैं सीधे आपके लिए repository में commit करने में मदद कर सकता/सकती हूँ — पर उसके लिए मुझे GitHub access नहीं है। इसलिए आपको credentials देने की जरूरत पड़ेगी, या आप मैन्युअल रूप से upload करें।

## मदद चाहिए?
मुझे बताइए — मैं step-by-step screenshots के साथ guide कर दूँगा या ज़रूरत लगे तो ZIP को और refine करके भेज दूँगा.
