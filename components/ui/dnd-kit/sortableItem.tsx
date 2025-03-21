import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DnDItem } from "./item";

export function SortableItem({
  children,
  props,
}: {
  children?: React.ReactNode;
  props: { id: UniqueIdentifier };
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <DnDItem ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </DnDItem>
  );
}
