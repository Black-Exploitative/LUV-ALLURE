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

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 text-white text-center">
        <h1 className="text-5xl  tracking-[.25em] font-[100]">EXPLORE</h1>
        <hr className="my-2 w-[4ch] border-t border-white/50" />
      </div>
    </section>
  );
}
