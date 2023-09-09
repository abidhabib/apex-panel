import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { BiSolidEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { TbLockCheck } from "react-icons/tb";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,

} from "firebase/firestore";
import { db } from "../../firebase";

const CACHE_EXPIRATION = 60000; // Cache expiration time in milliseconds (1 minute)
const CACHE_KEY = "cachedUserData"; // Key for localStorage cache

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Datatable = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [change, setChange] = useState();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Try to retrieve cached data from localStorage
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      setData(JSON.parse(cachedData));
    }

    const fetchData = async () => {
      try {
        const userRef = collection(db, "users");
        const q = query(
          userRef,
          where("name", ">=", searchQuery.toLowerCase())
        );
        const querySnapshot = await getDocs(q);
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
  }, [searchQuery]);




  useEffect(() => {
    handleClose(); // Close modal when search query changes
  }, [searchQuery]);
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      // Create a new array with the deleted item removed
      const updatedData = data.filter((item) => item.doc_id !== id);
      setData(updatedData);
      setChange("nnn");
    } catch (err) {
      console.log(err);
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
              <div className="viewButton">
                <TbLockCheck />
              </div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.doc_id)}
            >
              <AiFillDelete />
            </div>
            <div>
              <div className="cellAction" onClick={handleOpen}>
                <BiSolidEdit />{" "}
              </div>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Text in a modal
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor
                    ligula.
                  </Typography>
                </Box>
              </Modal>
            </div>
          </div>
        );
      },
    },
  ];



  const reorderedUserColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'pyment_ok', headerName: 'Payment', width: 70 ,height:50,   renderCell: (params) => {
      return (
        <div style={{textAlign:"center"}} >
            {params.row.pyment_ok ? (<p style={{color:"green"}}>Recived</p>):(<p style={{color:"red"}}>Not Recived</p>)}
          </div>
          
          ) }},
    { field: 'balance', headerName: 'Balance', width: 70 },
    // { field: 'approved', headerName: 'Approved', width: 100 },
    { field: 'approved', headerName: 'Approved', width: 120, height:50,   renderCell: (params) => {
      return (
        <div style={{textAlign:"center"}} >
            {params.row.approved ===true ? (<p style={{color:"green"}}>Approved</p>):(<p style={{color:"red"}}>Not Approved</p>)}
          </div>
          
          ) }},
          { field: 'phoneNumber', headerName: 'Phone', width: 150 },
          { field: 'gender', headerName: 'Gender', width: 70 },
          { field: 'country', headerName: 'Country', width: 100 },
          { field: 'city', headerName: 'City', width: 100 },
          { field: 'completeAddress', headerName: 'Address', width: 150 },
    // ... add other columns you want to display first ...
  ];

  const allColumns = [
    ...reorderedUserColumns,
    ...actionColumn,
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
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        width: "50%",
        marginBottom: "16px",
        fontSize: "16px",
      }}
    />
    <div className="datatable">
      <DataGrid
        className="datagrid"
        columns={allColumns}
        rows={data} // Make sure this matches your data structure
        pageSize={9}
        rowsPerPageOptions={[9]}
      />
    </div>
  </>
  );
};

export default Datatable;
