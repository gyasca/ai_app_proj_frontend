import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import http from "../../../http";

// Your drawBoundingBoxes logic
const drawBoundingBoxes = (imageSrc, predictions, labelMapping) => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageSrc;
  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      predictions.forEach((prediction, index) => {
        const { x_center, y_center, width, height, pred_class, confidence } =
          prediction;
        const x = x_center - width / 2;
        const y = y_center - height / 2;

        ctx.strokeStyle = "#39FF14";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);

        const label = labelMapping[pred_class] || "Unknown";
        const confidenceText = (confidence * 100).toFixed(1);

        ctx.font = "bold 16px Poppins";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(
          `Box ${index + 1} - ${confidenceText}% ${label}`,
          x,
          y > 20 ? y - 10 : y + height + 20
        );
      });

      resolve(canvas.toDataURL());
    };
  });
};

const OralHistory = ({ labelMapping, refreshTrigger, user }) => {
  const [oralHistory, setOralHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    console.log(user);
    if (user) {
      fetchOralHistory(user.userId);
    } else {
      setError("User not logged in");
      setIsLoading(false);
    }
  }, [refreshTrigger]);

  const fetchOralHistory = async (userId) => {
    try {
      const response = await http.get("/history/oha/get-history", {
        params: { user_id: userId },
      });

      const historyWithImages = await Promise.all(
        response.data.history.map(async (item) => {
          if (item.predictions) {
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
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch oral health history");
      setIsLoading(false);
    }
  };

  const handleDelete = async (ids) => {
    try {
      await Promise.all(
        ids.map((id) => http.delete(`/history/oha/delete-result`, {params: { id: id },}))
      );
      setOralHistory((prev) => prev.filter((item) => !ids.includes(item.id)));
      setSelectedRows([]);
    } catch (err) {
      console.error("Failed to delete records", err);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const columns = [
    { field: "analysis_date", headerName: "Date", width: 200 },
    { field: "condition_count", headerName: "Condition Count", width: 150 },
    { field: "user_id", headerName: "User ID", width: 120 },
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
              style={{ maxWidth: "50%", height: "50%", borderRadius: "8px" }}
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
          <IconButton onClick={() => console.log("View record")} size="small">
            <Visibility />
          </IconButton>
          <IconButton
            onClick={() => {
              setSelectedRows([params.row.id]);
              setDeleteDialogOpen(true);
            }}
            size="small"
          >
            <Delete />
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
            checkboxSelection
            onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row.id}
          />
        </Box>
      )}
      {selectedRows.length > 0 && (
        <Button
          variant="contained"
          color="error"
          startIcon={<Delete />}
          sx={{ mt: 2 }}
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete Selected
        </Button>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedRows.length} record(s)?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={() => handleDelete(selectedRows)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default OralHistory;
