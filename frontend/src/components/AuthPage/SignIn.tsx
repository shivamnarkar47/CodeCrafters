import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  return (
    <main
      
      className="w-full dark:bg-black dark:text-white text-black bg-white min-h-screen flex flex-col items-center justify-center sm:px-4 relative"
    >
      <div className="max-w-sm w-full space-y-8">
        <div className="text-left">
          <img
            src="/Sidelogo.png"
            width={100}
            className="mr-auto rounded-full "
          />
          <div className="mt-5 space-y-2 mr-auto">
            <h3 className=" text-2xl font-normal sm:text-3xl tracking-tighter font-geist">
              Log in to your account
            </h3>
            <p className="">
              Don't have an account?{" "}
              <Link
                to="/auth/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
        <form onSubmit={(e) => {e.preventDefault();navigate("/dashboard")}}>
          <div>
            <label className="font-medium">Email</label>
            <Input
              type="email"
              required
              className="w-full mt-2 px-3 py-4  bg-transparent outline-none  focus:border-pink-600/50 shadow-sm rounded-lg border-black border-[1px]"
            />
          </div>
          <button className="w-full font-geist tracking-tighter text-center rounded-md bg-gradient-to-br from-blue-400 to-blue-700 px-4 py-2 text-lg text-zinc-50 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-gray-300 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-blue-500/70 flex items-center justify-center gap-2 mt-5" >
            Sign in
            <ChevronRight className="inline-flex justify-center items-center w-4 h-4 ml-2 group-hover:translate-x-1 duration-300" />
          </button>
        </form>
        
        {/* <div className="text-center">
          <a
            href="javascript:void(0)"
            className="/40 hover:text-pink-500/90"
          >
            Forgot password?
          </a>
        </div> */}
      </div>
    </main>
  );
}



            