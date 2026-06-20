import { useEffect, useState } from "react";
import API from "../api/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("USERS:", res.data);

      setUsers(res.data?.users || res.data || []);
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading users...</div>;
  }

  return (
    <div className="admin-page">

      <h1 className="admin-title">👥 Users</h1>

      {users.length === 0 ? (
        <p className="muted">No users found</p>
      ) : (
        users.map((u) => (
          <div key={u._id} className="user-card">

            <div>
              <p className="user-name">{u.name}</p>
              <p className="user-email">{u.email}</p>
            </div>

            <span className="user-role">{u.role}</span>

          </div>
        ))
      )}

    </div>
  );
}

export default AdminUsers;