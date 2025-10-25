import toast from "react-hot-toast";
import { completePurchaseForPrompt } from "../features/payment/paymentSlice";
import Razorpay from "razorpay";


export const handlePayment = (orderId, amount, receipt, dispatch, navigate, userData) => {
    const options = {
        key : import.meta.env.VITE_RAZORPAY_KEY,
        amount : amount,
        currency : "INR",
        name : "Plypt - AI Marketplace Plaftorm",
        description : `Order receipt : ${receipt}`,
        order_id : orderId,
        handler : async(response) => {
            const paymentData = {
                razorpay_order_id : response.razorpay_order_id,
                razorpay_payment_id : response.razorpay_payment_id,
                razorpay_signature : response.razorpay_signature,
                orderId,
            };
            console.log("Dispatched");
            const result = await dispatch(completePurchaseForPrompt(paymentData));
            if(result.payload){
                navigate(`/purchase-history/${userData?.email}`);
            }else{
                toast.error("Payment Verification Failed");
            }
        },
        prefill : {
            name : userData?.name,
            email : userData?.email,
        },
        theme : {
            color : '#F37254'
        }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    
    razorpay.on("payment.failed", (response) => {
        toast.error("Payment failed !!, please try again");
        console.error("Razorpay error : ", response.error);
    })
}