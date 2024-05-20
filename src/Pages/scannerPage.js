import React, { useState, useRef } from "react";
import "./scannerPage.css";

export default function ScannerPage() {
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isImageCaptured, setIsImageCaptured] = useState(false);
  const videoRef = useRef(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:3001/api/scan", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log("Scan result:", result); 
    } catch (error) {
      console.error("Error scanning file:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
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
    console.log("Submitting captured image:", file);
    setFile(null);
    setIsImageCaptured(false);
  };

    // Function to convert data URL to file
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
                    {!isImageCaptured && (
                        <div>
                            {!isCameraOpen && (
                                <div className="form-group mt-3">
                                    <label htmlFor="file-upload">Upload a Photo or PDF</label>
                                    <input type="file" accept="image/*,application/pdf" className="form-control mt-1" id="file-upload" onChange={handleFileChange} />
                                </div>
                            )}

                            {!isCameraOpen && (
                                <div className="d-grid gap-2 mt-3">
                                    <button type="button" className="btn btn-primary" onClick={handleScan} disabled={!file || isScanning}>
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
                </div>
            </form>
        </div>
    );
}
