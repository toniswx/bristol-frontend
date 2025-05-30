import { useEffect, useRef } from "react";
import { Input } from "../ui/input";

export function PriceFilter({ title }: { title: string }) {
  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);

  const formatCurrency = (value: string) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Convert to number and format as currency
    const number = parseFloat(digitsOnly) / 100;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const handleInputChange = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      const formattedValue = formatCurrency(ref.current.value);
      ref.current.value = formattedValue;
    }
  };

  useEffect(() => {
    const minInput = minRef.current;
    const maxInput = maxRef.current;

    const handleMinInput = () => handleInputChange(minRef);
    const handleMaxInput = () => handleInputChange(maxRef);

    minInput?.addEventListener("input", handleMinInput);
    maxInput?.addEventListener("input", handleMaxInput);

    return () => {
      minInput?.removeEventListener("input", handleMinInput);
      maxInput?.removeEventListener("input", handleMaxInput);
    };
  }, []);

  return (
    <div className=" space-y-3 w-full">
      <h2 className="text-sm font-semibold text-muted-foreground">{title}</h2>
      <div className="grid grid-cols-2 gap-x-2">
        <Input
          placeholder="Min"
          ref={minRef}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[0-9]*$/.test(value)) handleInputChange(minRef);
          }}
        />
        <Input
          placeholder="Max"
          ref={maxRef}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[0-9]*$/.test(value)) handleInputChange(maxRef);
          }}
        />
      </div>
    </div>
  );
}
