import React, { useRef, useState, useEffect } from "react";
import { FaTrash, FaSave, FaPencilAlt, FaPalette } from "react-icons/fa";

// const tileset = "https://i.ibb.co/0VfS7bH/whiteboard-bg.png";

const CollaborativeBoard = ({ socket, roomId }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(4);
  const [brushColor, setBrushColor] = useState("#000000");
// Extract stable references as socket is object and dependency array expect stable values
  const socketId = socket; 
  const docId = roomId;
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth * 0.85;
    canvas.height = window.innerHeight * 0.7;
    canvas.style.cursor = "crosshair";
    context.lineCap = "round";
    contextRef.current = context;

    socket.emit("join-doc", roomId);

    socket.on("load-doc", (dataUrl) => {
      if (dataUrl) restoreCanvas(dataUrl);
    });

    socket.on("update-doc", (dataUrl) => {
      restoreCanvas(dataUrl);
    });

    return () => {
      socket.off("load-doc");
      socket.off("update-doc");
    };
  }, [[socketId, docId]]);

  useEffect(() => {
    contextRef.current.strokeStyle = brushColor;
    contextRef.current.lineWidth = brushSize;
  }, [brushSize, brushColor]);

  const sendUpdate = () => {
    const dataUrl = canvasRef.current.toDataURL();
    socket.emit("edit-doc", { content: dataUrl, docId: roomId });
  };

  const restoreCanvas = (imageData) => {
    const image = new Image();
    image.src = imageData;
    image.onload = () => {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      contextRef.current.drawImage(image, 0, 0);
    };
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    contextRef.current.closePath();
    setIsDrawing(false);
    sendUpdate();
  };

  const clearCanvas = () => {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    sendUpdate();
  };

  const saveDrawing = () => {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-start p-8"
      style={{
        background: `linear-gradient(rgba(196, 214, 229, 1), white))`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1
        className="text-4xl font-extrabold mb-4 tracking-wide"
        style={{
          fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
          color: "#007BAC",
        }}
      >
        The Idea Canvas
      </h1>

      <div className="flex items-center space-x-6 bg-gradient-to-r from-blue-300 to-blue-300 p-4 rounded-2xl shadow-xl mb-6 backdrop-blur-lg">
        <button
          onClick={clearCanvas}
          className="flex items-center gap-2 p-2 text-white hover:bg-red-400 rounded-lg transition-transform transform hover:scale-110"
        >
          <FaTrash /> Clear
        </button>
        <button
          onClick={saveDrawing}
          className="flex items-center gap-2 p-2 text-white hover:bg-green-400 rounded-lg transition-transform transform hover:scale-110"
        >
          <FaSave /> Save
        </button>

        <label className="flex items-center gap-2 text-white">
          <FaPencilAlt /> Brush:
          <input
            type="range"
            min="2"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(e.target.value)}
            className="cursor-pointer"
          />
        </label>

        <label className="flex items-center gap-2 text-white">
          <FaPalette /> Color:
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            className="cursor-pointer bg-transparent"
          />
        </label>
      </div>

      <div className="rounded-lg overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          className="bg-white rounded-lg"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />
      </div>
    </div>
  );
};

export default CollaborativeBoard;
