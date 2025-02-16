import React, { useState, useEffect } from "react";
import ImageUploadForPredictionGregory from "../../components/AI/OralHealthAnalysis/ImageUploadForPredictionGregory";
import OralHistory from "../../components/AI/OralHealthAnalysis/OralHistory";
import useUser from "../../context/useUser";
import Chatbot from "../../components/AI/OralHealthAnalysis/Chatbot";

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
    <>
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
    </>
  );
}

export default OhamodelPredict;
