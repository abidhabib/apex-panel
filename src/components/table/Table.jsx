import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import {LRUCache} from 'lru-cache'
import {
  collection,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { AiFillDelete } from 'react-icons/ai';

const cache = new LRUCache({
  max: 200, // Maximum number of items to store in the cache
  maxAge: 1000 * 60 * 10 // Maximum age of cached items in milliseconds (10 minutes)
});
const Table = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValues, setInputValues] = useState({});
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if data is already cached
        if (cache.has('userData')) {
          setData(cache.get('userData'));
        } else {
          const snapshot = await getDocs(
            query(collection(db, 'users'), where('approved', '==', true))
          );
  
          const list = snapshot.docs.map((doc) => ({ doc_id: doc.id, ...doc.data() }));
          const filteredList = list.filter((user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
  
          // Cache the fetched and filtered data
          cache.set('userData', filteredList);
          setData(filteredList);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [searchQuery]);
  

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleApprove = async (docId, inputValue) => {
    const docRef = doc(db, 'users', docId);

    try {
      const userDoc = await getDoc(docRef);
      if (userDoc.exists()) {
        const currentBalance = userDoc.data().balance || 0;
        const newBalance = currentBalance + parseInt(inputValue);

        await updateDoc(docRef, { balance: newBalance });
        setToastMessage('Updated successfully');
        setToastSeverity('success');
        setIsToastOpen(true);
      }
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const actionColumn = {
    field: 'action',
    headerName: 'Action',
    width: 350,
    renderCell: (params) => {
      const inputValue = inputValues[params.row.doc_id] || '';

      return (
        <div className="cellAction">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setInputValues((prevInputValues) => ({
                ...prevInputValues,
                [params.row.doc_id]: newValue,
              }));
            }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              handleApprove(params.row.doc_id, inputValue);
              setInputValues((prevInputValues) => ({
                ...prevInputValues,
                [params.row.doc_id]: '',
              }));
            }}
          >
            Update
          </Button>
          <div className="deleteButton" onClick={() => handleDelete(params.row.doc_id)}>
            <AiFillDelete />
          </div>
        </div>
      );
    },
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'balance', headerName: 'Balance', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'country', headerName: 'Country', width: 100 },
    actionColumn,
  ];

  return (
    <>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="searchInput"
        style={{
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          width: '50%',
          marginBottom: '16px',
          fontSize: '16px',
        }}
      />
      <div className="datatable">
        <DataGrid className="datagrid" columns={columns} rows={data} pageSize={10} />
      </div>
      <Snackbar
        open={isToastOpen}
        autoHideDuration={3000}
        onClose={() => setIsToastOpen(false)}
      >
        <MuiAlert onClose={() => setIsToastOpen(false)} severity={toastSeverity}>
          {toastMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default Table;
