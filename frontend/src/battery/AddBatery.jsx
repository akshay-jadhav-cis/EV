import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function AddBatery() {
    const navigate = useNavigate();
    const [batteryData, setBatteryData] = useState({ batteryname: "", sized: "", image: "", voltage: "", batteryWeight: "", batteryType: "" });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBatteryData({ ...batteryData, [name]: value });
    }
    const handleFileChange = (e) => {
        setBatteryData({ ...batteryData, image: e.target.files[0] });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            for (const key in batteryData) {
                formData.append(key, batteryData[key]);
            }
            const res = await fetch("http://localhost:1000/batteries/add", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            console.log("Created:", data);
            navigate("/batteries/all");
        } catch (error) {
            console.error("Error submitting battery:", error);
        }
    };
    return (
        <>
            <h1>Battery Add Page</h1>
            <form method="post" onSubmit={handleSubmit}>
                <label htmlFor="batteryname">Battery Name : </label>
                <input type="text" name="batteryname" value={batteryData.batteryname} id="batteryname" onChange={handleChange} required />
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
                <input type="text" name="voltage" value={batteryData.voltage} id="voltage" onChange={handleChange} required />
                <br /><br />
                <label htmlFor="batteryWeight">Weight : </label>
                <input type="number" name="batteryWeight" value={batteryData.batteryWeight} onChange={handleChange} id="batteryWeight" required />
                <br /><br />
                <span>
                    <label htmlFor="batteryType">Battery Type : </label>
                    <select value={batteryData.batteryType} name="batteryType" id="batteryType" onChange={handleChange} required>
                        <option value="c-type">C-type</option>
                        <option value="normal">Normal</option>
                        <option value="roll">Roll</option>
                    </select>
                </span> &nbsp;
                <span>
                    <label htmlFor="sized">Sized :</label>
                    <select
                     value={batteryData.sized} 
                     name="sized" onChange={handleChange} id="sized" required>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </span>
                <br /><br />
                <button type="submit">Submit</button>
            </form>

        </>
    );
}