import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function MyCamera() {
  const webcamRef = useRef(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [decodedTimestamp, setDecodedTimestamp] = useState(null);
  const [inputImageId, setInputImageId] = useState("");

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
      const base64Image = capturedImage.split(",")[1];

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

  const handleDecodeImage = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/get-image/${inputImageId}`);
      const base64Image = response.data.image;
      const decodedImage = `data:image/jpeg;base64,${base64Image}`;
      setDecodedTimestamp(response.data.timestamp);
      setCapturedImage(decodedImage);
    } catch (error) {
      console.error("Error decoding image:", error);
      window.alert("Error deleting image:", error);
    }
  };

  const handleDeleteImage = async () => {
    try {
      if (!inputImageId) {
        console.error("Image ID is null. Cannot delete.");
        return;
      }
  
      const response = await axios.delete(`http://localhost:8000/api/delete-image/${inputImageId}/`);
      console.log("Delete response:", response.data);
      setImageId(null);
      setCapturedImage(null);
      setDecodedTimestamp(null);
      setInputImageId("");
      window.alert("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      window.alert("Error deleting image. Please try again.");
    }
  };

  return (
    <div className="my-camera">
      <select onChange={handleCameraChange} className="camera-select">
        <option value={null}>Select Camera</option>
        <option value={"camera1"}>Camera 1</option>
        <option value={"camera2"}>Camera 2</option>
      </select>
      <br />
      <button onClick={isOpen ? handleCloseCapture : handleStartCapture} className="capture-button">
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
          <button onClick={handleCapture} className="capture-button">Snap</button>
        </>
      )}
      {capturedImage && (
        <div className="capture-container">
          <h2>Captured Image:</h2>
          <img src={capturedImage} alt="Captured" className="captured-image" />
          <br />
          <button onClick={handleSendToBackend} className="capture-button">Send to Backend</button>
        </div>
      )}
      {imageId && (
        <div>
          <h2>Image ID:</h2>
          <p>{imageId}</p>
        </div>
      )}
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Image ID"
          value={inputImageId}
          onChange={(e) => setInputImageId(e.target.value)}
          className="image-id-input"
        />
        <button onClick={handleDecodeImage} className="capture-button">Decode Image</button>
      </div>
      {decodedTimestamp && (
        <div>
          <h2>Decoded Timestamp:</h2>
          <p>{decodedTimestamp}</p>
        </div>
      )}
      <div>
        <button onClick={handleDeleteImage} className="capture-button">Delete Image</button>
      </div>
    </div>
  );
}

export default MyCamera;
