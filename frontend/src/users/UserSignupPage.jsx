import { Password } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserSignupPage() {
    const [user,setUser]=useState({name:"",password:"",location:"",mobilenumber:"",hasvehicle:""});
    const navigate=useNavigate();
    const handleChange=(e)=>{
        setUser({...user,[e.target.name]:e.target.value});
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const res= await fetch("http://localhost:1000/users/signup",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify({user})
            });
            const data= await res.json();
            navigate("/batteries/all")
        } catch (error) {
            console.log(e);
        }
    }

    return (
        <><h2>Signup Page</h2>
            <div>
                <div>
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="Name">Name</label>
                            <input type="text" placeholder="Enter Name" name="name"  value={user.name} onChange={handleChange} />
                            <br /><br />
                        </div>
                        <div><label htmlFor="password">Set Password</label>
                            <input type="password" placeholder="Enter A Password " value={user.password} onChange={handleChange} name="password" required />
                            <br /><br />
                        </div>
                        <div>
                            <label htmlFor="location">Location : </label>
                            <input type="text" placeholder="Enter address " name="location" value={user.location} onChange={handleChange} id="location" required /><br /><br /></div>
                        <div><label htmlFor="mobilenumber">Mobile Number</label>
                            <input type="number" placeholder="Enter Mobile Number " name="mobilenumber" id="mobilenumber" value={user.mobilenumber} onChange={handleChange} required />
                            <br /><br /></div>
                            <label htmlFor="hasvehicle">Do You have Vehicle: </label>
                        <select onChange={handleChange} value={user.hasvehicle} name="hasvehicle">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                        <br /><br /><br />
                        <button>Signup</button>
                    </form>
                </div>
            </div>
        </>);
}