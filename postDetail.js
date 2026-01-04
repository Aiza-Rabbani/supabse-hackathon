import supabase from "./config.js";

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

const container = document.getElementById("postDetailContainer");

async function fetchPost() {
  if (!postId) return container.innerHTML = "<p>No post selected.</p>";

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error) {
    console.log(error);
    container.innerHTML = "<p>Failed to load post.</p>";
    return;
  }

  renderPost(data);
}

function renderPost(post) {
  container.innerHTML = `
    <div class="card">
      ${post.imageUrl ? `<img src="${post.imageUrl}" class="card-img-top" alt="Post Image">` : ""}
      <div class="card-body">
        <h3 class="card-title">${post.title}</h3>
        <p class="card-text">${post.content}</p>
        <p><small class="text-muted">Category: ${post.category}</small></p>
      </div>
    </div>
  `;
}

fetchPost();
