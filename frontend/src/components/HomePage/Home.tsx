"use client";
import { motion } from "motion/react";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";
import { ShimmerButtonDemo } from "../utilities/ShimmerButton";

const Home = () => {
  return (
    <>
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl relative px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        Investment butterflies: Transforming small savings into beauty
        at {" "}<br />
        <Highlight className="text-black dark:text-white">
          Chihuahua Investments.
        </Highlight>
      </motion.h1>
      <div className="flex w-full text-center justify-center pt-16 absolute">
        <a href="/auth">
          <ShimmerButtonDemo />
        </a>
      </div>
    </HeroHighlight>
    </>
  )
}

export default Home