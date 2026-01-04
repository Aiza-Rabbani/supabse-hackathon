import supabase from "./config.js";

const postsContainer = document.getElementById("postsContainer");
const filterInput = document.getElementById("filterCategory");

let currentUser = null;

async function init() {
  const { data } = await supabase.auth.getUser();
  currentUser = data.user;
  fetchPosts(); 
}

init();

async function fetchPosts(category = "") {
  let query = supabase.from("posts").select("*").order("created_at", { ascending: false });

  if (category.trim() !== "") {
    query = query.ilike("category", `%${category}%`); // Filter by category
  }

  const { data, error } = await query;

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
    .map((post) => {
      const canEdit = currentUser && currentUser.id === post.user_id; // Only show edit/delete for owner
      return `
        <div class="col-md-4 mb-4">
          <div class="card">
            ${post.imageUrl ? `<img src="${post.imageUrl}" class="card-img-top" alt="Post Image">` : ""}
            <div class="card-body">
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text">${post.content}</p>
              <p><small class="text-muted">Category: ${post.category}</small></p>
              <button class="btn btn-sm btn-info view-btn" data-id="${post.id}">View Details</button>
              ${canEdit ? `
                <button class="btn btn-sm btn-warning edit-btn" data-id="${post.id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${post.id}">Delete</button>
              ` : ""}
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  attachPostButtons(); 
}

function attachPostButtons() {
  const viewButtons = document.querySelectorAll(".view-btn");
  viewButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      location.href = `postDetail.html?id=${id}`;
    });
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const postId = e.target.dataset.id;
      if (confirm("Are you sure you want to delete this post?")) {
        const { error } = await supabase.from("posts").delete().eq("id", postId);
        if (error) {
          alert("Failed to delete post: " + error.message);
        } else {
          alert("Post deleted successfully!");
          fetchPosts(filterInput.value); 
        }
      }
    });
  });

  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const postId = e.target.dataset.id;

      location.href = `addPost.html?id=${postId}`;
    });
  });
}

// Filter posts by category on input
filterInput.addEventListener("input", (e) => fetchPosts(e.target.value));
