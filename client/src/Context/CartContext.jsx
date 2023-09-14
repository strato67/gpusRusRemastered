import { createContext, useState, useEffect } from "react";
import useAuthContext from "../Hooks/useAuthContext";

const CartContext = createContext({
  cartDetails: {},
  getCartDetail: () => {},
});

const CartContextProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [cartDetails, setCartDetails] = useState({});

  const getCartDetail = async (username) => {
    const response = await fetch(`/api/cart/${username}/total`);
    const data = await response.json();

    if (!response.ok) {
      return {};
    }

    setCartDetails(data);
  };

  useEffect(() => {
    if (user) {
      getCartDetail(user.username);
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ cartDetails, getCartDetail }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartContextProvider };
