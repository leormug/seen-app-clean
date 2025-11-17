# SEEN – Quick Release Checklist

This is the short version of the build + release workflow.  
Follow these steps in order for every new version.

---

## 1. Create branch
- git checkout main  
- git pull  
- git checkout -b edit-XX  

---

## 2. Edit + commit
- Make changes  
- git add .  
- git commit -m "Message"  

---

## 3. Merge into main
- git checkout main  
- git pull  
- git merge edit-XX  
- Test locally  

---

## 4. Push main
- git push  

---

## 5. Backup
- mkdir -p backups  
- zip -r backups/SEEN.\$(date +"%Y-%m-%d_%H%M").zip .  

---

## 6. Build
- npm run dist:mac  
- npm run dist:win  

Verify both outputs in `dist/`.

---

## 7. Publish GitHub Release
- Go to Releases → Draft new release  
- Tag: vX.X.X  
- Title: SEEN X.X.X  
- Upload DMG + EXE  
- Publish  

---

## 8. Update website links
- Replace old download URLs  
- git add .  
- git commit -m "Update links"  
- git push  

---

## 9. Final tests
- Install Mac build  
- Install Windows build  
- Test PWA version  

---

## 10. Done
Release is complete.
