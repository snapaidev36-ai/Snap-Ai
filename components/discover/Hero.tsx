"use client";

import { useState } from "react";
import Image from "next/image";

const galleryImages: string[] = [
  "https://picsum.photos/300/400?1",
  "https://picsum.photos/300/400?2",
  "https://picsum.photos/300/400?3",
  "https://picsum.photos/300/400?4",
  "https://picsum.photos/300/400?5",
  "https://picsum.photos/300/400?6",
];

const Hero: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async (url: string) => {
    setLoading(true);
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.jpg";
    link.click();
    setLoading(false);
  };

  return (
    <div className="w-full pt-20 px-4 md:px-8">
      {/* HERO */}
      <section>
        <div className="max-w-[1100px] mx-auto">
          <div className=" text-start lg:text-left">
            <h1 className="font-bold text-3xl lg:text-4xl xl:text-[3.5rem] leading-tight">
              Unlock the World of AI
            </h1>

            <p className="mt-4 text-gray-500">
              Explore an endless gallery of AI-generated images and ideas.
            </p>

            <button className="h-12 bg-green-500 hover:opacity-90 text-white rounded-full w-[180px] font-bold mt-6">
              Start Discovering
            </button>
          </div>
        </div>

        <Image
          src="/discover/discover-hero.jpg"
          width={1200}
          height={600}
          alt="Hero"
          className="mt-[-100px] mx-10 rounded-xl"
        />
      </section>

      {/* STEPS */}
      <section className="mt-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold">
            One Platform to Create Anything
          </h2>
          <p className="text-gray-500 mt-2">
            From idea to reality in three simple steps
          </p>
        </div>

        {/* <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1100px] mx-auto">
          {[
            {
              title: "Generate Your Idea",
              desc: "Let AI turn your vision into reality.",
              img: "https://picsum.photos/300/200?1",
            },
            {
              title: "Customize Output",
              desc: "Adjust styles and refine your results.",
              img: "https://picsum.photos/300/200?2",
            },
            {
              title: "Download & Share",
              desc: "Download high-quality images instantly.",
              img: "https://picsum.photos/300/200?3",
            },
          ].map((item, i) => (
            <div key={i} className="bg-gray-100 p-4 rounded-3xl">
              <h3 className="font-bold text-xl mb-2">{item.title}</h3>
              <p className="mb-4 text-gray-600">{item.desc}</p>
              <Image src={item.img} width={300} height={200} alt="" />
            </div>
          ))}
        </div> */}
      </section>

      {/* GALLERY */}
      <section className="mt-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold">Explore Gallery</h2>
          <p className="text-gray-500 mt-2">Discover AI-generated creations</p>
        </div>

        {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-5 max-w-[1100px] mx-auto">
          {galleryImages.map((img, index) => (
            <div key={index} className="relative h-[250px]">
              <Image
                src={img}
                alt=""
                fill
                className="rounded-2xl object-cover"
              />

              <button
                onClick={() => handleDownload(img)}
                disabled={loading}
                className="absolute right-3 top-3 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50"
              >
                ⬇
              </button>
            </div>
          ))}
        </div> */}
      </section>
    </div>
  );
};

export default Hero;
