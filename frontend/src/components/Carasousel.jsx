import { useState } from "react";

function Carousel() {
  const images = [
    "/Group 2.png",
    "/Group 3.png",
    "/Group 4.png",
    "/Group 5.png",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  function nextImage() {
    setCurrentImage((currentImage + 1) % images.length);
  }

  function previousImage() {
    setCurrentImage(
      (currentImage - 1 + images.length) % images.length
    );
  }

  return (
    <section className="relative w-full h-full">
      <img
        src={images[currentImage]}
        alt="Food"
        className="w-[550px] h-auto object-cover mx-auto"
      />

      <button
        type="button"
        onClick={previousImage}
        className="absolute left-[20px] top-1/2 bg-black text-white px-[15px] py-[10px] rounded-full"
      >
        ←
      </button>

      <button
        type="button"
        onClick={nextImage}
        className="absolute right-[20px] top-1/2 bg-black text-white px-[15px] py-[10px] rounded-full"
      >
        →
      </button>
    </section>
  );
}

export default Carousel;