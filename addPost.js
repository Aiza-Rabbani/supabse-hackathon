import supabase from "./config.js";

const postForm = document.getElementById("postForm");
const postTitle = document.getElementById("postTitle");
const postContent = document.getElementById("postContent");
const postCategory = document.getElementById("postCategory");
const postImage = document.getElementById("postImage");

async function uploadFile(file) {
  if (!file) return ""; 
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

async function addPost(e) {
  e.preventDefault();

  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) return alert("Please login first!");

  const file = postImage.files[0];
  const imageUrl = await uploadFile(file);

  const { error } = await supabase.from("posts").insert({
    title: postTitle.value.trim(),
    content: postContent.value.trim(),
    category: postCategory.value.trim(),
    imageUrl: imageUrl,
    user_id: user.id,
    created_at: new Date().toISOString()
  });

  if (error) {
    console.log(error);
    return alert("Failed to add post: " + error.message);
  }

  postForm.reset();
  alert("Post added successfully!");
  location.href = "./index.html"; 
}

postForm.addEventListener("submit", addPost);
