# 🐛 Troubleshooting Guide

## 🚨 Common Issues

---

## 1. Port Already in Use

### Problem
```
Error: listen EADDRINUSE: address already in use :::3000
```

### Solution (Windows PowerShell)

**Check what's using the port:**
```powershell
netstat -ano | findstr :3000
```

**Kill the process:**
```powershell
# Find the PID from netstat output, then:
Stop-Process -Id <PID> -Force
```

**Kill all Node processes:**
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
```

**Common ports to check:**
- Frontend: `3000`
- Backend: `1337`
- ML Service: `5000`
- PostgreSQL: `5432`
- Redis: `6379`

---

## 2. Docker Issues

### Problem: Docker containers not starting

**Check Docker status:**
```powershell
docker ps -a
```

**Restart Docker Desktop:**
1. Close Docker Desktop completely
2. Open Task Manager (`Ctrl + Shift + Esc`)
3. End all Docker processes
4. Restart Docker Desktop

**Remove and recreate containers:**
```powershell
docker-compose down
docker-compose up -d
```

**Check container logs:**
```powershell
docker logs <container_name>
```

### Problem: PostgreSQL container fails

**Error**: `password authentication failed for user "strapi"`

**Solution:**
1. Stop all containers:
   ```powershell
   docker-compose down -v
   ```
2. Delete volumes (⚠️ This will delete all data):
   ```powershell
   docker volume prune
   ```
3. Recreate containers:
   ```powershell
   docker-compose up -d
   ```

---

## 3. Node Modules Issues

### Problem: Module not found errors

**Delete and reinstall:**
```powershell
# In frontend or backend directory
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Problem: Dependency conflicts

**Clear npm cache:**
```powershell
npm cache clean --force
npm install
```

**Try with legacy peer deps:**
```powershell
npm install --legacy-peer-deps
```

---

## 4. Database Connection Issues

### Problem: Cannot connect to PostgreSQL

**Check if PostgreSQL is running:**
```powershell
docker ps | findstr postgres
```

**Check connection in backend/.env:**
```env
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
```

**Test connection manually:**
```powershell
# Install PostgreSQL client if needed
psql -h localhost -p 5432 -U strapi -d strapi
# Password: strapi
```

**Restart PostgreSQL container:**
```powershell
docker restart <postgres_container_name>
```

---

## 5. Frontend Build Issues

### Problem: Vite build fails

**Clear Vite cache:**
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules\.vite
Remove-Item -Recurse -Force dist
npm run dev
```

### Problem: TypeScript errors

**Regenerate types:**
```powershell
npm run build
```

**Check TypeScript version:**
```powershell
npm list typescript
```

---

## 6. Backend/Strapi Issues

### Problem: Strapi admin panel not loading

**Rebuild admin:**
```powershell
cd backend
npm run build
npm run develop
```

**Clear Strapi cache:**
```powershell
Remove-Item -Recurse -Force .cache
Remove-Item -Recurse -Force build
npm run build
```

### Problem: Permission denied errors

**Check user roles in admin panel:**
1. Go to `http://localhost:1337/admin`
2. Settings → Users & Permissions Plugin → Roles
3. Verify permissions for your role

---

## 7. ML Service Issues

### Problem: Python virtual environment issues

**Recreate virtual environment:**
```powershell
cd ml-service
Remove-Item -Recurse -Force venv
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Problem: Model not found

**Check model file exists:**
```powershell
Test-Path "ml-service/models/student_risk_model.pkl"
```

**Retrain model:**
```powershell
cd ml-service
python src/train.py
```

---

## 8. Authentication Issues

### Problem: JWT token expired

**Solution**: Login again to get new token

**Check token expiration in backend/config/plugins.ts:**
```typescript
'users-permissions': {
  config: {
    jwt: {
      expiresIn: '7d'  // Token expires in 7 days
    }
  }
}
```

### Problem: Cannot login

**Reset admin password:**
```powershell
cd backend
npm run strapi admin:reset-user-password -- --email=admin@example.com --password=NewPassword123
```

---

## 9. Hot Reload Not Working

### Problem: Code changes not reflected in browser

**Solution 1: Clear browser cache**
- Press `Ctrl + Shift + R` (hard refresh)
- Or open DevTools (`F12`) → Network tab → Check "Disable cache"

**Solution 2: Clear Vite cache**
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules\.vite
npm run dev
```

