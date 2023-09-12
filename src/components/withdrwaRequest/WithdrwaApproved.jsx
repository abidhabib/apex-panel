import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Toaster } from "react-hot-toast";

const WithdrwaApproved = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const withdrawalRef = collection(db, "withdrawals");
        const q = query(withdrawalRef, where("status", "==", "approved"));
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

  // Function to format a Firestore timestamp
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

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {field:'Account_Number',headerName:'Account Number',width:150},
    {field:'Bank_Name',headerName:'Bank Name',width:150},
    {field:'Account_Title',headerName:'Account Name',width:150},
    { field: 'amount', headerName: 'Amount', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'approvedTime',
      headerName: 'Approved Time',
      width: 200,
      valueGetter: (params) =>
        formatFirestoreTimestamp(params.row.approvedTime), // Format the Firestore timestamp
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

export default WithdrwaApproved;
