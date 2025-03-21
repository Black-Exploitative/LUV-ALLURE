export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/videos/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-black" style={{ opacity: 0.3 }}></div>

      <a href='#' className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 text-white text-center flex flex-row gap-5 group">
        <h1 className="text-[20px] font-thin border-b-[3px] border-white pb-[5px] hover:border-0">E</h1>
        <h1 className="text-[20px] font-thin">X</h1>
        <h1 className="text-[20px] font-thin">P</h1>
        <h1 className="text-[20px] font-thin">L</h1>
        <h1 className="text-[20px] font-thin">O</h1>
        <h1 className="text-[20px] font-thin">R</h1>
        <h1 className="text-[20px] font-thin">E</h1>
        
        {/* This is the animated underline element */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white origin-left transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
      </a>
    </section>
  );
}
