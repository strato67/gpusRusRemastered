import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { BiSave } from "react-icons/bi";
import { BsFillTrashFill } from "react-icons/bs";
import { CartContext } from "../../Context/CartContext";
import useCart from "../../Hooks/useCart";
import Loading from "../Other/Loading";
import CartCard from "./CartCard";
import Empty from "./Empty";
import Error from "../Other/Error";

export default function CartDiv({ user }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { getCartDetail } = useContext(CartContext);
  const { updateCart, emptyCart } = useCart();

  const getCart = async () => {
    const response = await fetch(`/api/cart/${user.username}`,{
      headers: {
        authorization: `Bearer ${user.userToken}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      return [];
    }
    setLoading(false);
    return [data.cart, data.total];
  };

  const sendUpdate = async () => {
    const updatedCart = cart.map((cartItem) => {
      delete cartItem._id;
      if (cartItem.quantity === 0) {
        setCart(cart.filter((item) => item.product !== cartItem.product));
      }
      return cartItem;
    });
    await updateCart(user.username, updatedCart);
    await getCartDetail(user.username);
    setHasUnsavedChanges(false);
  };

  useEffect(() => {
    (async () => {
      const data = await getCart();
      setCart(data[0]);
      setTotal(data[1]);
    })();
  }, []);

  return (
    <>
      {loading && <Loading />}
      {!loading && (!cart || cart.length == 0) ? (
        <Empty />
      ) : (
        <>
          <div className="min-h-screen relative">
            <div className="px-8">
              {hasUnsavedChanges && (
                <Error message="You have unsaved changes." />
              )}
              {cart.map((item) => (
                <CartCard
                  key={`${item.product}`}
                  productID={item.product}
                  quantity={item.quantity}
                  user={user.username}
                  updateCart={setCart}
                  setTotal={setTotal}
                  setHasUnsavedChanges={setHasUnsavedChanges}
                  getCartDetail={getCartDetail}
                />
              ))}
            </div>

            <div className="flex flex-col sticky px-8 w-full bottom-0 lg:absolute bg-base-200 pt-4 z-10">
              <div className="pb-6">
                <h1 className="text-2xl md:text-4xl font-bold">
                  Total: ${total.toFixed(2)}
                </h1>
              </div>
              <div className="flex pb-3  w-full ">
                <button
                  className="btn btn-outline btn-info w-1/2"
                  onClick={sendUpdate}
                >
                  <BiSave size={20} />
                  Save
                </button>
                <button
                  className="btn btn-outline btn-error w-1/2"
                  onClick={() => window.confirmEmpty.showModal()}
                >
                  <BsFillTrashFill size={20} />
                  Empty Cart
                </button>
              </div>

              <Link
                className="btn btn-success w-full"
                onClick={sendUpdate}
                to="/checkout"
                state={{ cart, total }}
                disabled={hasUnsavedChanges}
              >
                Checkout
              </Link>
            </div>
            <dialog
              id="confirmEmpty"
              className="modal modal-bottom sm:modal-middle"
            >
              <form method="dialog" className="modal-box">
                <h3 className="font-bold text-lg">Empty Cart</h3>
                <p className="py-4">
                  Are you sure you want to empty your cart?
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    className="btn w-1/2"
                    onClick={async () => {
                      await emptyCart(user.username);
                      await getCartDetail(user.username);
                      setCart([]);
                    }}
                  >
                    Confirm
                  </button>
                  <button className="btn w-1/2 btn-outline btn-error">
                    Cancel
                  </button>
                </div>
              </form>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
        </>
      )}
    </>
  );
}
