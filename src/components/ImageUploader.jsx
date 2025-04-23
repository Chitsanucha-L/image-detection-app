import { useRef, useState } from "react";
import { Upload, ImageUp, X } from "lucide-react";

function ImageUploader({ image, setImage, setDetecting, detecting, setText }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setDetecting(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      setImage(files[0]);
      setDetecting(false);
    }
  };

  return image ? (
    <div className="relative">
      <img
        src={URL.createObjectURL(image)}
        alt="Selected"
        className="max-h-110 lg:min-h-80 md:min-h-65 min-h-50 object-contain rounded-md shadow-md"
      />
      <button
        className="absolute top-1 right-1 text-white bg-red-400 hover:bg-red-500 rounded-md p-1.5 cursor-pointer"
        onClick={() => {
          setImage(null);
          setText("");
        }}
        disabled={detecting}
      >
        <X size={22} />
      </button>
    </div>
  ) : (
    <div
      className={`flex flex-col items-center justify-center md:max-w-xl max-w-sm w-full p-9 border-2 border-dashed rounded-md shadow-sm mb-5 ${
        isDragging ? "border-gray-500 bg-gray-100" : "border-gray-400 bg-white"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <ImageUp className="text-gray-400" size={56} />
      <p className="text-gray-500 my-5">
        Drag and drop your image here, or click to select
      </p>
      <button
        className="font-medium text-gray-800 text-md flex items-center bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm py-2 px-3 cursor-pointer"
        onClick={handleClick}
      >
        <Upload className="mr-3" size={19} />
        Upload Image
      </button>
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
    </div>
  );
}

export default ImageUploader;
