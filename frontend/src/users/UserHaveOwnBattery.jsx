import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function UserHaveOwnBattery() {
  const { id } = useParams(); // USER ID
  const [batteries, setBatteries] = useState([]);
  const navigate = useNavigate();

  // DELETE battery
  const handleDelete = async (batteryId) => {
    if (!window.confirm("Are you sure you want to delete this battery?")) return;

    try {
      const res = await fetch(`http://localhost:1000/batteries/${batteryId}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        alert("Battery deleted successfully!");
        // refresh after delete
        setBatteries(batteries.filter((b) => b._id !== batteryId));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Session expired. Please log in again.");
      navigate("/users/login");
    }
  };

  // GET BATTERIES OWNED BY USER
  useEffect(() => {
    axios
      .get(`http://localhost:1000/users/profile/${id}/ownbattery`, {
        withCredentials: true,
      })
      .then((res) => {
        setBatteries(res.data);
      })
      .catch((err) => console.error("Error loading batteries", err));
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Batteries</h2>

      {batteries.length === 0 ? (
        <p>No batteries found.</p>
      ) : (
        batteries.map((b) => (
          <div
            key={b._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <h3>{b.batteryname}</h3>
            <p><strong>Voltage:</strong> {b.voltage}</p>
            <p><strong>Type:</strong> {b.batteryType}</p>
            <p><strong>Weight:</strong> {b.batteryWeight} kg</p>
            <p><strong>Size:</strong> {b.sized}</p>
            
            <img
              src={`http://localhost:1000/uploads/${b.image}`}
              alt={b.batteryname}
              width="150"
            />

            <br /><br />

            <button onClick={() => navigate(`/batteries/${b._id}/edit`)}>
              Edit
            </button>

            <button onClick={() => handleDelete(b._id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
