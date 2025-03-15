import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [reset, setReset] = React.useState(false);
  const navigate = useNavigate();
  return (
    <main className="w-full min-h-screen flex overflow-y-hidden bg-white">
      <div className="relative flex-1 hidden items-center justify-center min-h-screen bg-transparent lg:flex">
        <div className="relative z-10 w-full max-w-lg">
          <img
            src="https://farmui.com/logo-dark.svg"
            width={100}
            className="rounded-full"
          />
          <div className=" mt-10 space-y-3">
            <h3 className="text-black text-3xl md:text-4xl lg:text-5xl font-normal font-geist tracking-tighter">
              Start growing your portfolio already.
            </h3>

            <Separator className="h-px bg-black/20 w-[100px] mr-auto" />
            <p className="text-gray-300 text-md md:text-xl font-geist tracking-tight">
              Create an account and enjoy your investments
            </p>
            <div className="flex items-center -space-x-2 overflow-hidden">
              <img
                src="https://randomuser.me/api/portraits/women/79.jpg"
                className="w-10 h-10 rounded-full border-2 border-black"
              />
              <img
                src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg"
                className="w-10 h-10 rounded-full border-2 border-black"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f"
                className="w-10 h-10 rounded-full border-2 border-black"
              />
              <img
                src="https://randomuser.me/api/portraits/men/86.jpg"
                className="w-10 h-10 rounded-full border-2 border-black"
              />
              <img
                src="https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e"
                className="w-10 h-10 rounded-full border-2 border-black"
              />
              <p className="text-sm text-gray-400 font-medium translate-x-5">
                Join 5.000+ users
              </p>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 my-auto h-full"
          style={
            {
              // background: "linear- gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)", filter: "blur(118px)"
            }
          }
        >
          <div className="absolute  inset-0 opacity-15  w-full bg-transparent  bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          <img
            className="absolute inset-x-0 -top-20 opacity-25 "
            src={
              "https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fhero-left.png&w=384&q=75"
            }
            width={1000}
            height={1000}
            alt="back bg"
          />
        </div>
      </div>
      <div className="flex-1 relative flex items-center justify-center min-h-full">
        <img
          className="absolute inset-x-0 -z-1 -top-20 opacity-75 "
          src={
            "https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fhero-left.png&w=384&q=75"
          }
          width={1000}
          height={1000}
          alt="back bg"
        />
        <div className="w-full max-w-md md:max-w-lg space-y-8 px-4  text-gray-600 sm:px-0 z-20">
          <div className="relative">
            <img
              src="https://farmui.com/logo.svg"
              width={100}
              className="lg:hidden rounded-full"
            />
            <div className="mt-5 space-y-2">
              <h3 className="text-black text-3xl  font-semibold tracking-tighter sm:text-4xl">
                Sign up - Start journey
              </h3>
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/auth/"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
         
          <form onSubmit={(e) => {e.preventDefault();navigate("/dashboard")}} className="space-y-5 z-20">
            <div>
              <label className="font-medium text-black font-geist">
                Name
              </label>
              <Input
                type="text"
                required
                className="w-full mt-2 px-3 py-5 text-black bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-lg"
              />
            </div>
            <div>
              <label className="font-medium text-black font-geist">
                Email
              </label>
              <Input
                type="email"
                required
                className="w-full mt-2 px-3 py-5 text-black bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-lg"
              />
            </div>
            <div>
              <label className="font-medium text-black font-geist">
                Password
              </label>
              <Input
                type="password"
                required
                className="w-full mt-2 px-3 py-5 text-black bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-lg"
              />
            </div>
            <button className="w-full font-geist tracking-tighter text-center rounded-md bg-gradient-to-br from-blue-400 to-blue-700 px-4 py-2 text-lg text-zinc-50 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-zinc-950 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-blue-500/70 flex items-center justify-center gap-2">
              Create account
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}




            