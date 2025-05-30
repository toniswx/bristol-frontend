import { cn } from "@/lib/utils";
import * as React from "react";

export const CardRoot = React.forwardRef<HTMLDivElement, CardRootProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-md border w-fit flex items-center justify-center flex-col  px-5 py-3",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

export const CardHeader = React.forwardRef<HTMLDivElement, CardPrimitiveProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "items-start justify-between flex w-full mx-3",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  CardPrimitiveProps
>(({ className, children }, ref) => {
  return (
    <h2 ref={ref} className={cn("w-full font-semibold ", className)}>
      {children}
    </h2>
  );
});

export const CardIcon = ({
  className,
  children,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("top-[6px] relative ", className)} {...props}>
      {children}
    </div>
  );
};

export const CardBody = React.forwardRef<HTMLDivElement, CardPrimitiveProps>(
  ({ className, children }, ref) => {
    return (
      <div className={cn("w-full", className)} ref={ref}>
        {children}
      </div>
    );
  }
);
export const CardContent = React.forwardRef<HTMLDivElement, CardPrimitiveProps>(
  ({ className, children }, ref) => {
    return (
      <div className={cn("w-full", className)} ref={ref}>
        {children}
      </div>
    );
  }
);

export type CardRootProps = {
  className?: string;
  children: React.ReactNode;
};

export type CardPrimitiveProps = {
  className?: string;
  children: React.ReactNode;
};

CardBody.displayName = "CardBody";
CardContent.displayName = "CardContent";
CardHeader.displayName = "CardHeader";
CardIcon.displayName = "CardIcon";
CardTitle.displayName = "CardTitle";

CardRoot.displayName = "CardRoot";
