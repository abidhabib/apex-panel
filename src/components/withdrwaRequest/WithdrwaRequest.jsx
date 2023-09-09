import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "../../firebase";

const WithdrawRequest = () => {
  const [data, setData] = useState([]);
  
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'amount', headerName: 'Amount', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
  ];

  return (
    <div className="datatable">
      <DataGrid
        className="datagrid"
        columns={columns}
        rows={data}
        pageSize={10}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default WithdrawRequest;
