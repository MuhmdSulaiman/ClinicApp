import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://clinicapp-1-rloo.onrender.com/users/all",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data);
    }
  };
const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `https://clinicapp-1-rloo.onrender.com/users/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // refresh user list after delete
    fetchUsers();
  } catch (err) {
    console.error("Error deleting user:", err.response?.data);
  }
};
  return (
    <div>
      <h2>All Users</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
          <tbody>
  {users.map((user) => (
    <tr key={user._id}>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <button onClick={() => handleDelete(user._id)}>
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;