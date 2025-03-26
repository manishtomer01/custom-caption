import React, { useEffect, useState, useRef, useCallback } from "react";
import { fabric } from "fabric";
import { useLocation } from "react-router-dom";

export const AddCaptionPage = () => {
  const [canvas, setCanvas] = useState(null);
  const location = useLocation();
  const imageUrl = location.state?.imageUrl;
  const canvasRef = useRef(null);
  const [textInput, setTextInput] = useState("Your Text");
  const [error, setError] = useState(null); // State for error handling

  // Initialize Fabric Canvas
  useEffect(() => {
    if (imageUrl && canvasRef.current) {
      try {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
          preserveObjectStacking: true,
          height: 600,
          width: 600,
        });

        // Use a proxy to avoid CORS issues, or ensure your server sends correct headers
        const img = new Image();
        img.crossOrigin = "anonymous"; // Important: Request with CORS
        img.onload = () => {
          const fabricImage = new fabric.Image(img);

          // Scale image to fit canvas
          const imgWidth = fabricImage.width || 1;
          const imgHeight = fabricImage.height || 1;
          const canvasWidth = fabricCanvas.width || 1;
          const scale = Math.min(
            canvasWidth / imgWidth,
            canvasWidth / imgHeight
          );
          fabricImage.scale(scale);

          // Center the image
          fabricImage.set({
            left: (canvasWidth - fabricImage.getScaledWidth()) / 2,
            top: (canvasWidth - fabricImage.getScaledHeight()) / 2,
          });

          fabricCanvas.setBackgroundImage(
            fabricImage,
            fabricCanvas.renderAll.bind(fabricCanvas),
            {
              backgroundImageStretch: false,
            }
          );
          fabricCanvas.renderAll();
          setCanvas(fabricCanvas); // set canvas here
        };
        img.onerror = (err) => {
          setError("Error loading image: " + err.message);
        };
        img.src = imageUrl;

        // Cleanup
        return () => {
          if (fabricCanvas) {
            fabricCanvas.dispose();
          }
        };
      } catch (e) {
        setError("Error initializing canvas: " + e.message);
      }
    }
  }, [imageUrl]);

  // Add Text Function
  const addText = useCallback(() => {
    if (!canvas) {
      setError("Canvas not initialized.");
      return;
    }
    try {
      const text = new fabric.Text(textInput, {
        left: 50,
        top: 50,
        fontSize: 20,
        fill: "black",
        editable: true,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    } catch (e) {
      setError("Error adding text: " + e.message);
    }
  }, [canvas, textInput]);

  // Add Shape Function
  const addShape = useCallback(
    (shape) => {
      if (!canvas) {
        setError("Canvas not initialized.");
        return;
      }

      let shapeObj;
      try {
        switch (shape) {
          case "circle":
            shapeObj = new fabric.Circle({
              radius: 50,
              fill: "red",
              left: 50,
              top: 50,
            });
            break;
          case "rectangle":
            shapeObj = new fabric.Rect({
              width: 100,
              height: 50,
              fill: "blue",
              left: 50,
              top: 50,
            });
            break;
          case "triangle":
            shapeObj = new fabric.Triangle({
              width: 100,
              height: 100,
              fill: "green",
              left: 50,
              top: 50,
            });
            break;
          default:
            return;
        }
        canvas.add(shapeObj);
        canvas.setActiveObject(shapeObj);
        canvas.renderAll();
      } catch (e) {
        setError("Error adding shape: " + e.message);
      }
    },
    [canvas]
  );

  // Download Image Function
  const downloadImage = useCallback(() => {
    if (!canvas) {
      setError("Canvas not initialized.");
      return;
    }

    try {
      const dataURL = canvas.toDataURL({ format: "png" });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "edited_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      setError("Error downloading image: " + e.message);
    }
  }, [canvas]);

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <h1 className="text-4xl font-extrabāold text-gray-800 py-6 text-center bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
        Add Captionā
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div className="flex gap-12 w-full max-w-6xl">
          <div className="md:w-3/4 flex flex-col items-center">
            <canvas
              ref={canvasRef}
              // className="border border-gray-300 rounded-lg shadow-lg"
            ></canvas>
          </div>
          <div className="md:w-1/4 flex flex-col items-start justify-start">
            <div className="flex flex-col items-start gap-6 mb-10">
              <div className="flex flex-col items-start w-full">
                <label
                  htmlFor="text-input"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Text Input:
                </label>
                <input
                  id="text-input"
                  type="text"
                  value={textInput}
                  onChange={handleTextChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder="Enter Text"
                />
              </div>
              <button
                onClick={addText}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md py-3 transition duration-300 ease-in-out"
              >
                Add Text
              </button>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => addShape("circle")}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md py-3 transition duration-300 ease-in-out"
                >
                  Circle
                </button>
                <button
                  onClick={() => addShape("rectangle")}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md py-3 transition duration-300 ease-in-out"
                >
                  Rectangle
                </button>
                <button
                  onClick={() => addShape("triangle")}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg shadow-md py-3 transition duration-300 ease-in-out"
                >
                  Triangle
                </button>
              </div>
            </div>
            <button
              onClick={downloadImage}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md py-3 transition duration-300 ease-in-out mt-6"
            >
              Download
            </button>
          </div>
        </div>
        {error && (
          <p className="text-red-500 mt-6 text-center font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};

export default AddCaptionPage;
