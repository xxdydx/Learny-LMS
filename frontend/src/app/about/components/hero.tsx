import ModalVideo from "./modal-video";

export default function Hero() {
  return (
    <section className="relative bg-bg">
      {/* Illustration behind hero content */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <h1
              className="text-7xl md:text-8xl font-extrabold text-white leading-tighter tracking-tighter mb-4"
              data-aos="zoom-y-out"
            >
              Online learning, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400">
                simplified.
              </span>
            </h1>
            <div className="max-w-3xl mx-auto">
              <p
                className="text-xl text-text mb-8"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                Put an end to the hassles of content distribution and student
                feedback loops with Learny.
              </p>
              <div
                className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center"
                data-aos="zoom-y-out"
                data-aos-delay="300"
              >
                <div>
                  <a
                    href="#"
                    className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-crimson-9 hover:bg-darkerpink"
                  >
                    Register for private beta
                    <svg
                      className="ml-2 -mr-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
