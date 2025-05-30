"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "./magicui/animated-list";
import { Loader2 } from "lucide-react";

interface Item {
  name: string;
  icon: string;
  color: string;
}

let notifications = [
  {
    name: "Criando anúncio",

    icon: "💸",
    color: "#00C9A7",
  },
  {
    name: "Salvando imagens",
    icon: "📷",
    color: "#FFB800",
  },
  {
    name: "Ativando notificações",
    icon: "💬",
    color: "#FF3D71",
  },
  {
    name: "Postando anúncio",
    icon: <Loader2 className="animate-spin transition-all" />,
    color: "#1E86FF",
  },
];

notifications = Array.from({ length: 1 }, () => notifications).flat();

const Notification = ({ name, icon, color }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
          </figcaption>
        </div>
      </div>
    </figure>
  );
};

export function NotificationPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] flex-col overflow-hidden p-2",
        className
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
}
