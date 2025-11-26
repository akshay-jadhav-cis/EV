import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserHaveOwnBattery() {
  const { id } = useParams();
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBatteries = async () => {
      try {
        const res = await fetch(`http://localhost:1000/user/profile/${id}/ownbattery`, {
          method: "POST", // match backend
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          console.error("Fetch failed", res.status);
          setBatteries([]);
          return;
        }

        const data = await res.json();
        setBatteries(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setBatteries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBatteries();
  }, [id]);

  if (loading) return <div>Loading batteries...</div>;

  return (
    <div>
      <h2>Own Batteries</h2>
      {batteries.length === 0 ? (
        <p>No batteries found.</p>
      ) : (
        <ul>
          {batteries.map((b, i) => (
            <li key={b._id || i}>
              <strong>{b.name || `Battery ${i + 1}`}</strong>
              <pre>{JSON.stringify(b, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
