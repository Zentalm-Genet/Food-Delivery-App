import React, { createContext, useState } from 'react';
import { food_list, menu_list } from '../assets/assets';
import LoginPopup from '../components/LoginPopup/LoginPopup';

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState({});
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const url = "http://localhost:4000";
    const [showLogin, setShowLogin] = useState(false);
    const currency = '$';
    const deliveryCharge = 5;

    const getTotalCartAmount = () => {
        return Object.keys(cartItems).reduce((total, itemId) => {
            const item = food_list.find(product => product._id === itemId);
            return item ? total + (item.price * cartItems[itemId]) : total;
        }, 0);
    };

    const addToCart = (itemId) => {
        setCartItems(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));
    };

    const removeFromCart = (itemId) => {
        setCartItems(prev => {
            const updatedCart = { ...prev };
            if (updatedCart[itemId] > 1) {
                updatedCart[itemId] -= 1;
            } else {
                delete updatedCart[itemId];
            }
            return updatedCart;
        });
    };

    // const placeOrder = async (deliveryData) => {
    //     console.log('Placing order with delivery data:', deliveryData);
    //     // Add order placing logic here
    // };

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        showLogin,
        setShowLogin,
        currency,
        deliveryCharge,
        cartCount: Object.values(cartItems).reduce((total, count) => total + count, 0),
        user,
        setUser,
        setCartItems,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
