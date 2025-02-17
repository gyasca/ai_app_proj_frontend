import React, { useState, useEffect } from "react";
import ImageUploadForPredictionGregory from "../../components/AI/OralHealthAnalysis/ImageUploadForPredictionGregory";
import OralHistory from "../../components/AI/OralHealthAnalysis/OralHistory";
import useUser from "../../context/useUser";
import Chatbot from "../../components/AI/OralHealthAnalysis/Chatbot";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Container,
} from "@mui/material";

function OhamodelPredict() {
  const [oralHistory, setOralHistory] = useState([]);
  const { user, jwtUser } = useUser();

  const labelMapping = {
    0: "Caries",
    1: "Gingivitis",
    2: "Tooth Discoloration",
    3: "Ulcer",
  };

  console.log("OhamodelPredict rendering with oralHistory:", oralHistory);

  // Modified to directly accept the prediction results
  const updateOralHistory = (newPrediction) => {
    console.log("updateOralHistory called with prediction:", newPrediction);

    if (newPrediction && newPrediction.predictions) {
      setOralHistory((prevHistory) => {
        const newHistory = [
          ...prevHistory,
          {
            timestamp: new Date().toISOString(),
            predictions: newPrediction.predictions,
          },
        ];
        console.log("Setting new oral history:", newHistory);
        return newHistory;
      });
    }
  };

  // Debug useEffect to monitor state changes
  useEffect(() => {
    console.log("oralHistory state updated:", oralHistory);
  }, [oralHistory]);

  return (
    <Container
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        mt: 2,
      }}
    >
      {/* Header Card - Full Width */}

      <Card className="shadow-sm hover:shadow-md transition-shadow" sx={{ mb: 2 }}>
        <CardContent className="p-6">
          <Box className="flex flex-col">
            <Typography variant="h5" className="font-semibold">
              Oral Analysis
            </Typography>
            <Typography variant="body2" color="textSecondary">
              AI-Powered Oral Condition Diagnosis
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <ImageUploadForPredictionGregory
        modelRoute={"/ohamodel/predict"}
        labelMapping={labelMapping}
        updateOralHistory={updateOralHistory}
      />
      <OralHistory
        refreshTrigger={oralHistory}
        labelMapping={labelMapping}
        jwtUserId={jwtUser()}
      />
      <Chatbot
        singleOralResult={oralHistory}
        labelMapping={labelMapping}
        jwtUserId={jwtUser()}
      />
    </Container>
  );
}

export default OhamodelPredict;
