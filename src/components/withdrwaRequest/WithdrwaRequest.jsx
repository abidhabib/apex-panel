import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "@mui/material";

const WithdrawRequest = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const withdrawalRef = collection(db, "withdrawals");
        const q = query(withdrawalRef, where("status", "==", "pending"));
        const querySnapshot = await getDocs(q);
        const withdrawals = [];
        querySnapshot.forEach((doc) => {
          withdrawals.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setData(withdrawals);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const formatFirestoreTimestamp = (timestamp) => {
    if (timestamp) {
      const date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
    return ""; // Return an empty string if timestamp is undefined
  };
  const updateStatus = async (id) => {
    try {
      const withdrawalRef = doc(db, "withdrawals", id);
      await updateDoc(withdrawalRef, {
        status: "approved",
        approvedTime: serverTimestamp(),
      });

      // Remove the approved row from the local data
      setData((prevData) => prevData.filter((item) => item.id !== id));

      // Show a toast using react-hot-toast
      toast.success("Status updated to Approved");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {field:'Account_Number',headerName:'Account Number',width:150},
    {field:'Bank_Name',headerName:'Bank Name',width:150},
    {field:'Account_Title',headerName:'Account Name',width:150},
    { field: 'amount', headerName: 'Amount', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'timestamp',
      headerName: 'Request Time',
      width: 200,
      valueGetter: (params) =>
        formatFirestoreTimestamp(params.row.approvedTime), // Format the Firestore timestamp
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
<Button variant="contained" color="success" loading={isLoading}
          onClick={() => updateStatus(params.row.id)}
          disabled={params.row.status === "approved"}
        >
          Approve
          </Button>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="datatable">
      <DataGrid
        className="datagrid"
        columns={columns}
        rows={data}
        pageSize={10}
        rowsPerPageOptions={[9]}
      />
      <Toaster />
    </div>
  );
};

export default WithdrawRequest;
