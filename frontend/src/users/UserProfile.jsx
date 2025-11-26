import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?._id;

  const handleClick = () => {
    if (!userId) {
      alert("Please login first.");
      return;
    }
    navigate(`/users/profile/${userId}/ownbattery`);
  };

  return (
    <div>
      <h2>My Profile</h2>
      <p>{user ? `Name: ${user.name}` : "Not logged in"}</p>
      <button type="button" onClick={handleClick}>
        own batteries
      </button>
    </div>
  );
}
