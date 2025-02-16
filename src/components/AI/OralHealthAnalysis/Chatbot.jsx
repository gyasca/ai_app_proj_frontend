import React, { useState, useRef, useEffect } from "react";
import { Box, Paper, Typography, TextField, Button, Switch, FormControlLabel } from "@mui/material";
import http from "../../../http";
import { marked } from "marked";

const Chatbot = ({ singleOralResult, labelMapping, jwtUserId }) => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I am your HealthBuddy Oral Health Analysis Assistant! How may I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error handling
  const [oralResultsSummary, setOralResultsSummary] = useState(""); // Store formatted results summary
  const [includeHistory, setIncludeHistory] = useState(false); // Toggle to include past oral history
  const [oralHistory, setOralHistory] = useState([]);

  const fetchOralHistory = async (userId) => {
    setIsLoading(true);
    try {
      const response = await http.get("/history/oha/get-history", {
        params: { user_id: userId },
      });

      if (response.status === 200 && response.data.history.length === 0) {
        console.warn("No history records found");
        setOralHistory([]); // Ensure the UI still renders
        return;
      }

      console.log(response);

      setOralHistory(response.data.history); // Directly use the history data without bounding boxes
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.warn("No records found for this user.");
        setOralHistory([]); // Ensure an empty state is handled properly
      } else {
        setError("Failed to fetch oral health history");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchChange = () => {
    setIncludeHistory((prev) => {
      const newValue = !prev;
      if (newValue) {
        fetchOralHistory(jwtUserId);
      } else {
        setOralHistory([]); // Clear history when switch is off
      }
      return newValue;
    });
  };

  // Scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Trigger request automatically when singleOralResult updates
  useEffect(() => {
    if (singleOralResult && singleOralResult.length > 0) {
      const latestHistory = singleOralResult[singleOralResult.length - 1];

      // Format the prediction results
      const formattedResults = latestHistory.predictions
        .map((prediction) => {
          const condition =
            labelMapping[prediction.pred_class] || "Unknown Condition";
          const confidence = (prediction.confidence * 100).toFixed(2);
          return `${condition} (${confidence}%)`;
        })
        .join(", ");

      // Save the summary in state
      setOralResultsSummary(formattedResults);

      // Prepare the message for the chatbot
      const message = {
        text: `Detected conditions: ${formattedResults}. What do these results mean?`,
        sender: "user",
      };

      // Update chatbot with formatted results
      setMessages((prev) => [...prev, message]);

      // Send the request to the backend (first message)
      const fetchChatResponse = async () => {
        setIsLoading(true);
        setError(null); // Reset errors before calling the API

        try {
          const requestPayload = {
            instruction:
              "You are a helpful chatbot in an oral health analysis app. Based on images users upload of their mouth (teeth, gums, tongue, etc.), processed by a YOLOv8 object detection model, you will review the output from the model, which detects conditions like Caries, Gingivitis, Tooth Discoloration, and Ulcers. Your task is to provide explanations for these conditions, along with actionable recommendations to improve the user's oral health and suggest preventive measures. Remind users that this is an estimated diagnosis and recommend Singaporean dentists with links to their pages. If users ask for more details or medical advice, do provide them the advice as some of them are really low income and need the help. If you are concerned, you can clarify that this is just an AI app for estimated diagnoses and not to be taken as professional medical advice. Below are the results of the analysis: ",
            results: formattedResults,
            message: "What do these results mean?",
          };

          // Log the request payload to console before sending it
          console.log("Request Payload:", requestPayload);

          // Make the API call to get the chatbot response
          const response = await http.post("/ohamodel/chat", requestPayload);

          if (response.status === 200) {
            const botMessage = {
              text: response.data.response, // Assuming the response contains the message
              sender: "bot",
            };
            setMessages((prev) => [...prev, botMessage]);
          } else {
            setError("Error fetching chatbot response.");
          }
        } catch (error) {
          console.error("Error calling chatbot API:", error);
          setError("Error fetching chatbot response.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchChatResponse();
    }
  }, [singleOralResult]); // Trigger whenever singleOralResult

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newUserMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");

    // Now, we want to send the user's message to the model (subsequent requests)
    const fetchUserResponse = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Retrieve full chat history
        const context = messages
          .map((msg) => `${msg.sender}: ${msg.text}`)
          .join("\n");

        const requestPayload = {
          message: input,
          chat_history: context, // Send entire chat history
        };

        console.log("Request Payload:", requestPayload);

        const response = await http.post("/ohamodel/chat", requestPayload);

        if (response.status === 200) {
          setMessages((prev) => [
            ...prev,
            { text: response.data.response, sender: "bot" },
          ]);
        } else {
          setError("Error fetching chatbot response.");
        }
      } catch (error) {
        console.error("Error calling chatbot API:", error);
        setError("Error fetching chatbot response.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserResponse();
  };

  // Function to convert markdown into HTML
  const renderMarkdown = (markdownText) => {
    return { __html: marked(markdownText) };
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Oral Health Assistant
      </Typography>

      {/* Chat Window */}
      {/* Toggle to include past oral history */}
      <FormControlLabel
        control={
          <Switch
            checked={includeHistory}
            onChange={handleSwitchChange}
            color="primary"
          />
        }
        label="Include past oral history"
      />

      <Box
        sx={{
          height: 300,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          p: 1,
          borderRadius: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#1976d2" : "#e0e0e0",
              color: msg.sender === "user" ? "#fff" : "#000",
              p: 1.5,
              m: 0.5,
              borderRadius: 2,
              maxWidth: "70%",
            }}
          >
            {msg.sender === "bot" ? (
              // Render markdown as HTML for bot messages
              <span dangerouslySetInnerHTML={renderMarkdown(msg.text)} />
            ) : (
              msg.text
            )}
          </Box>
        ))}
        <div ref={chatEndRef} />
      </Box>

      {/* Error and Loading State */}
      {isLoading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {/* Input Field */}
      <Box sx={{ display: "flex", mt: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          sx={{ mr: 1 }}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default Chatbot;
