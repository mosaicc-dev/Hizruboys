import { useState } from "react";
import "./Garbage_Details.css";

const UploadModal = ({ isOpen, onClose, onUpload }) => {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    if (!isOpen) return null;

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(selectedFile);
        } else {
            alert("Please select an image file");
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith("image/")) {
            setFile(droppedFile);
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(droppedFile);
        } else {
            alert("Please select an image file");
        }
    };

    const handleUpload = () => {
        if (file) {
            onUpload(preview); // Update the profile image
            setPreview(null); // Reset preview after upload
            onClose(); // Close modal
        } else {
            alert("Please upload an image before confirming.");
        }
    };

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-upload" onClick={onClose}>&times;</span>
                <h2>Upload Photo</h2>
                <div
                    className="upload-area"
                    id="drop-area"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <p>Drag & drop your image here or</p>
                    <input type="file" id="fileInput" accept="image/*" hidden onChange={handleFileChange} />
                    <button onClick={() => document.getElementById("fileInput").click()}>Browse Files</button>
                    <div id="preview" className="image-preview">
                        {preview ? <img src={preview} alt="Preview" /> : <p>No image selected</p>}
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="confirm-btn" onClick={handleUpload}>Upload</button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
