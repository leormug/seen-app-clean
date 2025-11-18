# SEEN – Website Download Update

Use this guide whenever you publish a new desktop build so the public download buttons always point at the latest GitHub Release assets.

---

## 1. Collect the Inputs

1. Confirm the version that just shipped:  
   ```bash
   npm pkg get version
   ```
   Example response: `"0.4.4"`
2. Open the newly published GitHub Release in `leormug/seen-app-clean`.
3. Copy the direct download URLs for:
   - `SEEN-Setup-<version>.exe`
   - `SEEN-<version>-<arch>.dmg` (Intel builds are `x64`, Apple Silicon are `arm64`)

---

## 2. Paste the Snippet

Replace the download section on the marketing site (or wherever you host the buttons) with the snippet below, updating the placeholders with the version and the URLs you copied in step 1.

```html
<div class="seen-downloads">
  <a class="button mac"
     href="https://github.com/leormug/seen-app-clean/releases/download/v0.4.4/SEEN-0.4.4-arm64.dmg">
    Download for macOS
  </a>

  <a class="button windows"
     href="https://github.com/leormug/seen-app-clean/releases/download/v0.4.4/SEEN-Setup-0.4.4.exe">
    Download for Windows
  </a>
</div>
```

Tips:

- Duplicate the macOS line if you host separate Intel and Apple Silicon installers.
- Keep the GitHub tag (`v0.4.4` in the example) in sync with the filename.
- If you use Markdown instead of HTML, convert the anchors to `[Download](URL)` format.

---

## 3. Publish the Site

1. Commit the HTML/Markdown change in the website repo.
2. Deploy or publish the site as you normally do.

Existing desktop users now receive in-app auto-update prompts, and new users download the correct installers from the website.  
Repeat this process for every release so both flows stay aligned.
