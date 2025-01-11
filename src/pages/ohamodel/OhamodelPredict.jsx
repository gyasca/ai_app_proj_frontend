import React from 'react';
import ImageUploadForPrediction from '../../components/AI/ImageUploadForPrediction';

function OhamodelPredict() {
  // Define the label mappings here
  const labelMapping = {
    0: "Caries",
    1: "Gingivitis",
    2: "Tooth Discoloration",
    3: "Ulcer",
    // Add more class mappings as required for the model
  };

  return (
    <>
      <ImageUploadForPrediction 
        modelRoute={"/ohamodel/predict"} 
        labelMapping={labelMapping}  // Pass the labelMapping prop here
      />
    </>
  );
}

export default OhamodelPredict;
