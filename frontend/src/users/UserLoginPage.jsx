import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserLoginPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: "", password: "" });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: data }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("Login successful!");
        console.log("User data:", result.user);
        navigate("/batteries/all");
      } else {
        alert(result.error || "Login failed");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>User Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <br />
          <input
            type="text"
            placeholder="Enter your name"
            name="name"
            value={data.name}
            id="name"
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            value={data.password}
            id="password"
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
