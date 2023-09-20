import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Margin } from "@mui/icons-material";
// ... Other imports ...

const Products = () => {
  // ... Existing state and functions ...

  // New state for the notice
  const [notice, setNotice] = useState("");
  const [recipient, setRecipient] = useState(""); // Email or ID of the recipient

  // Function to send a notice
  const handleSendNotice = async () => {
    try {
      if (!recipient || !notice) {
        toast.error("Please fill in recipient and notice fields.");
        return;
      }
  
      // Query Firestore to find the user by email or numeric ID
      const usersRef = collection(db, "users");
      let userQuerySnapshot;
  
      // Check if the recipient is a valid number (numeric ID)
      const recipientAsNumber = parseInt(recipient);
      if (!isNaN(recipientAsNumber)) {
        userQuerySnapshot = await getDocs(
          query(usersRef, where("id", "==", recipientAsNumber))
        );
      } else {
        userQuerySnapshot = await getDocs(
          query(usersRef, where("email", "==", recipient))
        );
      }
  
      if (userQuerySnapshot.empty) {
        toast.error("User not found");
        return;
      }
  
      // Assuming only one user matches the query
      const userDoc = userQuerySnapshot.docs[0];
  
      // Send the notice to the user by updating their document
      await updateDoc(userDoc.ref, {
        latestNotice: {
          message: notice,
          timestamp: Date.now(),
        },
      });
  
      toast.success("Notice sent successfully");
      setNotice(""); // Clear the notice input
    } catch (error) {
      console.error("Error sending notice:", error);
      toast.error("Error sending notice");
    }
  };
  
  
  // ... Existing code ...

  return (
    <div className="datatable">
    {/* ... Existing code ... */}
    <div className="notice-section" >
      <h2 style={{margin: "16px"}}>Send Notice</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TextField
          variant="outlined"
          label="Recipient (Email or ID)"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          style={{ marginBottom: "16px",width: "50%" }}
        />
        <TextField
        
          variant="outlined"
          label="Notice Message"
          multiline
          rows={4}
          value={notice}
          onChange={(e) => setNotice(e.target.value)}
          style={{ marginBottom: "16px" ,width: "50%"}}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendNotice}
          style={{ marginBottom: "16px" ,width: "50%"}}
        >
          Send Notice
        </Button>
      </div>
    </div>
    {/* ... Existing code ... */}
  </div>

  );
};

export default Products;