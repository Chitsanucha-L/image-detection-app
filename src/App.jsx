import { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import {
  Image,
  ScanSearch,
  X,
  TriangleAlert,
  CircleCheckBig,
  RotateCcw,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [text, setText] = useState(null);

  const handleDetect = async (e) => {
    e.preventDefault();
    if (!image) {
      return;
    }

    try {
      setDetecting(true);

      const formData = new FormData();
      formData.append("file", image);

      const response = await axios.post(
        "https://backend-ocr-qd5h.onrender.com/ocr",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setText(response.data.text);
      console.log(response.data.text);
      setDetecting(false);
      toast((t) => (
        <div className="relative flex-1 text-gray-800 text-[13px] px-1 py-2 group">
          <p className="flex items-center font-semibold text-green-600">
            <CircleCheckBig className="mr-1 mb-0.5" size={18} />
            Detection Complete
          </p>
          <p className="mt-2 text-gray-700">
            Image analysis has been completed successfully.
          </p>
          <button
            className="absolute top-1 right-1 hidden hover:block group-hover:block"
            onClick={() => toast.dismiss(t.id)}
          >
            <X size={16} />
          </button>
        </div>
      ));
    } catch (error) {
      console.error("Error:", error);
      setDetecting(false);
      toast((t) => (
        <div className="relative flex-1 text-gray-800 text-[13px] px-1 py-2 group">
          <p className="flex items-center font-semibold text-red-400">
            <TriangleAlert className="mr-1 mb-0.5" size={18} />
            Detection Incomplete
          </p>
          <p className="mt-2 text-gray-700">
            Image analysis hasn't been completed successfully.
          </p>
          <button
            className="absolute top-1 right-1 hidden hover:block group-hover:block"
            onClick={() => toast.dismiss(t.id)}
          >
            <X size={16} />
          </button>
        </div>
      ));
    }
  };

  return (
    <div className="font-thai min-h-screen min-w-screen bg-white flex flex-col items-center">
      <header className="w-full flex items-center text-[26px] text-gray-900 font-bold px-7 py-5 mb-14 border-b border-gray-300 shadow-md">
        <Image className="mr-3 mb-1" size={30} />
        Image Detection
      </header>
      <div className="lg:max-w-3xl md:max-w-2xl sm:max-w-xl max-w-sm w-full flex flex-col items-center overflow-auto">
        <Toaster position="top-right" />
        <ImageUploader
          image={image}
          setImage={setImage}
          setDetecting={setDetecting}
          detecting={detecting}
          setText={setText}
        />
        {image && !detecting && text == null && (
          <button
            className="font-medium text-md mt-10 flex items-center text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-md shadow-md cursor-pointer"
            onClick={handleDetect}
          >
            <ScanSearch className="mr-3" size={24} />
            Start Detection
          </button>
        )}
        {image && detecting && (
          <div className="flex items-center mt-10 mb-2 bg-gray-100 px-5 py-2.5 rounded-md shadow-md">
            <svg
              class="mr-3 -ml-1 size-5.5 animate-spin text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="font-medium text-md text-gray-900">
              Analyzing image...
            </p>
          </div>
        )}
        {image && !detecting && text != null && (
          <div className="w-full flex flex-nowrap lg:space-x-8 md:space-x-6 space-x-4 mt-10 mb-2">
            <div className="flex-1 flex items-center bg-gray-100 px-5 py-2.5 rounded-md shadow-md">
              <p className="font-medium text-md text-gray-900">
                ข้อความที่ได้: {text}
              </p>
            </div>
            <button
              className="self-start font-medium text-md flex items-center text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-md shadow-md cursor-pointer"
              onClick={handleDetect}
            >
              <RotateCcw className="mr-3" size={24} />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
