import React, { useEffect, useState } from "react";
import URL from "../../../utils/service";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${URL}/api/users`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Kya aap sure hain ki aap is user ko delete karna chahte hain?")) return;

    try {
      const response = await fetch(`${URL}/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      alert("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    try {
      const response = await fetch(`${URL}/api/users/toggle-role/${userId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to change user role");
      }

      alert(`User role changed to ${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };


  const filteredUsers = users.filter(
    (user) =>
      user.Phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.Username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.Email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-4">
      <h1 className="mb-4 text-center text-primary fw-bold">Users List</h1>


      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by Phone, Username, Email, Role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="item">
          <table className="table border table-hover text-center " style={{ whiteSpace: 'nowrap', borderRadius: '10px', overflow: 'hidden', boxShadow: '0px 0px 10px rgba(0,0,0,.1)' }}>
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Phone</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.Phone}</td>
                    <td>{user.Username || "N/A"}</td>
                    <td>{user.Email}</td>
                    <td>
                      <span
                        className={`badge ${user.role === "admin" ? "bg-success" : "bg-info"
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <i class="fa-solid fa-user-tie btn"></i>
                      <i class="fa-solid fa-trash btn m-2" onClick={() => handleDelete(user._id)}></i>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-danger fw-bold">
                    No matching users found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersList;
