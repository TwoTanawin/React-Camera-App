import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function MyCamerav2() {
  const webcamRef = useRef(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageId, setImageId] = useState(null);

  const handleStartCapture = () => {
    setIsOpen(true);
  };

  const handleCloseCapture = () => {
    setIsOpen(false);
  };

  const handleCameraChange = (event) => {
    setSelectedCamera(event.target.value);
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const handleSendToBackend = async () => {
    if (capturedImage) {
      const timestamp = new Date().toISOString();
      const base64Image = capturedImage.split(",")[1]; // Remove the base64 prefix

      try {
        const response = await axios.post("http://localhost:8000/api/receive-image/", {
          image: base64Image,
          timestamp: timestamp,
        });
        setImageId(response.data.id);
        console.log("Response from backend:", response.data);
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }
    } else {
      console.log("No image captured");
    }
  };

  return (
    <div className="my-camera">
      <select onChange={handleCameraChange}>
        <option value={null}>Select Camera</option>
        <option value={"camera1"}>Camera 1</option>
        <option value={"camera2"}>Camera 2</option>
        {/* Add more options for additional cameras */}
      </select>
      <br />
      <button onClick={isOpen ? handleCloseCapture : handleStartCapture}>
        {isOpen ? "Close Camera" : "Open Camera"}
      </button>
      {isOpen && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ deviceId: selectedCamera }}
            className="webcam-container"
          />
          <br />
          <button onClick={handleCapture}>Snap</button>
        </>
      )}
      {capturedImage && (
        <div>
          <h2>Captured Image:</h2>
          <img src={capturedImage} alt="Captured" />
          <br />
          <button onClick={handleSendToBackend}>Send to Backend</button>
        </div>
      )}
      {imageId && (
        <div>
          <h2>Image ID:</h2>
          <p>{imageId}</p>
        </div>
      )}
    </div>
  );
}

export default MyCamerav2;
