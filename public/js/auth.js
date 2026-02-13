import "./supabase.js";

const usernameRegex = /^[a-z0-9._]+$/;

window.register = async function () {
  const username = username.value;
  const email = email.value;
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

  const { data, error } = await supabase.auth.signUp({
    email,
    password: pin
  });

  if (error) return alert(error.message);

  await supabase.from("users").insert({
    id: data.user.id,
    email,
    username,
    pin,
    role: "user"
  });

  alert("Register berhasil");
};

window.login = async function () {
  const input = document.getElementById("loginInput").value;
  const pin = document.getElementById("pin").value;

  let email = input;

  // jika login pakai username, cari emailnya dulu
  if (!input.includes("@")) {
    const { data } = await supabase
      .from("users")
      .select("email")
      .eq("username", input)
      .single();

    if (!data) return alert("Username tidak ditemukan");

    email = data.email;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: pin
  });

  if (error) alert(error.message);
  else location.href = "/dashboard.html";
};
