import React from "react";
import { Ripple } from "../magicui/ripple";
import Logo from "./logo";

function FullPageLoad() {
  return (
    <div className="h-screen w-full  flex items-center justify-center absolute z-50 top-0 bg-neutral-300 left-0">
      <Ripple />
      <Logo  />
    </div>
  );
}

export default FullPageLoad;
