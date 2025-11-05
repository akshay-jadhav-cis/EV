import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditBattery() {
  const { id } = useParams(); // ✅ to get battery ID from URL
  const navigate = useNavigate();

  const [batteryData, setBatteryData] = useState({
    batteryname: "",
    image: "",
    voltage: "",
    batteryWeight: "",
    batteryType: "",
    sized: "",
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchBattery = async () => {
      try {
        const res = await axios.get(`http://localhost:1000/batteries/${id}/edit`);
        setBatteryData(res.data);
      } catch (error) {
        console.error("Error fetching battery data", error);
        setError("Error fetching battery data");
      } finally {
        setDataLoading(false);
      }
    };
    fetchBattery();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBatteryData({ ...batteryData, [name]: value });
  };
  const handleFileChange = (e) => {
    setBatteryData({ ...batteryData, image: e.target.files[0] });
  };

  // ✅ 5️⃣ Submit updated data via PUT request
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    for (const key in batteryData) {
      formData.append(key, batteryData[key]);
    }

    // ✅ Correct route (was /view before)
    const res = await fetch(`http://localhost:1000/batteries/${id}/edit`, {
      method: "PUT",
      body: formData,
    });

    // ✅ Defensive check
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error: ${res.status} - ${text}`);
    }

    const data = await res.json();
    console.log("Updated:", data);
    navigate("/batteries/all");
  } catch (error) {
    console.error("Error updating battery:", error);
    setError("Failed to update battery");
  }
};


  
  if (dataLoading) return <h3>Loading battery details...</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  
  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Battery Details</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="batteryname">Battery Name : </label>
        <input
          type="text"
          name="batteryname"
          value={batteryData.batteryname}
          id="batteryname"
          onChange={handleChange}
          required
        />
        <br /><br />

        <label htmlFor="image">Image:</label>
        <input
          type="file"
          name="image"
          id="image"
          onChange={handleFileChange}
          accept="image/*"
        />
        <br /><br />

        <label htmlFor="voltage">Voltage : </label>
        <input
          type="text"
          name="voltage"
          value={batteryData.voltage}
          id="voltage"
          onChange={handleChange}
          required
        />
        <br /><br />

        <label htmlFor="batteryWeight">Weight : </label>
        <input
          type="number"
          name="batteryWeight"
          value={batteryData.batteryWeight}
          id="batteryWeight"
          onChange={handleChange}
          required
        />
        <br /><br />

        <label htmlFor="batteryType">Battery Type : </label>
        <select
          name="batteryType"
          id="batteryType"
          value={batteryData.batteryType}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="c-type">C-type</option>
          <option value="normal">Normal</option>
          <option value="roll">Roll</option>
        </select>
        &nbsp;

        <label htmlFor="sized">Sized :</label>
        <select
          name="sized"
          id="sized"
          value={batteryData.sized}
          onChange={handleChange}
          required
        >
          <option value="">Select Size</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <br /><br />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}
