import { ChevronRight } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PasswordInput } from "./password-input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
import { request } from "@/lib/axiosRequest";
import { resetAllTokens, setAccessToken, setRefreshToken, useUserContext } from "@/context/ContextProvider";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),

});

export default function SignIn() {
  const { login } = useUserContext();

  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
   
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values);
  
      request({
        method: "POST",
        url: "login",
        data: values,
      })
        .then((res) => {
          console.log(res);
          resetAllTokens();
          setAccessToken(res.data.access);
          setRefreshToken(res.data.refresh);
          login();
          navigate("/dashboard");
        })
        .catch((err) => {
          console.log(err);
        });
    }

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
        <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 z-20"
            >
        <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-black font-geist">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your Email"
                          {...field}
                          className="w-full mt-2 px-3 py-5 text-black bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-lg"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-black font-geist">
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter your Password"
                          {...field}
                          className="w-full mt-2 px-3 py-5 text-black bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-lg"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
          <button className="w-full font-geist tracking-tighter text-center rounded-md bg-gradient-to-br from-blue-400 to-blue-700 px-4 py-2 text-lg text-zinc-50 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-gray-300 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-blue-500/70 flex items-center justify-center gap-2 mt-5" >
            Login
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
      </Form>
      </div>
    </main>
  );
}



            