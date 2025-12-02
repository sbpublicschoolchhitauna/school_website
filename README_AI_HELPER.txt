Instructions to install and use the AI Helper (no changes to original index.html required)

Files included:
- index_helpers_merged.html  -> Full page version with helpers merged (can be used as a full replacement for testing)
- index_final.html           -> Final adjusted HTML (alternate)
- ai_helper.js               -> JavaScript file to add helper to existing site without editing original files
- README.txt                 -> This file

Two installation options:
1) Zero-change (quick test)
   - Open your website in browser.
   - Open DevTools Console and paste the contents of ai_helper.js and press Enter.
   - The "Ask Helper" floating button will appear (bottom-right). To remove run: window.__SBPS_REMOVE_HELPER()

2) Persistent (recommended, 1-line change)
   - Upload ai_helper.js to your website root (same folder as index.html).
   - Edit your index.html and add before </body>:
        <script src="ai_helper.js"></script>
   - This will load the helper for all visitors.

Notes:
- The helper reads from your Google Sheets. Sheets must be set to 'Anyone with the link - Viewer'.
- Provided SHEET_ID is already set to the sheet you shared.
- If you want a server-backed AI chat (OpenAI), tell me and I will provide server code (requires API key).
