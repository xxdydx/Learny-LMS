import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative bg-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-crimson-9/30 via-black to-black"></div>

      {/* Floating shapes */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 blur-3xl opacity-10">
          <div className="aspect-[1200/800] w-[75rem] bg-gradient-to-br from-crimson-9 to-darkerpink"></div>
        </div>
        <div className="absolute left-0 bottom-0 translate-y-12 -translate-x-12 blur-3xl opacity-10">
          <div className="aspect-[1200/800] w-[75rem] bg-gradient-to-tr from-crimson-9 to-darkerpink"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="pt-32 pb-16 md:pt-52 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Overline text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-base md:text-lg font-medium text-gray-300 mb-6"
            >
              Welcome to the future of education
            </motion.p>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-8xl font-extrabold text-white leading-tight tracking-tight mb-8"
            >
              Online learning,{" "}
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400">
                simplified.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-400 mb-10"
            >
              Put an end to the hassles of content distribution and student
              feedback loops with Learny.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex justify-center space-x-4"
            >
              <a
                href="https://forms.gle/Uyhd6FhatW4BV4sm8"
                className="group inline-flex items-center px-8 py-4 text-base md:text-lg font-semibold text-white bg-crimson-9 hover:bg-darkerpink rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-crimson-9/25"
              >
                Register for private beta
                <svg
                  className="ml-2 -mr-1 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
