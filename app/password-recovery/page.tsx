import Logo from "@/components/custom/logo";
import SingupMulti from "@/components/forms/singup";
import { TextAnimate } from "@/components/magicui/text-animate";
import PasswordRecoveryForm from "@/components/password-recovery-form/form";
import React from "react";

function page() {
  return (
    <div className="h-screen w-full z-80 bg-white absolute top-0   flex items-center justify-center flex-col gap-10 ">
      <div className="w-full h-full flex items-center justify-center ">
        <div className="w-1/3  gap-y-5 h-full flex items-start justify-center flex-col ">
        <div className=" flex justify-between items-start w-full ">
          <div className="space-y-1">
           
              <h2 className="text-4xl font-bold">Recupere sua conta</h2>
           
           <p className="text-muted-foreground text-sm my-2">Digite seu endereço de e-mail para receber um link para redefinir sua senha.</p>
          </div>
           <Logo />
        </div>
        <div className="w-full     flex items-start justify-center ">
         <PasswordRecoveryForm />
        </div>
      </div>
      </div>
    </div>
  );
}





export default page;
