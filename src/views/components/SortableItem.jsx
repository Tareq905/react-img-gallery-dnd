import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = (props) => {
  const { id, selected, image, index, handleImageSelection } = props;

  const sortable = useSortable({ id });
  const { attributes, listeners, setNodeRef, transform, transition } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const inlineStyle = {
    transformOrigin: "0 0",
    ...style,
  };

  const toggleSelected = () => {
    handleImageSelection(!selected, id);
  };

  return (
    <div
      className={`border rounded-lg ${
        index === 0 ? "col-span-2 row-span-2" : null
      }`}
    >
      <div
        ref={setNodeRef}
        style={inlineStyle}
        {...attributes}
        className={` relative group z-30 h-full`}
      >
        <div
          {...listeners}
          className="relative overflow-hidden rounded-xl h-full"
        >
          <img
            src={image}
            alt=""
            className={`h-full w-full ${selected ? "opacity-50" : ""}`}
          />
          <div
            className={`${
              selected
                ? ""
                : "h-80  w-80 bg-gray-800 opacity-0 group-hover:opacity-50 absolute top-0 duration-500"
            }`}
          ></div>
        </div>
        <input
          onChange={toggleSelected}
          type="checkbox"
          className={`absolute top-3 left-3 lg:opacity-0 lg:group-hover:opacity-100 z-50 ${
            selected ? "!opacity-100" : ""
          }`}
          checked={selected}
        />
      </div>
    </div>
  );
};

export default SortableItem;
