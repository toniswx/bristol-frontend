import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Draggable } from "./draggable";
import { Droppable } from "./droppable";

export function Main() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const [items, setItems] = useState([
    { id: "item-1", name: "Item 1", col: "col-1" },
    { id: "item-2", name: "Item 2", col: "col-2" },
    { id: "item-3", name: "Item 3", col: "col-3" },
    { id: "item-4", name: "Item 4", col: "col-4" },
  ]);

  const [cols] = useState([
    { id: "col-1" },
    { id: "col-2" },
    { id: "col-3" },
    { id: "col-4" },
  ]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  function handleDragEnd({ over }) {
    if (over === null) return;
    const targetItem = items.filter((i) => i.id === activeId);
    const newArr = items.filter((i) => i.id !== activeId);
    const oldCol = targetItem[0].col;

    const swapItem = newArr.find((item) => item.col === over.id);

    if (!swapItem) return;

    swapItem.col = oldCol;

    targetItem[0].col = over.id;
    setItems((oldValue) => [...newArr, targetItem[0]]);
  }
  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      {cols.map((col) => {
        const columnItems = items.filter((item) => item.col === col.id);
        return (
          <div key={col.id}>
            <Droppable
              id={col.id}
              key={col.id}
              className="border min-h-64 min-w-64"
            >
              {columnItems.map((item) => (
                <Draggable key={item.id} id={item.id}>
                  {item.name}
                </Draggable>
              ))}
            </Droppable>
          </div>
        );
      })}
    </DndContext>
  );
}
