export const Home = () => {
  return (
    <>
      <div className="h-[calc(100vh-100px)] flex flex-col justify-center px-8">
        <div className="flex flex-col justify-center items-center md:w-[800px] mx-auto">
          <h1 className="text-4xl leading-tight text-blue-100 md:text-6xl md:text-center hover:animate-fadez">
            Financial Stability Starts with{" "}
            <span className="font-semibold bg-gradient-to-r from-blue-400 via-teal-500 via-60% to-blue-600 text-transparent bg-clip-text">
              Fixed Income Solutions
            </span>
          </h1>
          <p className="text-sm mt-4 md:text-xl md:mt-8 md:text-center bg-gradient-to-r from-zinc-400 via-teal-300 via-60% to-zinc-400 text-transparent bg-clip-text">
            Harness the power of funding rates and blockchain technology to
            generate predictable, steady income streams. Our solutions are
            designed to bring stability to your crypto investments.
          </p>
        </div>
        <div className="flex flex-col mt-12 gap-5 md:flex-row md:w-[80%] md:mx-auto">
          <div className="relative w-full md:w-1/2">
            <span className="absolute inset-0 rounded-full bg-teal-400 opacity-50 group-hover:opacity-100 blur"></span>
            <button className="relative w-full bg-gradient-to-r from-teal-400 via-teal-300  to-teal-400 text-teal-950 text-xl rounded-full py-2.5 px-12 cursor-pointer shadow shadow-main">
              Get Started
            </button>
          </div>
          <button className="relative w-full md:w-1/2 bg-transparent text-white  border-main/50 border text-xl rounded-full py-2.5 px-12 cursor-pointer">
            Learn More
          </button>
        </div>
      </div>
    </>
  )
}
