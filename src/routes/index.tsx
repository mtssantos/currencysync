import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Home from "../screens/Home";
import Converter from "@/screens/Converter";
import ConverterFlag from "@/screens/ConverterFlag";



function RoutesNavigation(){
    return(
        <Router>
            <Routes>
                <Route path="/" Component={Home} />
                <Route path="/converter" Component={Converter} />
                <Route path="/converterflag" Component={ConverterFlag} />
            </Routes>
        </Router>
    )
}


export default RoutesNavigation;