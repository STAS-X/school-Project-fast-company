import "react-toastify/dist/ReactToastify.css";
import { toast, cssTransition } from "react-toastify";

const bounce = cssTransition({
    enter: "animate__animated animate__bounceIn",
    exit: "animate__animated animate__bounceOut"
});

// https://animista.net/
// source animation inside style.css
const wobble = cssTransition({
    enter: "wobble-hor-bottom",
    exit: "wobble-hor-top"
});

const initOpts = {
    position: toast.POSITION.TOP_CENTER,
    icon: true,
    hideProgressBar: true,
    draggable: true,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    autoClose: 2500
};

export function toastSuccessBounce(text) {
    toast.success("👌 " + text, {
        ...initOpts,
        theme: "colored",
        transition: bounce
    });
}

export function toastErrorBounce(text) {
    toast.error("👋 " + text, {
        ...initOpts,
        position: toast.POSITION.TOP_RIGHT,
        transition: bounce
    });
}

export function toastDarkBounce(text) {
    toast.dark("👋 " + text, {
        ...initOpts,
        transition: bounce
    });
}

export function toastSuccessSwirl(text) {
    toast.success("👌 " + text, {
        ...initOpts,
        theme: "colored",
        transition: wobble
    });
}

export function toastWarningSwirl(text) {
    toast.warning("👋 " + text, {
        ...initOpts,
        position: toast.POSITION.TOP_RIGHT,
        transition: wobble
    });
}

export function toastDarkSwirl(text) {
    toast.dark("👋 " + text, {
        ...initOpts,
        transition: wobble
    });
}
