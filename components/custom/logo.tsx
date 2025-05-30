import Image from "next/image";
import React from "react";

function Logo() {
  return (
    <div>
      <Image
        src={
          "https://cdn.prod.website-files.com/61ed56ae9da9fd7e0ef0a967/6560610977eaf02b908e5389_Bristol-colored.svg"
        }
        alt="Bern logo"
        width={140}
        height={160}
        className=" "
      />
    </div>
  );
}

export default Logo;
