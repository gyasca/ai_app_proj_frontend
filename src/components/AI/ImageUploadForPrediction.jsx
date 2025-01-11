import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CircularProgress, Typography } from "@mui/material";
import http from '../../http';

const MAX_FILE_SIZE = 2048 * 2048; // 2MB

const ImageUploadForPrediction = ({ modelRoute, labelMapping }) => {
  const [uploading, setUploading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [finalImage, setFinalImage] = useState(null);  // To hold final image after drawing bounding boxes

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > MAX_FILE_SIZE) {
        setError("Maximum file size is 2MB");
        return;
      }

      // Validate MIME type
      const validMIMETypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validMIMETypes.includes(file.type)) {
        setError("Invalid file type. Please upload an image (JPEG, PNG, GIF).");
        return;
      }

      setUploading(true);
      setError(null);

      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);

      try {
        // Make API call for prediction based on the route
        const response = await http.post(`${modelRoute}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setPredictionResult(response.data); // Assuming API returns prediction data with bounding boxes
        console.log("Prediction result:", response.data);  // Log the prediction result to inspect its structure
      } catch (err) {
        setError("Prediction failed. Please try again.");
        console.error("Prediction error:", err);
      } finally {
        setUploading(false);
      }
    }
  }, [modelRoute]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png, image/gif",
    multiple: false,
    maxSize: MAX_FILE_SIZE,
  });

  const drawBoundingBoxes = (imageSrc, predictions) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      predictions.forEach((prediction) => {
        const { x_center, y_center, width, height, class: classIndex } = prediction;

        // Calculate the top-left corner of the bounding box
        const x = x_center - width / 2;
        const y = y_center - height / 2;

        // Draw the bounding box
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);

        // Get the label for the class index (dynamic based on passed prop)
        const label = labelMapping[classIndex] || "Unknown"; // Default to 'Unknown' if no label exists for the class

        // Draw the label near the bounding box
        ctx.font = "16px Arial";
        ctx.fillStyle = "red";
        ctx.fillText(label, x, y > 10 ? y - 10 : 10);  // Draw above the bounding box, adjust if near the top
      });

      // Set the final image with bounding boxes and labels
      setFinalImage(canvas.toDataURL());  // Save the final image to state
    };
  };

  // If prediction result is available, draw the bounding boxes on the image
  if (predictionResult && imagePreview) {
    drawBoundingBoxes(imagePreview, predictionResult.predictions);
  }

  return (
    <div>
      <div {...getRootProps()} style={{ border: "2px dashed #ccc", padding: "20px", textAlign: "center", cursor: "pointer" }}>
        <input {...getInputProps()} />
        {uploading ? (
          <CircularProgress />
        ) : (
          <Typography>Drag & drop an image, or click to select a file</Typography>
        )}
      </div>

      {error && <Typography color="error">{error}</Typography>}

      {imagePreview && (
        <div style={{ marginTop: "20px", maxWidth: "300px", borderRadius: "8px", overflow: "hidden" }}>
          <img
            src={imagePreview}
            alt="Uploaded preview"
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </div>
      )}

      {predictionResult && (
        <div>
          <Typography variant="h6">Prediction Result:</Typography>
          {predictionResult.predictions && predictionResult.predictions.length > 0 && (
            <ul>
              {predictionResult.predictions.map((prediction, index) => (
                <li key={index}>
                  Class: {prediction.class} - Confidence: {prediction.confidence.toFixed(2)}
                </li>
              ))}
            </ul>
          )}

          {/* Display final image with bounding boxes and labels */}
          <div>
            <Typography variant="body1">Detected Image with Bounding Boxes:</Typography>
            {finalImage && (
              <div style={{ marginTop: "20px", maxWidth: "300px", borderRadius: "8px", overflow: "hidden" }}>
                <img
                  src={finalImage}
                  alt="Prediction result with bounding boxes and labels"
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadForPrediction;
