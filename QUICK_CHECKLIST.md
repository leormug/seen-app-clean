# SEEN – Quick Release Checklist

This is the short version of the build + release workflow.  
Follow these steps in order for every new version.

---

## 1. Create branch
- git checkout main  
- git pull  
- git checkout -b edit-XX  

---

## 2. Update version
- npm version patch|minor|major  
- (Optional) npm version scripts update other files  

---

## 3. Edit + commit
- Make changes  
- git add .  
- git commit -m "Message"  

---

## 4. Merge into main
- git checkout main  
- git pull  
- git merge edit-XX  
- Test locally  

---

## 5. Push main
- git push  

---

## 6. Backup
- mkdir -p backups  
- VERSION=$(npm pkg get version | tr -d \")  
- zip -r "backups/SEEN-${VERSION}.$(date +"%Y-%m-%d_%H%M").zip" .  

---

## 7. Build
- npm run dist:mac  
- npm run dist:win  
- Ensure `GH_TOKEN` is set so electron-builder can upload auto-update assets.

Verify both outputs in `dist/`.

---

## 8. Publish GitHub Release
- Go to Releases → Draft new release  
- Tag: vX.X.X  
- Title: SEEN X.X.X  
- Upload DMG + EXE  
- Publish  

---

## 9. Update website links
- Replace old download URLs (see `WEBSITE_UPDATE.md` for snippet)  
- git add .  
- git commit -m "Update links"  
- git push  

---

## 10. Final tests
- Install Mac build  
- Install Windows build  
- Test PWA version  

---

## 11. Done
Release is complete.
