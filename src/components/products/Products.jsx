import React from "react";
import "../datatable/datatable.scss";
import { toast } from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// import Modal from '@mui/material/Modal';
import { BiSolidEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Modal } from "antd";

import { TbLockCheck } from "react-icons/tb";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

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
const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenb, setIsModalOpenb] = useState(false);
  
  const [reward, setReward] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [docid, setDocid] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModalb = (row) => {
    setDescription(row.description);
    setReward(row.reward);
    setPicture(row.Link);
    setDocid(row.id)
    setIsModalOpenb(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleOkb = () => {
    setIsModalOpenb(false);
    setDescription("");
    setReward("");
    setPicture("");
    setDocid("")
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCancelb = () => {
    setIsModalOpenb(false);
    setDescription("");
    setReward("");
    setPicture("");
    setDocid("")
  };
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [change, setChange] = useState();


  const handleSave = async () => {
    if (!reward || !description || !picture) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const productsCollection = collection(db, "products");

      await addDoc(productsCollection, {
        reward,
        description,
        Link: picture,
      });

      toast.success("Data saved successfully");
      // Clear input fields
      setReward("");
      setDescription("");
      setPicture("");
    } catch (error) {
      toast.error("Error saving data:");
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "products"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
        console.log(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, [change]);
  const handelEdit = async () => {
    if (!reward || !description || !picture) {
        toast.error("Please fill in all fields.");
        return;
      }
      try {
        const productDocRef = doc(db, "products", docid);
  
        await updateDoc(productDocRef, {
            reward,
            description,
            Link:picture

        });
  
        toast.success("Data updated successfully");
        setDescription("");
        setReward("");
        setPicture("");
         setDocid("")
        // Close the modal
        setIsModalOpen(false);
      } catch (error) {
        toast.error("Error updating data");
      }


  };
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setData(data.filter((item) => item.id !== id));
      setChange("nnn");
      toast.success("product deleted");
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
            <button
              style={{
                cursor: "pointer",
                padding: "5px 15px",
                backgroundColor: "rgb(48, 162, 255)",
                color: "white",
                fontSize: "16px",
                borderRadius: "5px",
              }}
              onClick={() => showModalb(params.row)}
            >
              Edit
            </button>
            <button
              style={{
                cursor: "pointer",
                marginLeft: "13px",
                padding: "5px",
                backgroundColor: "rgb(254, 161, 161)",
                color: "white",
                fontSize: "16px",
                borderRadius: "5px",
              }}
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  const reorderedUserColumns = [
    { field: "reward", headerName: "Reward", width: 80 },
    { field: "description", headerName: "Name", width: 150 },
    { field: "Link", headerName: "Link", width: 250 },

    // ... add other columns you want to display first ...
  ];

  const allColumns = [...reorderedUserColumns, ...actionColumn];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        <button
          style={{
            backgroundColor: "rgb(128, 98, 214)",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={showModal}
        >
          Add Product
        </button>
        <p className="link">Add New</p>
      </div>
      <DataGrid
        className="datagrid"
        columns={allColumns}
        rows={data}
        // columns={userColumns.concat(NameColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="reward">Reward:</label>
          <input
            type="text"
            id="reward"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="picture">Link:</label>
          <input
            type="text"
            id="picture"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
          />
        </div>
        <button
          style={{ padding: "10px", width: "150px" }}
          onClick={handleSave}
        >
          Save
        </button>
      </Modal>
      <Modal
        title="Basic Modal"
        open={isModalOpenb}
        onOk={handleOkb}
        onCancel={handleCancelb}
      >
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="reward">Reward:</label>
          <input
            type="text"
            id="reward"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="picture">Link:</label>
          <input
            type="text"
            id="picture"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
          />
        </div>
        <button
          style={{ padding: "10px", width: "150px" }}
          onClick={handelEdit}
        >
          Update
        </button>
      </Modal>
    </div>
  );
};

export default Products;
