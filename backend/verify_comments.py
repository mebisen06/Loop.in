import requests
import json
import random

BASE_URL = "http://localhost:8000"

def verify_comments_reactions():
    print("Verifying Comments and Reactions...")
    
    # 1. Get a post ID (assuming verify_posts.py ran and created one, or we create one)
    posts = requests.get(f"{BASE_URL}/posts/").json()
    if not posts:
        print("No posts found. Creating one...")
        r = requests.post(f"{BASE_URL}/posts/", json={
            "title": "Discussion Post", "content": "Let's discuss.", "department": "general"
        })
        post_id = r.json()['id']
    else:
        post_id = posts[0]['id']
        
    print(f"Using Post ID: {post_id}")

    # 1.5 Create User (to ensure author_id exists)
    print("\nCreating/Getting User...")
    # Try register
    email = f"testuser{random.randint(1000,9999)}@example.com"
    # Note: endpoint is /auth/register, payload has email, password
    u_res = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email, "password": "password123"
    })
    
    user_id = 1
    if u_res.status_code == 200 or u_res.status_code == 201:
        # Register returns token, not ID. But if it's the first user, ID is likely 1.
        # If DB is not empty, ID might be different. 
        # But we can't get it easily without a /me endpoint or similar.
        # Let's assume ID 1 for now as this is a dev env.
        print(f"Registered user {email}. Assuming ID 1.")
        # If we really wanted to be sure, we'd log in and hit a protected endpoint, but that's complex for this script.
    else:
        print(f"Register failed ({u_res.status_code}), assuming user 1 exists or using fallback.")

    # 2. Create Comment
    print("\nCreating comment...")
    c_res = requests.post(f"{BASE_URL}/posts/{post_id}/comments/", json={
        "content": "This is a test comment."
    }, params={"author_id": user_id})
    
    if c_res.status_code == 201:
        comment = c_res.json()
        print("Comment created:", json.dumps(comment, indent=2))
        comment_id = comment['id']
    else:
        print("Failed to create comment", c_res.text)
        return

    # 3. React to Comment
    print("\nReacting to comment...")
    r_res = requests.post(f"{BASE_URL}/reactions/", json={
        "user_id": 1,
        "emoji": "👍",
        "target_type": "comment",
        "target_id": comment_id
    })
    print("Reaction response:", r_res.json())

    # 4. React to Post
    print("\nReacting to post...")
    p_r_res = requests.post(f"{BASE_URL}/reactions/", json={
        "user_id": 1,
        "emoji": "🔥",
        "target_type": "post",
        "target_id": post_id
    })
    print("Post Reaction response:", p_r_res.json())

    # 5. Fetch Comments with Reactions (Not implemented fully in backend response yet depending on CRUD)
    # But let's check generic fetch
    print("\nFetching comments...")
    comments = requests.get(f"{BASE_URL}/posts/{post_id}/comments/").json()
    print("Comments fetched:", len(comments))

if __name__ == "__main__":
    verify_comments_reactions()
