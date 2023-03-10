import { React, useEffect } from "react";
import { ReactComponent as Logo } from "../../data/budgit-icon.svg";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useStateContext } from "../../contexts/ContextProvider";

const Login = () => {
  const { currentColor, getMode } = useStateContext();
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
    if (user && user.uid !== undefined) {
      getMode(user);
      navigate("/dashboard");
    } else {
    }
  }, [user]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col justify-center rounded-lg p-10 text-center text-gray-700 shadow-xl md:h-1/2 md:w-1/3">
        <div className="back items-center p-5">
          <div className="flex justify-center">
            <Logo className="h-[4rem] w-[4rem]" />
          </div>
          <h1 className="mt-2 font-bold dark:text-white">Budg.it</h1>
        </div>
        <h2 className="text-2xl font-medium dark:text-white">Join Today</h2>
        <div className="py-4">
          <h3 className="py-4 dark:text-white">Sign in with one of the providers</h3>
          <button
            onClick={() => {
              GoogleLogin();
            }}
            className="flex w-full justify-center gap-2 rounded-lg bg-gray-700 p-4 align-middle font-medium text-white"
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
