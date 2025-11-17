# SEEN – Build + Release Process

This document defines the workflow for developing, packaging, backing up, and publishing SEEN builds.

---

## 1. Create a New Branch

Start every feature or fix on its own branch.

Commands (run in Terminal):

- git checkout main  
- git pull  
- git checkout -b edit-XX  

Use meaningful branch names:
- edit-welcome-v3  
- print-bugfix  
- pwa-improvements  

---

## 2. Edit and Commit Frequently

While working in VS Code, commit in small steps.

Commands:
- git add .  
- git commit -m "Describe the change"  

Repeat as needed.

---

## 3. Merge Into main

When the feature is ready and tested:

Commands:
- git checkout main  
- git pull  
- git merge edit-XX  

Resolve conflicts if they appear, then run the app to confirm it works.

---

## 4. Push main to GitHub

Command:
- git push  

Now GitHub has your updated source code.

---

## 5. Create a Timestamped Backup ZIP

Before building, create a backup snapshot.

Commands:
- mkdir -p backups  
- zip -r backups/SEEN.\$(date +"%Y-%m-%d_%H%M").zip .  

This ensures you can roll back any build.

---

## 6. Build the Apps

### macOS Build
- npm run dist:mac  

### Windows Build
- npm run dist:win  

Outputs appear in the `dist/` folder:
- SEEN-<version>-arm64.dmg  
- SEEN-Setup-<version>.exe  

Open both apps to confirm they launch correctly.

---

## 7. Draft a New GitHub Release

Steps:
1. Go to GitHub → Releases → Draft a new release  
2. Tag: v0.x.x (matches your app version)  
3. Title: SEEN x.x.x  
4. Add a short description of changes  
5. Upload the DMG and EXE files  
6. Publish the release  

GitHub will generate permanent public download URLs.

---

## 8. Update Landing Page Links

Edit the SEEN website HTML to replace old download URLs with the new ones from the release.

Then commit and push:

- git add .  
- git commit -m "Update download links to v0.x.x"  
- git push  

---

## 9. Final Sanity Check

Test on real machines or VMs:

- Mac: Download → install → open  
- Windows: Download → install → open  
- Browser/PWA: Open web version → confirm behavior  

Ensure everything loads correctly.

---

## 10. Done

The new SEEN version is officially released.
