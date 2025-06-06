import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export function Draggable({ id, children, isDisabled }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      disabled: isDisabled,
    });

  const style = {
    transition: transform ? "transform 50ms ease" : undefined,
    opacity: isDragging ? 0.6 : 1, // Hide original during drag
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="draggable-item" // Add your grid item class here
    >
      {children}
    </div>
  );
}
