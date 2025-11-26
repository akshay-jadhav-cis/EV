import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <p>Please login first.</p>;

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <button
        onClick={() => navigate(`/users/profile/${user.id}/ownbattery`)}
      >
        View My Batteries
      </button>
    </div>
  );
}
