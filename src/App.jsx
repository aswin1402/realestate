import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Companies from "./components/Companies/Companies";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import GetStarted from "./components/GetStarted/GetStarted";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Layout from "./components/Layout/Layout";
import Residencies from "./components/Residencies/Residencies";
import Value from "./components/Value/Value";
import Website from "./Pages/Website";
import Properties from "./Pages/Properties/Properties";
import Property from "./components/Property/Property";
import Auth from "./components/Login/Auth";
import { TokenAuthContext } from "./ContextAPI/TokenAuth";
import { useContext } from "react";
import Addproperty from "./components/Addproperty/Addproperty";
import ResponseContex from "./ContextAPI/ResponseContex";
import Bookings from "./components/bookings/Bookings";

function App() {
  // const {isAuthorized,setIsAuthorized}=useContext(TokenAuthContext)
  return (

    <ResponseContex>
      <BrowserRouter>
        <Routes>
        {/* <Route path="/Login" element={<Auth />} />
        <Route path="/register" element={<Auth register />} /> */}
          <Route element={<Layout />}>
         
            <Route path="/" element={<Website />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:propertyId" element={<Property />} />

            
            <Route path="/addproperty" element={<Addproperty />} />
            <Route path="/Bookings" element={<Bookings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ResponseContex>
  );
}

export default App;
