import React from "react";
import Image from "next/image";
import { steps } from "@/constants";

const LandingPageSteps: React.FC = () => {
  return (
    <section className="w-full max-w-[1096px] mx-auto px-4 md:px-8 xl:px-0 py-8">
      <h2 className="mb-8 xl:mb-12 mt-0 font-bold text-2xl xl:text-[2rem] text-center">
        How to Create in 3 Easy Steps!
      </h2>

      <div className="grid grid-cols-12 w-full gap-4">
        {steps?.length ? (
          steps.map((step, index) => (
            <div
              key={index}
              className="bg-[var(--color-light-gray)] col-span-12 md:col-span-4 rounded-4xl"
            >
              <div className="p-5 flex flex-col min-[519px]:flex-row md:flex-col h-full gap-6">
                <div className="basis-1/2">
                  <div className="w-9 h-9 lg:h-12 lg:w-12 bg-[#e7e7e7]  rounded-full flex justify-center items-center text-base font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold mt-3 xl:mt-5 leading-tight">
                    {step.title}
                  </h3>
                  <p className="theme-lightText mt-2 lg:mt-3">
                    {step.description}
                  </p>
                </div>

                <div className="relative w-full basis-1/2 flex">
                  <Image
                    src={step.imageSrc}
                    className="w-full h-min self-end"
                    width={332}
                    height={155}
                    alt={`Step ${index + 1} illustration`}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-12 text-center text-gray-500">
            No steps to display.
          </p>
        )}
      </div>
    </section>
  );
};

export default LandingPageSteps;
