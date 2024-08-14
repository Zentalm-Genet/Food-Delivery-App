import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
    const navigate = useNavigate();
    const [payment, setPayment] = useState("cod");
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const { 
        user,
        getTotalCartAmount, 
        food_list, 
        cartItems, 
        url, 
        setCartItems, 
        currency, 
        deliveryCharge 
    } = useContext(StoreContext);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const placeOrderFun = async (e) => {
        e.preventDefault();
    
        if (!user || !user.id) {
            toast.error("User is not logged in.");
            navigate('/login');
            return;
        }
    
        const orderItems = food_list
            .filter(item => cartItems[item._id] > 0)
            .map(item => ({ ...item, quantity: cartItems[item._id] }));
    
        const deliveryData = {
            userId: user.id,
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge,
            payment,
            date: new Date().toISOString(),
            status: 'Pending'
        };
    
        try {
            let response;
            if (payment === "stripe") {
                response = await axios.post(
                    `${url}/api/order/place`,
                    deliveryData,
                    { headers: { 'Content-Type': 'application/json' } }
                );
                if (response.data.success) {
                    window.location.replace(response.data.session_url);
                } else {
                    toast.error("Something went wrong with Stripe payment");
                }
            } else {
                response = await axios.post(
                    `${url}/api/order/placecod`,
                    deliveryData,
                    { headers: { 'Content-Type': 'application/json' } }
                );
                if (response.data.success) {
                    navigate("/myorders");
                    toast.success(response.data.message);
                    setCartItems({});
                } else {
                    toast.error("Something went wrong with COD order");
                }
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error("Error placing order. Please try again.");
        }
    };

    return (
        <form onSubmit={placeOrderFun} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input 
                        type="text" 
                        name='firstName' 
                        onChange={onChangeHandler} 
                        value={data.firstName} 
                        placeholder='First name' 
                        required 
                    />
                    <input 
                        type="text" 
                        name='lastName' 
                        onChange={onChangeHandler} 
                        value={data.lastName} 
                        placeholder='Last name' 
                        required 
                    />
                </div>
                <input 
                    type="email" 
                    name='email' 
                    onChange={onChangeHandler} 
                    value={data.email} 
                    placeholder='Email address' 
                    required 
                />
                <input 
                    type="text" 
                    name='street' 
                    onChange={onChangeHandler} 
                    value={data.street} 
                    placeholder='Street' 
                    required 
                />
                <div className="multi-field">
                    <input 
                        type="text" 
                        name='city' 
                        onChange={onChangeHandler} 
                        value={data.city} 
                        placeholder='City' 
                        required 
                    />
                    <input 
                        type="text" 
                        name='state' 
                        onChange={onChangeHandler} 
                        value={data.state} 
                        placeholder='State' 
                        required 
                    />
                </div>
                <div className="multi-field">
                    <input 
                        type="text" 
                        name='zipcode' 
                        onChange={onChangeHandler} 
                        value={data.zipcode} 
                        placeholder='Zip code' 
                        required 
                    />
                    <input 
                        type="text" 
                        name='country' 
                        onChange={onChangeHandler} 
                        value={data.country} 
                        placeholder='Country' 
                        required 
                    />
                </div>
                <input 
                    type="text" 
                    name='phone' 
                    onChange={onChangeHandler} 
                    value={data.phone} 
                    placeholder='Phone' 
                    required 
                />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>{currency}{getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>{currency}{deliveryCharge}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>{currency}{getTotalCartAmount() + deliveryCharge}</b>
                        </div>
                    </div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img 
                            src={payment === "cod" ? assets.checked : assets.un_checked} 
                            alt="COD" 
                        />
                        <p>Cash on delivery</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img 
                            src={payment === "stripe" ? assets.checked : assets.un_checked} 
                            alt="Stripe" 
                        />
                        <p>Credit / Debit</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>
                    {payment === "cod" ? "Place Order" : "Proceed To Payment"}
                </button>
            </div>
        </form>
    );
};

export default PlaceOrder;
