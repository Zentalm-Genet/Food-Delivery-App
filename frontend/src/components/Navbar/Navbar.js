import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';
import { StoreContext } from '../../Context/StoreContext'; 

const Navbar = ({ setShowLogin }) => {
    const { cartCount } = useContext(StoreContext); 

    return (
        <nav className="navbar">
            <Link to="/" className="logo">Z<span>food</span>Del.</Link>
            <ul className="navbar-menu">
                <li><Link to="/">Home</Link></li>
                <li><a href="#explore-menu">Menu</a></li> 
                <li><a href="#About">About</a></li>
                <li><a href="#footer">Contact</a></li> 
            </ul>
            <div className="navbar-cart">
                <Link to="/cart" className="navbar-crt">
                    <FontAwesomeIcon icon={faShoppingCart} />
                    <span className="cart-count">{cartCount}</span>
                </Link>
                <div>
                    <button onClick={() => setShowLogin(true)}>Sign In</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
