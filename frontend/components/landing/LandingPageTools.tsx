"use client";
import React from "react";
import Image from "next/image";
import { sections } from "@/constants";
import { Button } from "../ui/button";

const LandingPageTools: React.FC = () => {
  return (
    <section className="w-full text-center mx-auto lg:px-0 space-y-12 py-8">
      {sections?.length ? (
        sections.map((section, index) => {
          const isReverse = section.imageOrder === "reverse";

          return (
            <div key={index} className="relative mb-12 md:mb-0">
              <div className="max-w-[1096px] mx-auto px-4 md:px-8">
                <div
                  className={`flex flex-col md:flex-row items-center gap-8 mb-10 md:mb-20 last:mb-0 ${
                    isReverse ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Text Content */}
                  <div
                    className={`w-full md:w-1/2 text-left ${
                      index === 1 ? "md:pl-16" : ""
                    }`}
                  >
                    <h2
                      className={`inline-block relative z-10 text-xl sm:text-2xl lg:text-[2rem] font-bold leading-8 md:leading-10 mb-3 ${
                        index === 0 || index === 2 ? "lg:w-[420px]" : ""
                      }`}
                    >
                      {section.title}
                    </h2>

                    <p className="font-normal text-base leading-relaxed theme-grayTextColor lg:w-[420px] mb-6 md:mb-12">
                      {section.description}
                    </p>

                    <Button
                      onClick={() => console.log("Navigate to")}
                      // className="h-12 px-6 rounded-full text-sm font-bold theme-greenBgClass min-w-40 hover:brightness-95 relative z-20 text-white"
                    >
                      {section.buttonText}
                    </Button>
                  </div>

                  {/* Image Content */}
                  <div className="w-full md:w-1/2 relative">
                    <Image
                      src={section.imageSrc}
                      alt={section.title}
                      width={500}
                      height={300}
                      className="w-full rounded-[30px] relative `z-[5]` order-1 md:order-2"
                    />

                    {/* Blurred Circle Background */}
                    <div
                      className={`absolute top-0 z-0 ${
                        index % 2 === 0
                          ? "right-full translate-x-1/2"
                          : "left-full -translate-x-1/2"
                      }`}
                    >
                      {/* <div className="w-[352px] h-[352px] bg-[#E6DDFD] theme-orangeBgClass rounded-full opacity-50 blur-[150px]" /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500">No tool sections available.</p>
      )}
    </section>
  );
};

export default LandingPageTools;
