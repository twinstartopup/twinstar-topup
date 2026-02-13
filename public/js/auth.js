import "./supabase.js";

const usernameRegex = /^[a-z0-9._]+$/;

/* =========================
   REGISTER
========================= */
window.register = async function () {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const pin = document.getElementById("pin").value;
  const pin2 = document.getElementById("pin2").value;

  if (!usernameRegex.test(username)) {
    alert("Username hanya huruf kecil, angka, . dan _");
    return;
  }

  if (pin.length !== 8 || pin !== pin2) {
    alert("PIN harus 8 digit dan sama");
    return;
  }

  // daftar auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pin,
  });

  if (error) {
    alert(error.message);
    return;
  }

  if (!data.user) {
    alert("Gagal membuat user");
    return;
  }

  // simpan ke table users
  const { error: insertError } = await supabase
    .from("users")
    .insert({
      id: data.user.id,
      email,
      username,
      pin,
      role: "member",
    });

  if (insertError) {
    alert(insertError.message);
    return;
  }

  alert("Register berhasil! Silakan login.");
  location.href = "/login.html";
};

/* =========================
   LOGIN
========================= */
window.login = async function () {
  const input = document.getElementById("loginInput").value.trim();
  const pin = document.getElementById("pin").value;

  let email = input;

  // jika login pakai username
  if (!input.includes("@")) {
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("username", input)
      .single();

    if (error || !data) {
      alert("Username tidak ditemukan");
      return;
    }

    email = data.email;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: pin,
  });

  if (error) {
    alert(error.message);
    return;
  }

  location.href = "/dashboard.html";
};
