"""
Script to create a new Strapi API token for ML Service
This will use Strapi admin API to create a token with full access
"""

import requests
import json

# Strapi admin credentials
STRAPI_URL = "http://localhost:1337"
ADMIN_EMAIL = "huynhducnham@gmail.com"  # Change this to your admin email
ADMIN_PASSWORD = "Nham12345@@"   # Change this to your admin password

def login_admin():
    """Login as admin and get JWT token"""
    print("🔐 Logging in as admin...")
    response = requests.post(
        f"{STRAPI_URL}/admin/login",
        json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        token = data.get("data", {}).get("token")
        print("✅ Admin login successful!")
        return token
    else:
        print(f"❌ Login failed: {response.status_code}")
        print(response.text)
        return None

def create_api_token(admin_token):
    """Create a new API token with full access"""
    print("\n📝 Creating new API token...")
    
    headers = {
        "Authorization": f"Bearer {admin_token}",
        "Content-Type": "application/json"
    }
    
    # Create token with full access
    response = requests.post(
        f"{STRAPI_URL}/admin/api-tokens",
        headers=headers,
        json={
            "name": "ML Service Token - Auto Generated",
            "description": "Token for ML Service to predict and update students",
            "type": "full-access",  # full-access gives all permissions
            "lifespan": None  # unlimited
        }
    )
    
    if response.status_code in [200, 201]:
        data = response.json()
        # The actual token is only returned once during creation
        token = data.get("data", {}).get("accessKey")
        print("✅ API token created successfully!")
        print(f"\n{'='*70}")
        print("📋 Copy this token to your .env file:")
        print(f"{'='*70}")
        print(f"STRAPI_API_TOKEN={token}")
        print(f"{'='*70}\n")
        
        # Save to .env file
        save_to_env(token)
        return token
    else:
        print(f"❌ Failed to create token: {response.status_code}")
        print(response.text)
        return None

def save_to_env(token):
    """Update .env file with new token"""
    import os
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    
    try:
        # Read current .env
        with open(env_path, 'r') as f:
            lines = f.readlines()
        
        # Update token line
        updated = False
        for i, line in enumerate(lines):
            if line.startswith('STRAPI_API_TOKEN='):
                lines[i] = f'STRAPI_API_TOKEN={token}\n'
                updated = True
                break
        
        # Write back
        if updated:
            with open(env_path, 'w') as f:
                f.writelines(lines)
            print(f"✅ Updated .env file: {env_path}")
        else:
            print(f"⚠️  Could not find STRAPI_API_TOKEN line in .env")
            
    except Exception as e:
        print(f"⚠️  Could not update .env file: {e}")
        print("Please update manually")

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🚀 Strapi API Token Generator for ML Service")
    print("="*70)
    
    # Step 1: Login as admin
    admin_token = login_admin()
    if not admin_token:
        print("\n❌ Failed to login. Please check your admin credentials.")
        exit(1)
    
    # Step 2: Create API token
    api_token = create_api_token(admin_token)
    if not api_token:
        print("\n❌ Failed to create API token.")
        exit(1)
    
    print("\n✨ Done! Restart ML service to use the new token:")
    print("   python main.py")
    print()
