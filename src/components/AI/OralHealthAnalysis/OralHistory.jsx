import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import http from "../../../http";
import useUser from "../../../context/useUser"; // Import the useUser hook
import { Visibility } from "@mui/icons-material";

// Your drawBoundingBoxes logic
const drawBoundingBoxes = (imageSrc, predictions, labelMapping) => {
  const img = new Image();
  img.crossOrigin = "anonymous"; // This enables cross-origin requests if the server allows it
  img.src = imageSrc;
  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      predictions.forEach((prediction, index) => {
        const {
          x_center,
          y_center,
          width,
          height,
          pred_class: classIndex,
          confidence,
        } = prediction;
        const x = x_center - width / 2;
        const y = y_center - height / 2;

        // Draw the bounding box
        ctx.strokeStyle = "#39FF14";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);

        const label = labelMapping[classIndex] || "Unknown";
        const confidenceText = (confidence * 100).toFixed(1);

        // Display label above or below the box
        const labelText = `Box ${index + 1} - ${confidenceText}% ${label}`;

        // Draw the label
        ctx.font = "bold 16px Poppins";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(labelText, x, y > 20 ? y - 10 : y + height + 20);
      });

      resolve(canvas.toDataURL());
    };
  });
};

const OralHistory = ({ labelMapping, refreshTrigger }) => {
  const [oralHistory, setOralHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userIdForOralHistory, setUserIdForOralHistory] = useState(null);

  const { user } = useUser(); // Get user data

  // Check if oralhistory has been updated (updates to this variable activates refreshTrigger)
  useEffect(() => {
    console.log("oralHistory has been updated and refresh has been triggered:", oralHistory);
  }, [refreshTrigger]); // This will run whenever oralHistory changes

  // Check if userId is available in localStorage or user context
  useEffect(() => {
    if (user) {
      console.log(user?.userId);
      setUserIdForOralHistory(user?.userId);
      fetchOralHistory(user?.userId); // Fetch history directly using the stored userId
    } else {
      setError("User not logged in");
      setIsLoading(false);
    }
  }, [refreshTrigger]);

  const fetchOralHistory = async (userId) => {
    try {
      const response = await http.get(`/history/oha/get-history`, {
        params: {
          user_id: userId, // Pass user_id as a query parameter
        },
      });

      const historyWithImages = await Promise.all(
        response.data.history.map(async (item) => {
          if (item.predictions) {
            // Pass labelMapping to drawBoundingBoxes
            const imageWithBoundingBoxes = await drawBoundingBoxes(
              item.original_image_path,
              item.predictions,
              labelMapping
            );
            return {
              ...item,
              image_with_bounding_boxes: imageWithBoundingBoxes,
            };
          }
          return item;
        })
      );

      setOralHistory(historyWithImages);
      console.log("Oral history updated:", historyWithImages);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch oral health history");
      setIsLoading(false);
    }
  };

  const columns = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "condition_count", headerName: "Condition Count", width: 200 },
    {
      field: "image_preview",
      headerName: "Image Preview",
      width: 300,
      renderCell: (params) => {
        const { image_with_bounding_boxes, original_image_path } = params.row;

        return (
          <Box sx={{ position: "relative", width: "100%", height: "auto" }}>
            <img
              src={image_with_bounding_boxes || original_image_path}
              alt="Oral Health"
              style={{
                maxWidth: "50%",
                height: "50%",
                borderRadius: "8px",
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => true} size="small">
            <Visibility />
          </IconButton>
        </>
      ),
    },
  ];

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Oral Health History
      </Typography>
      {oralHistory.length === 0 ? (
        <Typography>No history available.</Typography>
      ) : (
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={oralHistory}
            rowHeight={90}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row.id}
          />
        </Box>
      )}
    </Paper>
  );
};

export default OralHistory;
