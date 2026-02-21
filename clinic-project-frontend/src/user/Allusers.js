import React, { useEffect, useState } from "react";
import api from "../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/all");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      fetchUsers(); // refresh after delete
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
            <th>Action</th>
          </tr>
        </thead>

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
      </table>
    </div>
  );
};

export default AdminUsers;