import React from "react";
import { Ripple } from "../magicui/ripple";
import Logo from "./logo";

function FullPageLoad() {
  return (
    <div className="h-screen w-full  flex items-center justify-center absolute z-10 top-0 bg-white">
      <Ripple />
      <Logo />
    </div>
  );
}

export default FullPageLoad;
