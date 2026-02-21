let storedUser = null;

try {
  const rawUser = localStorage.getItem("user");
  storedUser = rawUser && rawUser !== "undefined"
    ? JSON.parse(rawUser)
    : null;
} catch (error) {
  localStorage.removeItem("user");
  storedUser = null;
}

const initialState = {
  user: storedUser,
  token: localStorage.getItem("token") || null,
};