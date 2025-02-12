import React from "react";
import './Navbar.css'
import logo from '../../assets/logo.png'
import profile from '../../assets/profile.png'
import logout from '../../assets/logout.png'
import { Link } from "react-router-dom";


function Navbar() {
    return (
        <div className="navbar">
            <div className="navbar-left">
                <img src={logo} alt="logo" className="navbar-logo" />
            </div>
            <div className="navbar-middle">
                {/* <Link to="/" className="nav-button">Main</Link>
                <Link to="/" className="nav-button">Spending Trend </Link>
                <Link to="/" className="nav-button">Income Trend</Link> */}
                <Link to="/add-expense" className="nav-button">Add Expense</Link>
                <Link to="/add-income" className="nav-button">Add Income</Link>
                <Link to="/add-budget" className="nav-button">Add Budget</Link>
            </div>

            {/* <div className="navbar-right">
                <img src={profile} alt="profile" className="nav-icon" />
                <img src={logout} alt="logout" className="nav-icon" />
            </div> */}

            <div className="slogan">
                <p>Monitor your spending to stay on budget</p>
            </div>


        </div>
    )
}


export default Navbar