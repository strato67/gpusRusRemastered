import { useState } from "react";
import Empty from "../Cart/Empty";
import ReviewCart from "./ReviewCart";
import Payment from "./Payment";
import useAuthContext from "../../Hooks/useAuthContext";
import PaymentSuccess from "./PaymentSuccess";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const { user } = useAuthContext();
  const [step, setStep] = useState(1);

  return (
    <>
      {user ? (
        <div className="md:min-h-screen relative bg-base-200 flex flex-col">
          <ul className="steps py-10">
            <li
              className={
                step === 1
                  ? `step step-primary font-bold md:text-xl`
                  : ` step-primary step md:text-xl`
              }
            >
              Review Order
            </li>
            <li
              className={
                step === 2 || step === 3
                  ? `step step-primary font-bold md:text-xl`
                  : `step md:text-xl`
              }
            >
              Payment
            </li>
            <li
              className={
                step === 3
                  ? `step step-primary font-bold md:text-xl`
                  : `step md:text-xl`
              }
            >
              Confirmation
            </li>
          </ul>
          {step === 1 && (
            <ReviewCart
              user={user}
              cart={cart}
              total={total}
              setStep={setStep}
              setCart={setCart}
              setTotal={setTotal}
            />
          )}
          {step === 2 && (
            <Payment user={user} setStep={setStep} cart={cart} total={total} />
          )}
          {step === 3 && <PaymentSuccess user={user} />}
        </div>
      ) : (
        <Empty />
      )}
    </>
  );
}
