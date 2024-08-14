import axios from 'axios';
import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setUser, setToken } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Sign Up");
    const [data, setData] = useState({ name: "", email: "", password: "" });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const onLogin = async (e) => {
        e.preventDefault();
    
        if (!url) {
            console.error("API base URL is not defined");
            toast.error("API base URL is not defined");
            return;
        }
    
        const endpoint = currState === "Login" ? "login" : "register";
        const requestUrl = `${url}/api/user/${endpoint}`;
    
        try {
            const response = await axios.post(requestUrl, data);
            console.log('Login response:', response.data);
    
            if (response.data.success) {
                toast.success(response.data.message);
    
                if (response.data.token) {
                    setToken(response.data.token);
                    // console.log('Token set:', response.data.token);
    
                    // Fetch user data after setting the token
                    const userResponse = await axios.get(`${url}/api/user/profile`, {
                        headers: {
                            'Authorization': `Bearer ${response.data.token}`
                        }
                    });
    
                    if (userResponse.data.success) {
                        setUser(userResponse.data.user);
                        console.log('User set:', userResponse.data.user);
                    } else {
                        toast.error("Failed to fetch user data");
                    }
                }
    
                setShowLogin(false); // Close the popup
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            toast.error(error.response ? error.response.data.message : 'An error occurred');
        }
    };
    

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <input 
                            name='name' 
                            onChange={onChangeHandler} 
                            value={data.name} 
                            type="text" 
                            placeholder='Your name' 
                            required 
                        />
                    )}
                    <input 
                        name='email' 
                        onChange={onChangeHandler} 
                        value={data.email} 
                        type="email" 
                        placeholder='Your email' 
                        required 
                    />
                    <input 
                        name='password' 
                        onChange={onChangeHandler} 
                        value={data.password} 
                        type="password" 
                        placeholder='Password' 
                        required 
                    />
                </div>
                <button type="submit">
                    {currState === "Login" ? "Login" : "Create account"}
                </button>
                <div className="login-popup-condition">
                    <input type="checkbox" id="terms" required />
                    <label htmlFor="terms">By continuing, I agree to the terms of use & privacy policy.</label>
                </div>
                {currState === "Login" ? (
                    <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                ) : (
                    <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;
