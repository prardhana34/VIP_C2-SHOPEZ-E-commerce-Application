import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h2>Please Login First</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-card">

        {/* HEADER */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        {/* INFO */}
        <div className="profile-info">

          <div className="info-box">
            <span>Name</span>
            <h4>{user.name}</h4>
          </div>

          <div className="info-box">
            <span>Email</span>
            <h4>{user.email}</h4>
          </div>

          <div className="info-box">
            <span>Role</span>
            <h4 className="role">{user.role}</h4>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="profile-actions">

          {user.role !== "ADMIN" && (
            <button
              className="orders-btn"
              onClick={() => navigate("/orders")}
            >
              📦 My Orders
            </button>
          )}

          <button
            className="logout-btn-profile"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;