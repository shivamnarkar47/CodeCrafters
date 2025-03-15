import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PasswordInput } from "./password-input";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
import { Textarea } from "../ui/textarea";
import { request } from "@/lib/axiosRequest";
import { useUserContext } from "@/context/ContextProvider";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  phone: z.string().min(10),
  dob: z.string().min(6),
  address: z.string().min(5),
});

export default function SignUp() {
  const { login } = useUserContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState<string>("05:00");
  const [date, setDate] = useState<Date | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: "",
      dob: "",
      address: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    request({
      method: "POST",
      url: "register",
      data: values,
    })
      .then((res) => {
        console.log(res);
        login();
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <main className="w-full min-h-screen flex overflow-y-hidden bg-white">
      <div className="relative flex-1 hidden items-center justify-center min-h-screen dark:bg-black bg-transparent lg:flex">
        <div className="relative z-10 w-full max-w-lg">
          <img
            src="https://farmui.com/logo-dark.svg"
            width={100}
            className="rounded-full"
          />
          <div className=" mt-10 space-y-3">
            <h3 className="dark:text-white text-black text-3xl md:text-4xl  lg:text-5xl font-normal font-geist tracking-tighter">
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
        <div className="absolute inset-0 my-auto h-full">
          <div className="absolute  inset-0 opacity-15  w-full  bg-transparent  bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
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
      <div className="flex-1 relative flex items-center dark:bg-black  justify-center min-h-full">
        <img
          className="absolute inset-x-0 -z-1 -top-20 opacity-75 "
          src={
            "https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fhero-left.png&w=384&q=75"
          }
          width={1000}
          height={1000}
          alt="back bg"
        />
        <div className="w-full max-w-md md:max-w-lg space-y-8 px-4   text-gray-600 sm:px-0 z-20">
          <div className="relative">
            <img
              src="https://farmui.com/logo.svg"
              width={100}
              className="lg:hidden rounded-full"
            />
            <div className="mt-5 space-y-2">
              <h3 className="text-black text-3xl dark:text-white font-semibold tracking-tighter sm:text-4xl">
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
              <div className="flex flex-row  space-x-2 w-full    ">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel className="font-medium text-black font-geist">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your First Name"
                          {...field}
                          className="w-full mt-2 px-3 py-5 text-black bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-lg"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel className="font-medium text-black font-geist">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your Last Name"
                          {...field}
                          className="w-full mt-2 px-3 py-5 text-black bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-lg"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row  space-x-2 w-full    ">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Date</FormLabel>
                      <Input
                        placeholder="Enter your DOB"
                        {...field}
                        className="w-full mt-2 px-3 py-5 text-black bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-lg"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel className="font-medium text-black font-geist">
                        Phone
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your Phone No."
                          {...field}
                          className="w-full mt-1 px-3 py-5 text-black bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-lg"
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
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium dark:text-white text-black font-geist">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your Address"
                          {...field}
                          className="w-full mt-2 px-3 py-5 text-black bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-lg"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <button
                type="submit"
                className="w-full font-geist tracking-tighter text-center rounded-md bg-gradient-to-br from-blue-400 to-blue-700 px-4 py-2 text-lg text-zinc-50 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-zinc-950 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-blue-500/70 flex items-center justify-center gap-2"
              >
                Create account
              </button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