**Solution 3: Open in Incognito mode**
- Press `Ctrl + Shift + N`
- Navigate to `http://localhost:3000`

**Solution 4: Check if dev server is running from correct directory**
```powershell
# Must run from frontend directory, not root
cd frontend
npm run dev
```

**Solution 5: Restart dev server**
```powershell
# Kill all Node processes
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Restart dev server
cd frontend
npm run dev
```

---

## 10. Git Issues

### Problem: Merge conflicts

**View conflicts:**
```powershell
git status
```

**Abort merge:**
```powershell
git merge --abort
```

**Resolve conflicts manually:**
1. Open conflicted files
2. Look for conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`
3. Edit to keep desired changes
4. Remove conflict markers
5. Save file
6. Stage resolved files:
   ```powershell
   git add <file>
   ```
7. Continue merge:
   ```powershell
   git commit
   ```

### Problem: Need to undo changes

**Discard uncommitted changes:**
```powershell
git restore <file>
# Or all files:
git restore .
```

**Undo last commit (keep changes):**
```powershell
git reset --soft HEAD~1
```

**Undo last commit (discard changes):**
```powershell
git reset --hard HEAD~1
```

---

## 11. Performance Issues

### Problem: Slow startup time

**Possible causes:**
- Too many dependencies
- Large node_modules folder
- Docker using too much memory

**Solutions:**

**1. Increase Docker memory:**
- Docker Desktop → Settings → Resources
- Increase Memory to 4GB+

**2. Clear caches:**
```powershell
# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules\.vite
Remove-Item -Recurse -Force dist

# Backend
cd backend
Remove-Item -Recurse -Force .cache
Remove-Item -Recurse -Force build
```

**3. Optimize imports:**
- Use specific imports instead of wildcard imports
- Remove unused dependencies

---

## 12. Playwright Test Failures

### Problem: Tests failing

**Check if services are running:**
```powershell
# Check frontend
curl http://localhost:3000

# Check backend
curl http://localhost:1337/api
```

**Run tests in UI mode:**
```powershell
npx playwright test --ui
```

**Run specific test:**
```powershell
npx playwright test login-and-dashboard.spec.ts
```

**Update browsers:**
```powershell
npx playwright install
```

---

## 13. Environment Variables

### Problem: Environment variables not loaded

**Check .env file exists:**
```powershell
Test-Path "backend\.env"
```

**Copy from example:**
```powershell
Copy-Item "backend\.env.example" "backend\.env"
```

**Verify variables in .env:**
```env
# Required variables:
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
JWT_SECRET=<your_secret>
API_TOKEN_SALT=<your_salt>
ADMIN_JWT_SECRET=<your_admin_secret>
APP_KEYS=<your_app_keys>
```

**Generate secrets:**
```powershell
# In backend directory
npm run strapi generate
```

---

## 14. CORS Issues

### Problem: CORS error in browser console

**Check backend/config/middlewares.ts:**
```typescript
export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'http:', 'https:'],
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:3000'],  // Add your frontend URL
      credentials: true,
    },
  },
  // ...
];
```

---

## 🔍 Debugging Tips

### 1. Check Logs

**Frontend logs:**
- Open browser DevTools (`F12`)
- Check Console tab for errors

**Backend logs:**
- Check terminal where `npm start` is running
- Look for error stack traces

**Docker logs:**
```powershell
docker logs <container_name>
```

### 2. Network Tab

- Open DevTools → Network tab
- Check if API requests are succeeding
- Look for 4xx or 5xx status codes

### 3. Add Console Logs

**In React components:**
```typescript
console.log('Component mounted');
console.log('Props:', props);
console.log('State:', state);
```

**In API calls:**
```typescript
try {
  const response = await api.get('/endpoint');
  console.log('Response:', response.data);
} catch (error) {
  console.error('Error:', error);
}
```

### 4. Use React DevTools

1. Install React DevTools extension
2. Open DevTools → Components tab
3. Inspect component props and state

---

## 🆘 Getting Help

If you're still stuck:

1. **Check existing issues**: Look in the project's issue tracker
2. **Ask team members**: Reach out on team communication channels
3. **Search documentation**: Check all docs in `/docs` folder
4. **Create detailed issue**:
   - Describe the problem
   - Include error messages
   - List steps to reproduce
   - Mention your environment (OS, Node version, etc.)

---

## 📚 Related Documentation

- [Quick Start](./QUICKSTART.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)
- [FAQ](./FAQ.md)
