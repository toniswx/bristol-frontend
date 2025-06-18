import Logo from "@/components/custom/logo";
import SingupMulti from "@/components/forms/singup";
import { TextAnimate } from "@/components/magicui/text-animate";
import React from "react";

function page() {
  return (
    <div className="h-screen w-full z-80 bg-white absolute top-0   flex items-center justify-center flex-col gap-10 ">
      <div className="w-full h-full flex items-center justify-center ">
        <div className="w-9/12 gap-y-5 h-full flex items-start justify-center flex-col ">
        <div className=" flex justify-between items-start w-full ">
          <div className="space-y-1">
            <TextAnimate
              animation="fadeIn"
              by="line"
              as="p"
              className="text-4xl font-bold"
            >
              Crie sua conta
            </TextAnimate>
            <TextAnimate
              className="text-sm font-semibold text-muted-foreground"
              animation="fadeIn"
              by="line"
              as="p"
              delay={0.2}
            >
              Preencha os campos para começar a anunciar de graça !
            </TextAnimate>
          </div>
           <Logo />
        </div>
        <div className="w-full   flex items-start justify-center ">
          <SingupMulti />
        </div>
      </div>
      </div>
    </div>
  );
}

export default page;
