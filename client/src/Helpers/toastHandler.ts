import toast from "react-hot-toast";


export const toastHandler = (promise: Promise<any>, loadingMsg: string, successMsg: string) => {
    return toast.promise(promise, {
      loading: loadingMsg,
      success: (data) => data?.message || successMsg,
    });
};


