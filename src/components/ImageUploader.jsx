import { useRef, useState } from "react";
import { Upload, ImageUp, X } from "lucide-react";
import * as UTIF from "utif";

function ImageUploader({ image, setImage, setDetecting, detecting, setText }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFile = async (file) => {
    const isTiff =
      file.name.toLowerCase().endsWith(".tif") || file.type === "image/tiff";

    if (isTiff) {
      const buffer = await file.arrayBuffer();
      const ifds = UTIF.decode(buffer);
      UTIF.decodeImage(buffer, ifds[0]);
      const rgba = UTIF.toRGBA8(ifds[0]);

      const canvas = document.createElement("canvas");
      canvas.width = ifds[0].width;
      canvas.height = ifds[0].height;
      const ctx = canvas.getContext("2d");
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      imageData.data.set(rgba);
      ctx.putImageData(imageData, 0, 0);

      // แปลง canvas เป็น PNG blob
      canvas.toBlob((blob) => {
        const pngFile = new File(
          [blob],
          file.name.replace(/\.(tif|tiff)$/i, ".png"),
          { type: "image/png" }
        );
        setImage(pngFile);
        setPreview(URL.createObjectURL(pngFile));
        setDetecting(false);
      }, "image/png");
    } else {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setDetecting(false);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
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
      handleFile(files[0]);
    }
  };

  return image ? (
    <div className="relative">
      <img
        src={preview}
        alt="Selected"
        className="max-h-120 h-auto object-contain rounded-md shadow-md"
      />
      <button
        className="absolute top-1 right-1 text-white bg-red-400 hover:bg-red-500 rounded-md p-1.5 cursor-pointer"
        onClick={() => {
          setImage(null);
          setText(null);
          if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
          }
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
        accept="image/*,.tif,.tiff"
        onChange={handleChange}
      />
    </div>
  );
}

export default ImageUploader;
