import supabase from "./config.js";



async function setupNavbar() {
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const signupLink = document.getElementById("signupLink");
  const loginLink = document.getElementById("loginLink");
  const profileDropdown = document.getElementById("profileDropdown");

  if (user) {
    // Hide Signup/Login
    signupLink.style.display = "none";
    loginLink.style.display = "none";

    // Show Profile Dropdown
    profileDropdown.style.display = "block";
  } else {
    signupLink.style.display = "block";
    loginLink.style.display = "block";
    profileDropdown.style.display = "none";
  }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const { error } = await supabase.auth.signOut();
      if (!error) location.reload();
    });
  }
}

setupNavbar();


const regForm = document.getElementById("regForm");
if (regForm) {
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("username").value.trim();
    const contact = document.getElementById("userContact").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) return alert("Email and password are required!");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { Name: name, phone: contact, role: "user" },
      },
    });

    if (error) return alert("Signup failed: " + error.message);

    alert("Signup successful! You can now login.");
    regForm.reset();
    location.href = "./login.html";
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) return alert("Email and password are required!");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert("Login failed: " + error.message);

    alert("Login successful!");
    loginForm.reset();
    location.href = "./index.html"; 
  });
}

const logoutBtn = document.getElementById("logBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (!error) alert("Logout successful!");
  });
}
