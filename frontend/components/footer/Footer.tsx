"use client";

import Link from "next/link";
import Image from "next/image";
import { socialLinks } from "@/constants";
import React from "react";

interface FooterProps {
  ImageTools?: { name: string }[];
}

const Footer: React.FC<FooterProps> = ({ ImageTools = [] }) => {
  const toolURL = (toolHref: string) =>
    toolHref?.toLowerCase().replaceAll("_", "-");

  const icons: { key: string; svg: React.ReactNode }[] = [
    {
      key: "facebook",
      svg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M6.32557 12.7824H8.95636V23.6129C8.95636 23.8267 9.12962 24 9.34346 24H13.8041C14.0179 24 14.1911 23.8267 14.1911 23.6129V12.8334H17.2155C17.4121 12.8334 17.5775 12.6859 17.6 12.4905L18.0593 8.50328C18.0719 8.39357 18.0372 8.28372 17.9638 8.20142C17.8903 8.11905 17.7852 8.0719 17.6749 8.0719H14.1913V5.57249C14.1913 4.81905 14.597 4.43698 15.3972 4.43698H17.6749C17.8887 4.43698 18.062 4.26364 18.062 4.04988V0.389961C18.062 0.176129 17.8887 0.00286452 17.6749 0.00286452H14.5359C13.8475 0 11.9543 0.106916 10.4589 1.48266C8.80199 3.0072 9.03231 4.83259 9.08735 5.14908V8.07182H6.32557C6.11174 8.07182 5.93848 8.24508 5.93848 8.45892V12.3952C5.93848 12.6091 6.11174 12.7824 6.32557 12.7824Z"
            fill="#1A1A1A"
          />
        </svg>
      ),
    },
    {
      key: "instagram",
      svg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M8.00064 12C8.00064 9.79094 9.79094 7.99968 12 7.99968C14.2091 7.99968 16.0003 9.79094 16.0003 12C16.0003 14.2091 14.2091 16.0003 12 16.0003C9.79094 16.0003 8.00064 14.2091 8.00064 12Z"
            fill="#1A1A1A"
          />
        </svg>
      ),
    },
    {
      key: "tiktok",
      svg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M19.3214 5.56219C19.1695 5.4837 19.0217 5.39765 18.8784 5.30437C18.4618 5.02896 18.0799 4.70445 17.7408 4.33781C16.8923 3.36703 16.5754 2.38219 16.4587 1.69266H12.5479V15.6928C12.4927 16.9386 12.3208 17.4566 12.0329 17.9107C11.7451 18.3648 11.35 18.7413 10.8825 19.0069C10.3952 19.2841 9.84414 19.4295 9.28357 19.4287C7.4831 19.4287 6.02388 17.9606 6.02388 16.1475C6.02388 14.3344 7.4831 12.8662 9.28357 12.8662C9.62439 12.8659 9.96311 12.9196 10.2872 13.0252L10.2918 9.09047C6.4047 9.59858 3.53457 11.9778 3.10591 12.7491C2.94279 13.0303 2.32732 14.1605 2.25279 15.9947C2.20591 17.0358 2.51857 18.1144 2.66763 18.5602C4.19409 21.0887 7.27076 23.3334 9.34497 23.25C9.70404 23.2355 10.9068 23.25 12.2728 22.6027C13.7878 21.885 14.6503 20.8158 14.6503 20.8158C16.2956 17.7436 16.4123 16.6411 16.4123 16.2005V8.27297C17.0836 8.71406 17.9831 9.29062 19.3865 9.66609C20.3934 9.93328 21.75 9.98953 21.75 9.98953V6.15328C21.2747 6.20484 20.3095 6.05484 19.3214 5.56219Z"
            fill="#1A1A1A"
          />
        </svg>
      ),
    },
  ];

  const paymentIcons: { key: string; icon: React.ReactNode }[] = [
    {
      key: "apple",
      icon: "/icons/ApplePay.svg",
    },
    {
      key: "mastercard",
      icon: "/icons/MasterCard.svg",
    },
  ];

  return (
    <div className="w-full theme:grey02BgClass">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-3 w-full border-b border-b-[#D8D8D8] pb-12">
          <div className="flex gap-16 xl:gap-32">
            <div>
              <h4 className="font-bold text-base lg:text-xl"></h4>
              <div className="flex flex-col gap-2 mt-4">
                {ImageTools.map((tool, index) => (
                  <Link
                    key={index}
                    href={`/dashboard/${toolURL(tool.name)}`}
                    className="text-base theme:lightText"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">{"Others"}</h4>
              <ul>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-base theme:lightText mb-2 block"
                  >
                    {"Terms of Service"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-base theme:lightText mb-2 block"
                  >
                    {"Privacy Policy"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-base lg:text-xl">{"Payment"}</h4>
            <div className="relative w-full max-w-[296px] mt-5 flex gap-4 flex-row">
              {paymentIcons.map(({ key, icon }) => (
                <span key={key}>
                  <Image
                    src={icon as string}
                    className="w-full"
                    width={296}
                    height={40}
                    alt="payment methods"
                  />
                </span>
              ))}
            </div>

            {Object.values(socialLinks || {}).some(Boolean) && (
              <>
                <div className="flex gap-2 mt-5">
                  {icons.map(({ key, svg }) => {
                    const link = socialLinks?.[key as keyof typeof socialLinks];
                    return typeof link === "string" && link ? (
                      <Link
                        key={key}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="theme:grey03BgClass rounded-full w-10 h-10 lg:w-12 lg:h-12 flex justify-center items-center"
                      >
                        {svg}
                      </Link>
                    ) : null;
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="text-center flex flex-col items-center gap lg:gap-3 py-6">
            <Image
              src={"/snap-logo-4.png"}
              width={100}
              height={100}
              alt="logo"
            />
            <small className="capitalize">{"Ai-Devs"}</small>
          </div>
          <div className="flex flex-col gap-3 justify-between items-center">
            <small className="flex justify-center flex-wrap gap-0.5">
              ©{"Operated By"}
              <span className="capitalize">{"Footer Text"}</span>
              <span className="ml-1">
                {"All rights reserved"} {new Date().getFullYear()}
              </span>
            </small>
            <ul className="flex flex-wrap gap-2 text-xs leading-none justify-center mt-1 lg:mt-0">
              <li>
                <Link href="#">{"Terms of Service"}</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
