import React, { useState, useRef } from "react";
import "./scannerPage.css";

export default function ScannerPage() {
    const [file, setFile] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [stream, setStream] = useState(null); // State to store the camera stream
    const [isCameraOpen, setIsCameraOpen] = useState(false); // State to track camera open/close
    const [isImageCaptured, setIsImageCaptured] = useState(false); // State to track if an image is captured

    const videoRef = useRef(null); // Reference to the video element

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleScan = async () => {
        setIsScanning(true);
        try {
            // Implement the scanning logic here, e.g., sending the file to your backend
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch("http://localhost:3001/api/scan", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            console.log("Scan result:", result);
            // Handle the result of the scan
            setIsScanning(false);
        } catch (error) {
            console.error("There was an error scanning the file:", error);
            setIsScanning(false);
        }
    };

    const openCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream); // Set the camera stream to state
            // Set the camera stream as the source for the video element
            videoRef.current.srcObject = mediaStream;
            setIsCameraOpen(true); // Set camera open state
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    };

    const closeCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop()); // Stop the camera stream
            setStream(null); // Clear the camera stream from state
            setIsCameraOpen(false); // Set camera close state
        }
    };

    const captureImage = () => {
        const video = videoRef.current; // Access the video element using the useRef hook
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataURL = canvas.toDataURL("image/jpeg");
        setFile(dataURLtoFile(imageDataURL, "camera_capture.jpg"));
        setIsImageCaptured(true); // Set the flag to indicate that an image is captured
        closeCamera(); // Close the camera after capturing the image
    };

    const retakeImage = () => {
        setIsImageCaptured(false); // Reset the flag to indicate that no image is captured
        openCamera(); // Reopen the camera for capturing another image
    };

    const confirmImage = () => {
        // Submit the captured image to the backend or perform any other actions
        // Here you can replace the placeholder code with your actual backend request
        console.log("Submitting captured image:", file);
        // Reset states
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
                            <div className="form-group mt-3">
                                <label htmlFor="file-upload">Upload a Photo or PDF</label>
                                <input type="file" accept="image/*,application/pdf" className="form-control mt-1" id="file-upload" onChange={handleFileChange} />
                            </div>
                            <div className="d-grid gap-2 mt-3">
                                <button type="button" className="btn btn-primary" onClick={handleScan} disabled={!file || isScanning}>
                                    {isScanning ? "Scanning..." : "Scan"}
                                </button>
                            </div>
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
