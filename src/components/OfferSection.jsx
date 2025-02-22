import Button from "./Button";

export default function OfferSection() {
  return (
    <>
      <section className="py-16 mt-[90px]">
        {/* Section Heading */}
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-thin text-black mb-[103px]">
            HERE’S WHAT THE SEASON OFFERS
          </h2>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
          {/* Card 1 */}
          <div className="w-[280px] h-auto rounded-none overflow-hidden">
            <img
              src="/images/photo4.jpg"
              alt="Product"
              className="w-full h-80 object-cover"
            />

            <h3 className="text-xl font-medium text-black mt-3">
              Crimson Allure
            </h3>
          </div>

          {/* Card 2 */}
          <div className="w-[280px] h-auto rounded-none overflow-hidden">
            <img
              src="/images/photo5.jpg"
              alt="Product"
              className="w-full h-80 object-cover"
            />

            <h3 className="text-xl font-medium text-black mt-3">
              L’dact Allure
            </h3>
          </div>

          {/* Card 3 */}
          <div className="w-[280px] h-auto rounded-none overflow-hidden">
            <img
              src="/images/photo6.jpg"
              alt="Product"
              className="w-full h-80 object-cover"
            />

            <h3 className="text-xl font-medium text-black mt-3">
              Novo Amor Allure
            </h3>
          </div>

          {/* Card 4 */}
          <div className="w-[280px] h-auto rounded-none overflow-hidden">
            <img
              src="/images/man-wearing-blank-shirt.jpg"
              alt="Product"
              className="w-full h-80 object-cover"
            />

            <h3 className="text-xl font-medium text-black mt-3">
              Swivel Allure
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-0 max-w-7xl mx-auto mt-[162px]">
          {/* Rectangle 1 */}
          <div className="h-[800px] flex items-center justify-center">
            <img
              src="/images/photo1.jpg"
              alt="Rectangle 1"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Rectangle 2 */}
          <div className="h-[800px] flex items-center justify-center">
            <img
              src="/images/photo2.jpg"
              alt="Rectangle 2"
              className="w-full  h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="relative w-full h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/photo3.jpg"
            alt="Fashion Model"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="absolute inset-0 flex flex-col justify-end items-center z-10">
          <div className="mb-8">
          <Button href="#shop-now">SHOP NOW</Button>
          </div>
        </div>
      </section>

      <section className="w-full h-screen grid grid-cols-1 md:grid-cols-2 mt-[103px] mb-[162px]">
        {/* Left Image Section */}
        <div className="h-full pl-8">
          <img
            src="/images/photo4.jpg"
            alt="Left Side Image"
            className="w-full h-80vh object-cover"
          />
        </div>

        {/* Right Content Section */}
        <div className="flex items-center justify-center p-10 w-3x">
          <div className="text-center md:text-left max-w-lg">
            <h2 className="text-4xl mb-[40px]">
              We Share the Love of Valentine
            </h2>
            <p className="text-lg mb-[30px] text-center font-medium">
              As the lofty and flory presence of valentine ensumes the air and
              fills our heart. We bring you a subtlyty of blah blah blh ythis
              that that.
            </p>
            <p className="text-lg text-center ">Explore Collection</p>
            <hr className="my-2 w-[2ch] border-t border-black/50 text-center ml-[20.75ch] -mt-1" />
          </div>
        </div>
      </section>

      <section className="w-full py-16 mt-[462px]">
        <div className="max-w-7xl mx-auto px-4">
       
          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="flex flex-col items-center text-center">
              <img
                src="/images/photo11.jpg"
                alt="Card 1"
                className="w-full h-[400px] object-cover"
              />
              <h3 className="text-xl font-semibold mt-6">
              EXCLUSIVE PERSONAL SHOPPING
              </h3>
              <p className=" mt-2 text-sm text-[#5F6368]">
              Looking for something special that’s not in our collection? Share your vision, and we’ll find it or curate a perfect alternative just for you.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center text-center">
              <img
                src="/images/photo12.jpg"
                alt="Card 2"
                className="w-full h-[400px] object-cover"
              />
              <h3 className="text-xl font-semibold  mt-6">
              SIGNATURE STYLING SERVICE
              </h3>
              <p className="mt-2 text-sm text-[#5F6368]">
              From birthdays to galas, our expert stylists create personalized looks tailored to your unique style and any occasion.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center text-center">
              <img
                src="/images/photo13.jpg"
                alt="Card 3"
                className="w-full h-[400px] object-cover"
              />
              <h3 className="text-xl font-semibold mt-6">
              PERFECT FIT TAILORING
              </h3>
              <p className=" mt-2 text-sm text-[#5F6368]">
              Ensure every piece fits perfectly. Our tailoring service adjusts garments from our collection to match your exact measurements..
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
