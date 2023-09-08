import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

const CACHE_KEY = "cachedUserData"; // Key for localStorage cache

const Levels = () => {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    // Try to retrieve cached data from localStorage
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      setData(JSON.parse(cachedData));
    }

    const fetchData = async () => {
      try {
        const userRef = collection(db, "levels");
        const querySnapshot = await getDocs(userRef);
        const userData = [];
        querySnapshot.forEach((doc) => {
          userData.push({ id: doc.id, ...doc.data() });
        });
        setData(userData);
        // Cache the data in localStorage
        localStorage.setItem(CACHE_KEY, JSON.stringify(userData));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setOpenEditModal(true);
  };

  const handleSave = async () => {
    if (selectedRow) {
      try {
        const levelDocRef = doc(db, "levels", selectedRow.id);
        await updateDoc(levelDocRef, selectedRow);
        setOpenEditModal(false);
        // You may want to refresh the data here if needed.
        // For simplicity, you can trigger a page reload or fetch data again.
        window.location.reload();
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: '1stwithdrwa', headerName: '1 WITHDRAW LIMIT', width: 150, editable: true },
    { field: '2ndwithdrwa', headerName: '2 WITHDRAW LIMIT', width: 150, editable: true },
    { field: '3rdwithdrwa', headerName: '3 WITHDRAW LIMIT', width: 150, editable: true },
    { field: '4thwithdrwa', headerName: '4 WITHDRAW LIMIT', width: 150, editable: true },
    { field: '5thwithdrwa', headerName: '5 WITHDRAW LIMIT', width: 150, editable: true },
    { field: '1stperson', headerName: '1 Person Commison', width: 150, editable: true },
    { field: '2ndperson', headerName: '2 Person Commison', width: 150, editable: true },
    { field: '3rdperson', headerName: '3 Person Commison', width: 150, editable: true },
    { field: '4rthperson', headerName: '4 Person Commison', width: 150, editable: true },
    { field: '5thperson', headerName: '5 Person Commison', width: 150, editable: true },
  ];

  return (
    <div className="datatable">
      <DataGrid
        className="datagrid"
        columns={columns}
        rows={data}
        pageSize={9}
        rowsPerPageOptions={[9]}
        onRowClick={handleRowClick}
        components={{
          Toolbar: GridToolbar, // Enable the built-in toolbar
        }}
      />

      {openEditModal && selectedRow && (
        <div className="edit-modal">
          <h3>Edit Row</h3>
          {columns.map((column) => (
            <div key={column.field} className="edit-field">
              <label htmlFor={column.field}>{column.headerName}:</label>
              <input
                id={column.field}
                value={selectedRow[column.field]}
                onChange={(e) => {
                  const updatedRow = { ...selectedRow };
                  updatedRow[column.field] = e.target.value;
                  setSelectedRow(updatedRow);
                }}
              />
            </div>
          ))}
          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default Levels;
