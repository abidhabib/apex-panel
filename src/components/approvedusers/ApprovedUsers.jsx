import "../datatable/datatable.scss"
import "./style.scss";

import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { AiFillDelete} from "react-icons/ai"
import {TbLockCheck} from "react-icons/tb"
import { LRUCache } from 'lru-cache'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { db } from "../../firebase";
import { NoAccountsOutlined, VerifiedUserOutlined } from "@mui/icons-material";
import Sidebar from "../sidebar/Sidebar";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const cache = new LRUCache({
  max: 500, // Maximum number of items to store in the cache
  maxAge: 1000 * 60 * 10 // Maximum age of cached items in milliseconds (10 minutes)
});
const ApprovedUsers = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [change,setChange] = useState()

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if data is already cached
        if (cache.has("userData")) {  
          console.log("Fetching data from cache");

          setData(cache.get("userData"));
          setLoading(false); // Data fetched from cache, loading is complete
        } else {  console.log("Fetching data from Firestore");

          const q = query(collection(db, "users"), where("pendeing", "==", false));
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const userList = [];
            querySnapshot.forEach((doc) => {
              userList.push({ doc_id: doc.id, ...doc.data() });
            });
            cache.set("userData", userList); // Cache the fetched data
            setData(userList);
            setLoading(false); // Data fetched, loading is complete
          });
          return () => unsubscribe();
        }
      } catch (err) {
        console.log(err);
      }
      
    };

    fetchData();
  }, []);

  const columns = [
    // Define your columns
  ];

  if (loading) {
    return <p>Loading...</p>;
  }
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setData(data.filter((item) => item.id !== id));
      setChange("nnn")
    } catch (err) {
      console.log(err);
    }
  };
  const handleReject = async (id) => {
    try {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        approved: false,
        pendeing: true,
        pyment_ok:false
      
      });
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };
  const actionColumn = [
    
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              <div className="viewButton"><TbLockCheck/></div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.doc_id)}
            >
              <AiFillDelete/>
            </div>
            <div>
  
       
    </div>
            
          </div>




        );
      },
    },
  ];



  const reorderedUserColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'trx_id', headerName: 'TrxID', width: 150 },
    { field: 'sender_number', headerName: 'Sender Number', width: 150 },
    { field: 'sender_name', headerName: 'Sender Name', width: 150 },
    { field: 'pyment_ok', headerName: 'Payment', width: 70 ,height:50,   renderCell: (params) => {
      return (
        <div style={{textAlign:"center"}} >
            {params.row.pyment_ok ? (<p style={{color:"green"}}>Recived</p>):(<p style={{color:"red"}}>Not Recived  </p>)}
          </div>
          
          ) }},
          { field: 'approved', headerName: 'Status', width: 70 ,height:50,   renderCell: (params) => {
            return (
              <div style={{textAlign:"center"}} >
                  {params.row.approved ? (<p style={{color:"#693fff"}}><VerifiedUserOutlined/></p>):(<p style={{color:"red"}}><NoAccountsOutlined/></p>)}
                </div>
                
                ) }},
    {
      field: "approve",
      headerName: "Reject",
      width: 120,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => handleReject(params.row.doc_id)}
          >
            Reject 
          </Button>
        );
      },
    },
    { field: 'name', headerName: 'Name', width: 150 },
   
    
          { field: 'phoneNumber', headerName: 'Phone', width: 150 },
          { field: 'gender', headerName: 'Gender', width: 70 },
          { field: 'country', headerName: 'Country', width: 100 },

    // ... add other columns you want to display first ...
  ];

  const allColumns = [
    ...reorderedUserColumns,
    ...actionColumn,
    
  ];
  return (
    <>
    <div className="datatable">
      
      <DataGrid
        className="datagrid"
        columns={allColumns}
        rows={data}
        // columns={userColumns.concat(NameColumn)}
        pageSize={10}
        rowsPerPageOptions={[9]}
      />
  
    </div>

    </>
  );
};

export default ApprovedUsers;
