"use client";
import React, { useState } from "react";

type Plan = {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  credits: number;
  isActive?: boolean;
};

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 10,
    yearlyPrice: 100,
    credits: 100,
  },
  {
    id: "standard",
    name: "Standard",
    price: 20,
    yearlyPrice: 200,
    credits: 300,
    isActive: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 50,
    yearlyPrice: 500,
    credits: 1000,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 100,
    yearlyPrice: 1000,
    credits: 5000,
  },
];

const Packages: React.FC = () => {
  const [subscriptionType, setSubscriptionType] = useState<
    "monthly" | "yearly"
  >("monthly");

  const handlePurchase = (plan: Plan) => {
    console.log("Purchased:", plan);
  };

  const renderPackageItem = (plan: Plan) => {
    const isActive = plan.isActive;

    return (
      <div
        key={plan.id}
        className={`py-8 px-5 rounded-4xl bg-gray-100 ${
          isActive ? "border-2 border-blue-500 bg-transparent" : ""
        }`}
      >
        <h2 className="text-lg text-center capitalize mb-4">{plan.name}</h2>

        {/* Price */}
        <div className="text-2xl font-bold mb-3">
          $
          {subscriptionType === "yearly" ? (
            <>
              <span> {plan.yearlyPrice}</span>
              <span className="text-base text-gray-500 font-normal">
                / year
              </span>
            </>
          ) : (
            <>
              <span> {plan.price}</span>
              <span className="text-base text-gray-500 font-normal">
                / month
              </span>
            </>
          )}
        </div>

        {/* Credits */}
        <p className="text-xl mb-5">{plan.credits} credits</p>

        {/* Buttons */}
        {isActive ? (
          <>
            <button
              className="h-12 bg-gray-300 text-gray-600 text-sm rounded-full w-full font-bold"
              disabled
            >
              Current Plan
            </button>
            <button className="text-red-500 mt-[18px]">Cancel Plan</button>
          </>
        ) : (
          <button
            onClick={() => handlePurchase(plan)}
            className="h-12 bg-[rgb(197_255_103/var(--tw-bg-opacity,1))] text-black text-sm rounded-full w-full font-bold hover:opacity-90"
          >
            Purchase
          </button>
        )}

        {/* Features */}
        <ul className={`mt-12 space-y-5 ${isActive ? "mt-3" : ""}`}>
          {[
            "Text to Image",
            "Image Upscaler",
            "Image Description",
            "Object Replacer",
          ].map((feature, i) => (
            <li key={i} className="flex text-left">
              <span className="mr-2">✔️</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section className="w-full max-w-[1100px] mx-auto text-center">
      {/* Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setSubscriptionType("monthly")}
          className={` py-2  rounded-[60px] w-20 ${
            subscriptionType === "monthly"
              ? "bg-[rgb(197_255_103/var(--tw-bg-opacity,1))] text-black text-center"
              : "bg-gray-200"
          }`}
        >
          Monthly
        </button>

        <button
          onClick={() => setSubscriptionType("yearly")}
          className={`px-4 ml-2 py-2 rounded-[60px] w-20 ${
            subscriptionType === "yearly"
              ? "bg-[rgb(197_255_103/var(--tw-bg-opacity,1))] text-black text-center"
              : "bg-gray-200"
          }`}
        >
          Yearly
        </button>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {plans.map(renderPackageItem)}
      </div>
    </section>
  );
};

export default Packages;
