"""Quick test script to verify Strapi API token"""
import os
import requests
from dotenv import load_dotenv

# Load .env
load_dotenv()

STRAPI_URL = os.getenv("STRAPI_URL", "http://localhost:1337")
STRAPI_API_TOKEN = os.getenv("STRAPI_API_TOKEN", "")

print(f"\n{'='*70}")
print(f"🧪 Testing Strapi API Token")
print(f"{'='*70}")
print(f"URL: {STRAPI_URL}")
print(f"Token loaded: {'Yes' if STRAPI_API_TOKEN else 'No'}")
print(f"Token length: {len(STRAPI_API_TOKEN)} chars")
print(f"Token preview: {STRAPI_API_TOKEN[:30]}...{STRAPI_API_TOKEN[-30:]}")
print(f"{'='*70}\n")

# Clean token
clean_token = STRAPI_API_TOKEN.strip()

# Test 1: Without Bearer
print("Test 1: Without 'Bearer' prefix")
headers1 = {
    "Authorization": clean_token,
    "Content-Type": "application/json"
}
try:
    response = requests.get(f"{STRAPI_URL}/api/students?pagination[limit]=1", headers=headers1)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print(f"   ✅ SUCCESS!")
    else:
        print(f"   ❌ Failed: {response.text[:100]}")
except Exception as e:
    print(f"   ❌ Error: {e}")

print()

# Test 2: With Bearer
print("Test 2: With 'Bearer' prefix")
headers2 = {
    "Authorization": f"Bearer {clean_token}",
    "Content-Type": "application/json"
}
try:
    response = requests.get(f"{STRAPI_URL}/api/students?pagination[limit]=1", headers=headers2)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ SUCCESS! Got {len(data.get('data', []))} students")
        if data.get('data'):
            student = data['data'][0]
            print(f"   Sample: {student.get('name')} (ID: {student.get('id')})")
    else:
        print(f"   ❌ Failed: {response.text[:100]}")
except Exception as e:
    print(f"   ❌ Error: {e}")

print()
print("="*70)
