"use client";

import Link from "next/link";
import Image from "next/image";
import Icons from "../icons/icons";
import { Button } from "../ui/button";

interface AiHeader2Props {
  togglemenu?: () => void;
  onClickOutside?: () => void;
}

const Header: React.FC<AiHeader2Props> = ({}) => {
  return (
    <>
      <div className="fixed z-50 lg:z-20 lg:relative bg-[#FAFAFA] lg:bg-transparent top-0 w-full flex items-center justify-between px-5 lg:px-8 py-4 lg:py-8">
        <div className="flex items-center gap-[88px]">
          <div className="flex items-center gap-3 col-span-3">
            <Button
              onClick={() => {
                console.log("Toggle menu");
              }}
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full bg-[#F1F1F1]"
            >
              <Image src={Icons.Menu} alt="Menu" width={24} height={24} />
            </Button>
            <Link href="#">
              <Image
                src={"/snap-logo-4.png"}
                alt="Logo"
                width={150}
                height={80}
                className="inline-block align-middle max-w-[100px] min-[375px]:max-w-none"
              />
            </Link>
          </div>

          <div className="col-span-6 hidden lg:block">
            <ul className="flex gap-12 justify-center font-semibold">
              <li>
                <Link href="#">{"Discover"}</Link>
              </li>
              <li>
                <Link href="#">{"Pricing"}</Link>
              </li>
              <li>
                <Link href="#">{"Blog"}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <div className="hidden lg:inline-block">
            {/* <LanguageSelector /> */}
          </div>

          <Button
            onClick={() => {
              console.log("Toggle menu");
            }}
            className="bg-[rgb(197_255_103/var(--tw-bg-opacity,1))] text-black"
          >
            {"Start now"}
          </Button>
        </div>
      </div>

      {/* <SidebarMobile
        isSidebarOpen={isSidebarOpen}
        toggleMobileSidebar={toggleMobileSidebar}
      /> */}
    </>
  );
};

export default Header;
