import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export function DroppableCustom(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    opacity: isOver ? 1 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={"h-full  bg-red-500"}>
      {props.children}
    </div>
  );
}
