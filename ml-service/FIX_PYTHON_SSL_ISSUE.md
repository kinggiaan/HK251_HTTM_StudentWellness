# Python SSL Certificate Issue - MSYS64 Environment

## Problem Summary

The ML service cannot install dependencies because MSYS64 Python has SSL certificate verification issues and incompatibility with standard Python wheels from PyPI.

### Error Details

```
ssl.SSLCertVerificationError: [SSL: CERTIFICATE_VERIFY_FAILED] 
certificate verify failed: unable to get local issuer certificate
```

Additionally, MSYS64 Python (compiled with GCC) cannot use pre-built Windows wheels, requiring building from source, which creates circular dependencies (numpy → ninja → cmake → SSL error).

## Root Cause

- **MSYS64 Python** (`C:\msys64\mingw64\bin\python.exe`) is a Unix-like Python compiled with GCC
- It doesn't work well with standard Windows Python wheels from PyPI
- Building packages from source requires cmake/ninja which also fail with SSL errors
- SSL certificate bundle is outdated or incompatible

## Recommended Solutions

### Option 1: Install Standard Windows Python (RECOMMENDED) ⭐

Download and install official Python for Windows:

1. **Download Python 3.10+ for Windows**:
   - Visit: https://www.python.org/downloads/windows/
   - Download "Windows installer (64-bit)" for Python 3.10 or 3.11
   - Example: `python-3.10.11-amd64.exe`

2. **Install Python**:
   ```powershell
   # Run installer with these options:
   # ✅ Add Python to PATH
   # ✅ Install pip
   # ✅ Install for all users (optional)
   ```

3. **Verify Installation**:
   ```powershell
   # Close and reopen PowerShell
   py --version         # Should show Python 3.10.x or 3.11.x
   py -m pip --version  # Should show pip version
   ```

4. **Create Virtual Environment**:
   ```powershell
   cd d:\HCMUT\HTTM\HTTM_Project\ml-service
   
   # Remove old MSYS64 venv
   Remove-Item -Recurse -Force venv
   
   # Create new venv with Windows Python
   py -m venv venv
   
   # Activate
   .\venv\Scripts\Activate.ps1
   
   # Upgrade pip
   python -m pip install --upgrade pip
   
   # Install requirements (should work now!)
   pip install -r requirements.txt
   ```

5. **Start ML Service**:
   ```powershell
   .\venv\Scripts\Activate.ps1
   python main.py
   ```

### Option 2: Use Anaconda/Miniconda (ALTERNATIVE)

If you prefer Anaconda:

1. **Download Miniconda**:
   - Visit: https://docs.conda.io/en/latest/miniconda.html
   - Download Windows 64-bit installer
   - Run installer

2. **Create Environment**:
   ```powershell
   cd d:\HCMUT\HTTM\HTTM_Project\ml-service
   
   conda create -n ml-service python=3.10
   conda activate ml-service
   
   # Install dependencies
   conda install pandas scikit-learn matplotlib numpy
   pip install fastapi uvicorn python-multipart
   
   # Start service
   python main.py
   ```

### Option 3: Use MSYS2 Packages (FOR MSYS64 USERS)

If you must use MSYS64 Python, install packages via MSYS2:

1. **Open MSYS2 Shell** (not PowerShell):
   ```bash
   # Install Python packages via pacman
   pacman -S mingw-w64-x86_64-python-numpy
   pacman -S mingw-w64-x86_64-python-pandas
   pacman -S mingw-w64-x86_64-python-scikit-learn
   pacman -S mingw-w64-x86_64-python-matplotlib
   
   # Install FastAPI with pip (no build required)
   pip install fastapi uvicorn python-multipart
   ```

2. **Run from MSYS2 shell**:
   ```bash
   cd /d/HCMUT/HTTM/HTTM_Project/ml-service
   python main.py
   ```

### Option 4: Docker (CROSS-PLATFORM)

Use Docker to avoid Python environment issues entirely:

1. **Create Dockerfile** (already exists in ml-service):
   ```dockerfile
   FROM python:3.10-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   EXPOSE 8000
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Build and Run**:
   ```powershell
   cd d:\HCMUT\HTTM\HTTM_Project\ml-service
   
   docker build -t ml-service .
   docker run -p 8000:8000 ml-service
   ```

## Why Option 1 is Best

✅ **Standard Windows Python**:
- Pre-built wheels available for all packages
- No compilation required
- No SSL certificate issues
- Best compatibility with Windows
- Official Python.org distribution
- Works with PowerShell seamlessly

❌ **MSYS64 Python**:
- Unix-like environment on Windows
- Requires building from source
- SSL certificate problems
- Incompatible with Windows wheels
- More complex troubleshooting

## Quick Comparison

| Method | Ease | Speed | Compatibility | Recommended |
|--------|------|-------|---------------|-------------|
| **Windows Python** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ **YES** |
| Anaconda | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Alternative |
| MSYS2 Packages | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⚠️ Only if needed |
| Docker | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Production |

## After Installing Dependencies

Once you successfully install dependencies with **any method above**, you can start the ML service:

```powershell
cd d:\HCMUT\HTTM\HTTM_Project\ml-service

# Activate your environment (depends on method chosen)
.\venv\Scripts\Activate.ps1   # For Windows Python
# OR
conda activate ml-service      # For Anaconda

# Start service
python main.py
```

Expected output:
```
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Then test:
```powershell
# Open browser to http://localhost:8000/docs
# Or test with curl
curl http://localhost:8000/presets
```

## Next Steps After ML Service Runs

1. ✅ **Verify ML service**: http://localhost:8000/docs
2. ✅ **Restart Strapi backend** to use corrected ML_SERVICE_URL
3. ✅ **Test Data Scientist Dashboard** at http://localhost:3002
4. ✅ **Check console** - no more 404/500 errors

Refer to `docs/FIX_ML_DASHBOARD_ERRORS.md` for full testing checklist.

## Summary

**Immediate Action Required**: Install official Windows Python from python.org, then recreate the virtual environment. This will resolve all SSL and compatibility issues.

The MSYS64 Python installation is causing the problems and is not suitable for this project's requirements.
