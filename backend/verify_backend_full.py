import requests
import json
import random
import string

BASE_URL = "http://localhost:8000"

def get_random_string(length=8):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

def verify_backend():
    print("🚀 Starting Backend Verification...")

    # 1. Health Check
    try:
        r = requests.get(f"{BASE_URL}/health")
        if r.status_code != 200:
            print("❌ Backend Health Check Failed")
            return
        print("✅ Backend is Healthy")
    except Exception as e:
        print(f"❌ Backend not reachable: {e}")
        return

    # 2. Register New User
    email = f"test_{get_random_string()}@example.com"
    password = "password123"
    enrollment = f"EN{get_random_string(6).upper()}"
    
    print(f"\n👤 Registering User: {email}")
    r = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email,
        "password": password,
        "enrollment_number": enrollment
    })
    
    if r.status_code != 200:
        print(f"❌ Registration Failed: {r.text}")
        return
    
    token_data = r.json()
    token = token_data.get("access_token")
    if not token:
        print("❌ No access token in response")
        return
    print("✅ Registration Successful. Token acquired.")
    
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Create Post
    print("\n📝 Creating Post...")
    post_data = {
        "title": "Verification Post",
        "content": "Verifying backend logic after refactor.",
        "department": "CS",
        "type": "discussion",
        "tags": "test"
    }
    r = requests.post(f"{BASE_URL}/posts/", json=post_data, headers=headers)
    if r.status_code != 201:
        print(f"❌ Create Post Failed: {r.status_code} {r.text}")
        return
    post = r.json()
    post_id = post["id"]
    print(f"✅ Post Created: ID {post_id}")

    # 4. Create Comment
    print("\n💬 Creating Comment...")
    comment_data = {
        "content": "This is a test comment."
    }
    r = requests.post(f"{BASE_URL}/posts/{post_id}/comments/", json=comment_data, headers=headers)
    
    if r.status_code == 307: # Temporary Redirect? weird for API
         r = requests.post(f"{BASE_URL}/posts/{post_id}/comments", json=comment_data, headers=headers)

    if r.status_code != 201:
        print(f"❌ Create Comment Failed: {r.status_code} {r.text}")
        return
    comment = r.json()
    print(f"✅ Comment Created: ID {comment['id']}")

    # 5. Get Comments
    print("\n🔍 Fetching Comments...")
    r = requests.get(f"{BASE_URL}/posts/{post_id}/comments/")
    if r.status_code != 200:
        print(f"❌ Get Comments Failed: {r.status_code} {r.text}")
        return
    comments = r.json()
    print(f"✅ Comments Fetched: Found {len(comments)}")
    
    print("\n🎉 ALL CHECKS PASSED. Backend is fully functional.")

if __name__ == "__main__":
    verify_backend()
