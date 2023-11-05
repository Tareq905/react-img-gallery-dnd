
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import download from "../../assets/images/download.png"
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../components/SortableItem";

function HomePage() {
  const [dataList, setDataList] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/Imran122/image-drag-drop-react-dndkit/main/imageData.json")
      .then((response) => response.json())
      .then((dataList) => {
        setDataList(dataList);
      })
      .catch((error) => {
        console.error("Error fetching dataList:", error);
      });
  }, []);

  //handle image selection
  const handleImageSelectionChange = (isSelected, imageId) => {
    setSelectedImages((prevSelected) => {
      if (isSelected) {
        return [...prevSelected, imageId];
      } else {
        return prevSelected.filter((image) => image !== imageId);
      }
    });
  };
  //handle unselect all pictures
  const handleUncheckAllData = () => {
    setSelectedImages([]);
    toast.error("All images DeSelected");
  };
  //handle delete pictures
  const handleDelete = () => {
    setDataList(dataList.filter((imgData) => !selectedImages.includes(imgData.id)));
    setSelectedImages([]);
    toast.error("Image Deleted succesfully");
  };
  //image upload
  const handleImageUpload = (event) => {
    const files = event.target.files;
    const newImageData = Array.from(files).map((file, index) => ({
      id: dataList.length + index + 1, // Generate a unique ID for image
      image: URL.createObjectURL(file),
    }));
    setDataList((prevData) => [...prevData, ...newImageData]);
    toast.success("Image uploaded succesfully");
  };

  // Handle drag and drop
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setDataList((items) => {
        const preIndex = items.findIndex((item) => item.id === active.id);
        const nextIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, preIndex, nextIndex);
      });
    }
  };

  return (
    <div className="bg-slate-400 ">
      <Toaster position="top-center"></Toaster>
      <div className="flex justify-center  lg:py-20 py-10 w-full">
        <div className="bg-slate-100 w-[550px] sm:w-[700px] lg:w-[900px]  h-full rounded-lg ">
          <div className="flex justify-between mx-5 py-4">
            {selectedImages.length > 0 ? (
              <h1 className="flex items-center font-bold">
                <span className="mr-2">
                  <input
                    type="checkbox"
                    checked={selectedImages.length > 0}
                    onChange={handleUncheckAllData}
                  />
                </span>{" "}
                <span className="mr-1">{selectedImages.length}</span>
                Files Selected
              </h1>
            ) : (
              <h1 className="font-semibold">Gallery</h1>
            )}

            {selectedImages.length > 0 && (
              <button
                onClick={handleDelete}
                className="text-red-600 font-bold text-xs"
              >
                {selectedImages.length > 1 ? (
                  <span>Delete files</span>
                ) : (
                  <span>Delete file</span>
                )}
              </button>
            )}
          </div>
          <hr />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={dataList} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-4">
                {dataList.map((imgData, index) => (
                  <SortableItem
                    key={imgData.id}
                    id={imgData.id}
                    image={imgData.image}
                    index={index}
                    handleImageSelection={handleImageSelectionChange}
                    selected={selectedImages.includes(imgData.id)}
                  />
                ))}
                <div className="w-auto h-auto border-2 border-dashed text-center">
                  <label className=" inset-0 cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                    <div className="flex flex-col items-center justify-center h-full  ">
                      <img
                        src={download}
                        alt=""
                        className="w-6 h-6 mb-3"
                      />
                      <p className="font-semibold text-xs lg:text-base">
                        Add Images
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
