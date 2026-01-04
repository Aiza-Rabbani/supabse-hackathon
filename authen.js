// authen.js
import supabase from "./config.js";

let regForm = document.getElementById("regFrom");
let semail = document.getElementById("exampleInputEmail1");
let spassword = document.getElementById("exampleInputPassword1");
let sname = document.getElementById("username");
let scontact = document.getElementById("usercontact");

async function signup(e) {
  e.preventDefault();

  if (!semail.value || !spassword.value) {
    alert("Email and password required");
    return;
  }

  try {
    // 1️⃣ Signup in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: semail.value,
      password: spassword.value,
      options: {
        data: {
          Name: sname.value,
          phone: scontact.value,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    // 2️⃣ Insert user into customers table
    const { error: dbError } = await supabase
      .from("users")
      .insert({
        uid: user.id,
        username: sname.value,
        email: semail.value,
        role: "user",
      });

    if (dbError) {
      alert("Database error: " + dbError.message);
      return;
    }

    // 3️⃣ Success
    regForm.reset();
    alert("Signup successful!");
    location.href = "./login.html";

  } catch (err) {
    console.log(err);
  }
}

regForm && regForm.addEventListener("submit", signup);
