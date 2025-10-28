"use client";

import { navbarContent } from "@/config/content/navbar";
import { config } from "@/lib/config";
import Link from "next/link";
import { useEffect, useState } from "react";
import DownloadButton from "../common/download-button";

const Navbar = () => {
  const [hasCV, setHasCV] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if CV exists
        const cvResponse = await fetch(`${config.apiBaseUrl}/cv`);
        setHasCV(cvResponse.ok);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDownloadCV = () => {
    window.open(`${config.apiBaseUrl}/cv/download`, "_blank");
  };

  return (
    <div className="z-30 w-full bg-transparent p-1">
      <div className="relative flex w-full items-center justify-between p-1 sm:p-4">
        <Link href="/" className="group flex items-center">
          {navbarContent.logo}
        </Link>
        {hasCV && (
          <div className="absolute right-0 flex items-center gap-4 sm:w-[200px]">
            <button onClick={handleDownloadCV} className="">
              <DownloadButton text={navbarContent.cta.text} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
