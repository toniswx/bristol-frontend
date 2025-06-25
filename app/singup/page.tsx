import Logo from "@/components/custom/logo";
import SingupMulti from "@/components/forms/singup";
import { TextAnimate } from "@/components/magicui/text-animate";
import React from "react";

function page() {
  return (
    <div className="h-screen w-full z-80 bg-white absolute top-0   flex items-center justify-center flex-col gap-10 ">
      <div className="w-full h-full flex items-center justify-center  ">
        <div className="w-5/12 gap-y-5 h-full flex items-start justify-center flex-col  ">
        
        <div className="w-full   flex items-start justify-center ">
          <SingupMulti />
        </div>
      </div>
      </div>
    </div>
  );
}

export default page;
