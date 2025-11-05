import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import AllBatery from "./battery/AllBatery.jsx";
import AddBatery from "./battery/AddBatery.jsx";
import ViewBatery from "./battery/ViewBatery.jsx";
import EditBatery from "./battery/EditBatery.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/batteries/all" element={<AllBatery />} />
        
        <Route path="/batteries/add" element={<AddBatery/>}/>
        <Route path="/batteries/:id/view" element={<ViewBatery/>}/>
        <Route path="/batteries/:id/edit" element={<EditBatery/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
