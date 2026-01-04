import supabase from "./config.js";

// ------------------- DOM Elements -------------------
const postForm = document.getElementById("postForm");
const postTitle = document.getElementById("postTitle");
const postContent = document.getElementById("postContent");
const postCategory = document.getElementById("postCategory");
const postImage = document.getElementById("postImage");
const postsContainer = document.getElementById("postsContainer");

// Track which post is being edited
let editingPostId = null;

// ------------------- Upload Image -------------------
async function uploadFile(file) {
  if (!file) return ""; // optional image

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from("posts").upload(fileName, file);

  if (error) {
    console.log("Upload error:", error);
    alert("Failed to upload image");
    return "";
  }

  const { data: urlData } = supabase.storage.from("posts").getPublicUrl(data.path);
return urlData.publicUrl;

}

// ------------------- Fetch & Render Posts -------------------
async function fetchPosts() {
  const { data, error } = await supabase.from("posts").select("*").order("id", { ascending: false });

  if (error) {
    console.log("Error fetching posts:", error);
    postsContainer.innerHTML = "<p>Error loading posts.</p>";
    return;
  }

  renderPosts(data);
}

function renderPosts(posts) {
  if (!posts.length) {
    postsContainer.innerHTML = "<p>No posts found.</p>";
    return;
  }

  postsContainer.innerHTML = posts
    .map(post => `
      <div class="col-md-4 mb-4">
        <div class="card">
          ${post.imageUrl ? `<img src="${post.imageUrl}" class="card-img-top" alt="Post Image">` : ""}
          <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.content}</p>
            <p><small class="text-muted">Category: ${post.category || "None"}</small></p>
            <button class="btn btn-sm btn-warning edit-btn" data-id="${post.id}">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${post.id}">Delete</button>
          </div>
        </div>
      </div>
    `)
    .join("");

  // Attach Edit & Delete button listeners
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => editPost(btn.dataset.id));
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => deletePost(btn.dataset.id));
  });
}

// ------------------- Add / Update Post -------------------
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = postTitle.value.trim();
  const content = postContent.value.trim();
  const category = postCategory.value.trim();
  const file = postImage.files[0];
  const imageUrl = await uploadFile(file);

  if (!title || !content) {
    alert("Title and content are required");
    return;
  }

  try {
    if (editingPostId) {
      // Update existing post
      const { error } = await supabase.from("posts")
        .update({ title, content, category, ...(imageUrl && { imageUrl }) })
        .eq("id", editingPostId);

      if (error) throw error;

      alert("Post updated successfully!");
      editingPostId = null; // reset
    } else {
      // Add new post
      const { error } = await supabase.from("posts").insert({
        title, content, category, imageUrl, created_at: new Date().toISOString()
      });

      if (error) throw error;

      alert("Post added successfully!");
    }

    postForm.reset();
    fetchPosts(); // refresh list
  } catch (err) {
    console.log(err);
    alert("Error saving post: " + err.message);
  }
});

// ------------------- Edit Post -------------------
async function editPost(postId) {
  const { data, error } = await supabase.from("posts").select("*").eq("id", postId).single();

  if (error) {
    console.log(error);
    alert("Failed to fetch post for editing");
    return;
  }

  postTitle.value = data.title;
  postContent.value = data.content;
  postCategory.value = data.category;
  editingPostId = postId;
}

async function deletePost(postId) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    console.log(error);
    alert("Failed to delete post");
    return;
  }

  alert("Post deleted successfully!");
  fetchPosts();
}

fetchPosts();
