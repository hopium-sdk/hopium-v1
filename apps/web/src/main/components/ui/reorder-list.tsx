"use client";
import { useSensors, useSensor, PointerSensor, KeyboardSensor, DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type T_ReorderList = {
  items: any[];
  setItems: (items: any[]) => void;
  handleReorder: ({ id, index }: { id: string; index: number }) => Promise<void>;
  id_key: string;
  children: React.ReactNode;
};

export const ReorderList = ({ items, setItems, handleReorder, id_key, children }: T_ReorderList) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item[id_key] === active.id);
      const newIndex = items.findIndex((item) => item[id_key] === over?.id);

      const newItems = arrayMove(items, oldIndex, newIndex);

      setItems(newItems);
      await handleReorder({ id: active.id as string, index: newIndex });
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item[id_key])} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};

export const ReorderListItem = ({
  item,
  id_key,
  handleClick,
  children,
}: {
  item: any;
  id_key: string;
  handleClick?: () => void;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id: item[id_key] });

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform) }} onClick={handleClick} {...listeners} {...attributes}>
      {children}
    </div>
  );
};
