import SingupMulti from "@/components/forms/singup";
import { TextAnimate } from "@/components/magicui/text-animate";
import React from "react";

function page() {
  return (
    <div className="h-screen w-full z-80 bg-white absolute top-0   flex items-center justify-center flex-col gap-10 ">
      <div className="w-1/3 gap-y-5 h-full flex items-start justify-center flex-col ">
        <div className=" flex justify-start items-start ">
          <div className="space-y-3">
            <TextAnimate
              animation="fadeIn"
              by="line"
              as="p"
              className="text-5xl font-bold"
            >
              Crie sua conta
            </TextAnimate>
            <TextAnimate
              className="text-lg font-semibold text-muted-foreground"
              animation="fadeIn"
              by="line"
              as="p"
              delay={0.2}
            >
              Preencha os campos e pronto!
            </TextAnimate>
          </div>
        </div>
        <div className="w-full     flex items-start justify-center ">
          <SingupMulti />
        </div>
      </div>
    </div>
  );
}

export default page;
