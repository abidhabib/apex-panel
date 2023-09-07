import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import {
  collection,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  limit,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { AiFillDelete } from 'react-icons/ai';

const ITEMS_PER_PAGE = 10;

const Table = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValues, setInputValues] = useState({});
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('');
  const [lastDocument, setLastDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Check if data is already cached
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
      } else {
        const q = query(
          collection(db, 'users'),
          where('approved', '==', true),
          orderBy('name'), // You can specify the order here
          limit(ITEMS_PER_PAGE)
        );

        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({ doc_id: doc.id, ...doc.data() }));

        if (snapshot.docs.length > 0) {
          setLastDocument(snapshot.docs[snapshot.docs.length - 1]);
        } else {
          setLastDocument(null);
        }

        setData(list);
        setLoading(false);

        // Cache the fetched data
        setCachedData(list);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCachedData = () => {
    const cachedData = localStorage.getItem('cachedData');
    return cachedData ? JSON.parse(cachedData) : null;
  };

  const setCachedData = (data) => {
    localStorage.setItem('cachedData', JSON.stringify(data));
  };

  const handleRefresh = () => {
    // Clear the cache and fetch fresh data
    localStorage.removeItem('cachedData');
    fetchData();
  };

  useEffect(() => {
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
    try {
      const updatedData = data.map((user) => {
        if (user.doc_id === docId) {
          const currentBalance = user.balance || 0;
          const newBalance = currentBalance + parseInt(inputValue);
          return { ...user, balance: newBalance };
        }
        return user;
      });

      setData(updatedData);

      setToastMessage('Updated successfully');
      setToastSeverity('success');
      setIsToastOpen(true);

      // Perform the Firestore update here
      const docRef = doc(db, 'users', docId);
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        const currentBalance = userDoc.data().balance || 0;
        const newBalance = currentBalance + parseInt(inputValue);

        await updateDoc(docRef, { balance: newBalance });
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
        <Button
        variant="contained"
        color="primary"
        onClick={handleRefresh}
        style={{ marginBottom: '16px', marginLeft: '8px' }}
      >
        Refresh
      </Button>
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
