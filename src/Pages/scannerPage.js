import React, { useState, useRef } from "react";
import "./scannerPage.css";
import { Link } from "react-router-dom";

export default function ScannerPage() {
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isImageCaptured, setIsImageCaptured] = useState(false);
  const [textractResult, setTextractResult] = useState(null);
  const [openaiResult, setOpenaiResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const videoRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type.startsWith("image/") || selectedFile.type === "application/pdf")) {
      setFile(selectedFile);
    } else {
      setErrorMessage("Please upload a valid image or PDF file.");
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    setErrorMessage(null);
    setTextractResult(null); // Reset previous results
    setOpenaiResult(null); // Reset previous results
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:5000/api/scan", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const result = await response.json();
      
      // Log the result to check the structure and values
      console.log("Scan result:", result);
  
      if (result && result.textractResult && result.openaiResult) {
        setTextractResult(result.textractResult);
        setOpenaiResult(result.openaiResult);
      } else {
        setErrorMessage("Invalid response from server");
      }
    } catch (error) {
      console.error("Error scanning file:", error);
      setErrorMessage("Failed to scan file. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };
  

  const openCamera = async () => {
    setErrorMessage(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setErrorMessage("Error accessing camera. Please ensure camera permissions are enabled.");
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraOpen(false);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL("image/jpeg");
    setFile(dataURLtoFile(imageDataURL, "camera_capture.jpg"));
    setIsImageCaptured(true);
    closeCamera();
  };

  const retakeImage = () => {
    setIsImageCaptured(false);
    openCamera();
  };

  const confirmImage = () => {
    handleScan(); // Call handleScan to upload the captured image
    setIsImageCaptured(false);
  };

  const dataURLtoFile = (dataURL, filename) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className={`Scanner-form-container ${isCameraOpen ? 'camera-open' : ''}`}>
      <form className="Scanner-form">
        <div className="Scanner-form-content">
          <h3 className="Scanner-form-title">Scan Your Receipt</h3>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {!isImageCaptured && (
            <div>
              {!isCameraOpen && (
                <div className="form-group mt-3">
                  <label htmlFor="file-upload">Upload a Photo or PDF</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="form-control mt-1"
                    id="file-upload"
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {!isCameraOpen && (
                <div className="d-grid gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleScan}
                    disabled={!file || isScanning}
                  >
                    {isScanning ? "Scanning..." : "Scan"}
                  </button>
                </div>
              )}

              {stream ? (
                <div>
                  {/* Video element to display the camera stream */}
                  <video ref={videoRef} id="camera-preview" autoPlay playsInline></video>
                  <div className="d-grid gap-2 mt-3">
                    <button type="button" className="btn btn-danger" onClick={closeCamera}>
                      Close Camera
                    </button>
                    <button type="button" className="btn btn-primary" onClick={captureImage}>
                      Capture Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="d-grid gap-2 mt-3">
                  <button type="button" className="btn btn-secondary" onClick={openCamera}>
                    Use Camera
                  </button>
                </div>
              )}
            </div>
          )}
          {isImageCaptured && (
            <div>
              <img src={URL.createObjectURL(file)} alt="Captured" />
              <div className="d-grid gap-2 mt-3">
                <button type="button" className="btn btn-danger" onClick={retakeImage}>
                  Retake
                </button>
                <button type="button" className="btn btn-primary" onClick={confirmImage}>
                  Confirm
                </button>
              </div>
            </div>
          )}
          {textractResult && openaiResult && (
            <div className="scan-result mt-3">
              <h4>Textract Scan Result:</h4>
              <p><strong>Invoice Date:</strong> {textractResult.invoiceDate}</p>
              <p><strong>Invoice Number:</strong> {textractResult.invoiceNumber}</p>
              <p><strong>Total Amount:</strong> {textractResult.totalAmount}</p>
              <p><strong>Classification:</strong> {textractResult.classification}</p>
    
              <h4>OpenAI Extraction Result:</h4>
              <p><strong>Invoice Date:</strong> {openaiResult["Invoice Date"]}</p>
              <p><strong>Invoice Number:</strong> {openaiResult["Invoice Number"]}</p>
              <p><strong>Total Amount:</strong> {openaiResult["Total Amount"]}</p>
              <p><strong>Classification:</strong> {openaiResult["Classification"]}</p>
            </div>
)}
          <div className="d-grid gap-2 mt-3">
            <Link to="/history" className="btn btn-info">
              View History
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
