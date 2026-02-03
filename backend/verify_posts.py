import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def test_api():
    print("Testing API...")
    
    # 1. Health Check
    try:
        r = requests.get(f"{BASE_URL}/health")
        if r.status_code != 200:
            print("Backend not healthy")
            return
        print("Backend is healthy")
    except Exception as e:
        print(f"Backend not reachable: {e}")
        return

    # 2. Create Post
    post_data = {
        "title": "Test Post",
        "content": "This is a test post content.",
        "department": "cs",
        "type": "discussion",
        "tags": "test, api"
    }
    
    print("\nCreating post...")
    r = requests.post(f"{BASE_URL}/posts/", json=post_data)
    if r.status_code == 201:
        print("Post created successfully!")
        print(json.dumps(r.json(), indent=2))
    else:
        print(f"Failed to create post: {r.status_code} {r.text}")
        return

    # 3. Get Posts
    print("\nFetching posts...")
    r = requests.get(f"{BASE_URL}/posts/")
    if r.status_code == 200:
        posts = r.json()
        print(f"Found {len(posts)} posts")
        print(json.dumps(posts, indent=2))
    else:
        print(f"Failed to get posts: {r.status_code} {r.text}")

if __name__ == "__main__":
    test_api()
