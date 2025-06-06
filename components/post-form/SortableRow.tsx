import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableRow } from "../ui/table";
import { relative } from "path";

export const SortableTableRow = ({
  id,
  children,
  x,
}: {
  id: string;
  children: React.ReactNode;
  x?: React.CSSProperties; // Use proper CSSProperties type
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    ...x,
    transform: CSS.Transform.toString(transform),
    transition,

    relative,
    opacity: isDragging ? 0.2 : 1,
    border: "none",
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </TableRow>
  );
};
