import { React, useEffect } from "react";
import { SiShopware } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useStateContext } from "../../contexts/ContextProvider";

const Login = () => {
  const { currentColor } = useStateContext();
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    } else {
      console.log("login");
    }
  }, [user]);

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="shadow-xl p-10 text-gray-700 rounded-lg md:h-1/2 md:w-1/3 text-center flex justify-center flex-col">
        <div className="items-center p-5">
          <SiShopware className="text-5xl m-auto" />
          <h1 className="font-bold mt-2">Budg.it</h1>
        </div>
        <h2 className="text-2xl font-medium">Join Today</h2>
        <div className="py-4">
          <h3 className="py-4">Sign in with one of the providers</h3>
          <button
            onClick={GoogleLogin}
            className="text-white bg-gray-700 w-full font-medium rounded-lg flex justify-center align-middle p-4 gap-2"
          >
            <FcGoogle className="text-2xl" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;