import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export  default function ViewBatery(){
    const {id}=useParams();
    const navigate=useNavigate();
    const [viewbatteryData,setviewbatteryData]=useState(null);
    const[dataloading,setdataloading]=useState(false);
    const [error,setError]=useState(null);
    useEffect(()=>{
       const fetchBattery=async()=>{
            try {
                setdataloading(true)
                const res=await axios.get(`http://localhost:1000/batteries/${id}/view`)
                setviewbatteryData(res.data);
            } catch (error) {
                console.log('Eror Occured during the fetching data');
                setError("Error");
            }finally{
                setdataloading(false);
            }
       }
       fetchBattery();
    },[id]);
    

    const handleDelete=async()=>{
        if(window.confirm('Are Your really Want to Delete the Battery ?')){
            try {
                const res=await fetch(`http://localhost:1000/batteries/${id}/delete`,{
                    method:"DELETE",
                });
                 const data=await res.json();
                if(data.success){
                    navigate('/batteries/all');
                }else{
                    alert(data.message);
                }
            } catch (error) {
                console.log('Error Ocuured During ',error);
            }
        }
    }



    if (dataloading) return <h3>Loading battery details...</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  if (!viewbatteryData) return <h3>No battery data found.</h3>;

    return (
       <div>
            <h2>Battery Details</h2>
             <img
        src={`http://localhost:1000/uploads/${viewbatteryData.image}`}
        alt={viewbatteryData.batteryname}
        style={{ width: "300px", borderRadius: "10px", marginBottom: "20px" }}
      />
      <h3>{viewbatteryData.batteryname}</h3>
      <p><strong>Voltage:</strong> {viewbatteryData.voltage}V</p>
      <p><strong>Weight:</strong> {viewbatteryData.batteryWeight} kg</p>
      <p><strong>Type:</strong> {viewbatteryData.batteryType}</p>
      <p><strong>Size:</strong> {viewbatteryData.sized}</p>
      <div>
        <span>
            <button onClick={()=>navigate(`/batteries/${id}/edit`)}>Edit</button>
        </span>    &nbsp;
        <span>
            <button onClick={handleDelete}>Delete</button>
        </span>
      </div>
       </div>
    );
}