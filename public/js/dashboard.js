import "./supabase.js";

const { data: { user } } = await supabase.auth.getUser();

if (!user) location.href = "/login.html";

const { data } = await supabase
  .from("users")
  .select("*")
  .eq("id", user.id)
  .single();

document.getElementById("username").value = data.username;
document.getElementById("email").innerText = data.email;
document.getElementById("role").innerText = data.role;
document.getElementById("balance").innerText = data.balance ?? 0;
document.getElementById("created").innerText =
  new Date(data.created_at).toLocaleString();

if (data.avatar_url)
  document.getElementById("avatar").src = data.avatar_url;

/* =======================
   UPDATE USERNAME
======================= */
window.updateUsername = async () => {
  const newUsername = document.getElementById("username").value;

  const { error } = await supabase
    .from("users")
    .update({ username: newUsername })
    .eq("id", user.id);

  alert(error ? error.message : "Username diperbarui");
};

/* =======================
   UPLOAD AVATAR
======================= */
window.uploadAvatar = async () => {
  const file = document.getElementById("avatarFile").files[0];
  if (!file) return;

  const filePath = `${user.id}.png`;

  await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  await supabase
    .from("users")
    .update({ avatar_url: urlData.publicUrl })
    .eq("id", user.id);

  location.reload();
};
