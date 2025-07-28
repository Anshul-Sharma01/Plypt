import toast from "react-hot-toast";

export const handlePayment = (orderId, amount, receipt, dispatch, navigate, userData) => {
    const options = {
        key : import.meta.env.VITE_RAZORPAY_KEY,
        amount : amount * 100,
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
            // const result = await dispatch((paymentData));
            if(result.payload){
                // navigate("")
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
    const razorypay = new window.Razorypay(options);
    razorypay.on("payment.failed", (response) => {
        toast.error("Payment failed !!, please try again");
        console.error("Razorpay error : ", response.error);
    })
}