import React from "react";
import { PriceFilter } from "./priceFilter";
import { Separator } from "../ui/separator";
import { CheckBoxOptions } from "./options-filter";

function Filter() {
  return (
    <div className=" space-y-2 w-full border p-2 rounded-md">
      <PriceFilter title="Preço" />
      <PriceFilter title="IPTU" />
      <PriceFilter title="Condomínio" />

      <CheckBoxOptions />
    </div>
  );
}

export default Filter;
