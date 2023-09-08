import React, { useEffect, useState } from "react";
import "../datatable/datatable.scss";
import { toast } from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import { collection, deleteDoc, doc, onSnapshot, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Modal } from "antd";

const Levels = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenb, setIsModalOpenb] = useState(false);
  const [docid, setDocid] = useState("");
  const [firstWithdraw, setFirstWithdraw] = useState(0);
  const [secondWithdraw, setSecondWithdraw] = useState(0);
  const [thirdWithdraw, setThirdWithdraw] = useState(0);
  const [fourthWithdraw, setFourthWithdraw] = useState(0);
  const [fifthWithdraw, setFifthWithdraw] = useState(0);
  const [unlock, setUnlock] = useState(0);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModalb = (row) => {
    setUnlock(row.unlock);
    setFirstWithdraw(row.firstWithdraw);
    setSecondWithdraw(row.secondWithdraw);
    setThirdWithdraw(row.thirdWithdraw);
    setFourthWithdraw(row.fourthWithdraw);
    setFifthWithdraw(row.fifthWithdraw);
    setDocid(row.id);
    setIsModalOpenb(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleOkb = () => {
    setIsModalOpenb(false);
    setUnlock(0);
    setFirstWithdraw(0);
    setSecondWithdraw(0);
    setThirdWithdraw(0);
    setFourthWithdraw(0);
    setFifthWithdraw(0);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCancelb = () => {
    setIsModalOpenb(false);
    setUnlock(0);
    setFirstWithdraw(0);
    setSecondWithdraw(0);
    setThirdWithdraw(0);
    setFourthWithdraw(0);
    setFifthWithdraw(0);
  };

  const [data, setData] = useState([]);
  const [change, setChange] = useState();

  const handleSave = async () => {
    try {
      const levelsCollection = collection(db, "Level");

      await addDoc(levelsCollection, {
        unlock: Number(unlock),
        firstWithdraw: Number(firstWithdraw),
        secondWithdraw: Number(secondWithdraw),
        thirdWithdraw: Number(thirdWithdraw),
        fourthWithdraw: Number(fourthWithdraw),
        fifthWithdraw: Number(fifthWithdraw),
      });

      toast.success("Data saved successfully");
      setUnlock(0);
      setFirstWithdraw(0);
      setSecondWithdraw(0);
      setThirdWithdraw(0);
      setFourthWithdraw(0);
      setFifthWithdraw(0);
    } catch (error) {
      toast.error("Error saving data:", error);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "Level"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
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
    try {
      const levelDocRef = doc(db, "Level", docid);

      await updateDoc(levelDocRef, {
        unlock: Number(unlock),
        firstWithdraw: Number(firstWithdraw),
        secondWithdraw: Number(secondWithdraw),
        thirdWithdraw: Number(thirdWithdraw),
        fourthWithdraw: Number(fourthWithdraw),
        fifthWithdraw: Number(fifthWithdraw),
      });

      toast.success("Data updated successfully");
      setUnlock(0);
      setFirstWithdraw(0);
      setSecondWithdraw(0);
      setThirdWithdraw(0);
      setFourthWithdraw(0);
      setFifthWithdraw(0);
      setDocid("");
      setIsModalOpenb(false);
    } catch (error) {
      toast.error("Error updating data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Level", id));
      setData(data.filter((item) => item.id !== id));
      setChange("nnn");
      toast.success("Level deleted");
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
    { field: "unlock", headerName: "Unlock On", width: 80 },
   { field: "firstWithdraw", headerName: "First Withdraw", width: 130 },
    { field: "secondWithdraw", headerName: "Second Withdraw", width: 130 },
    { field: "thirdWithdraw", headerName: "Third Withdraw", width: 130 },
    { field: "fourthWithdraw", headerName: "Fourth Withdraw", width: 130 },
    { field: "fifthWithdraw", headerName: "Fifth Withdraw", width: 130 },
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
          Add LEVEL
        </button>
        <p className="link">Add New</p>
      </div>
      <DataGrid
        className="datagrid"
        columns={allColumns}
        rows={data}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
      <Modal
        title="Add Level"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="unlock">unlock:</label>
          <input
            type="number"
            id="unlock"
            value={unlock}
            onChange={(e) => setUnlock(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="firstWithdraw">First Withdraw:</label>
          <input
            type="number"
            id="firstWithdraw"
            value={firstWithdraw}
            onChange={(e) => setFirstWithdraw(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="secondWithdraw">Second Withdraw:</label>
          <input
            type="number"
            id="secondWithdraw"
            value={secondWithdraw}
            onChange={(e) => setSecondWithdraw(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="thirdWithdraw">Third Withdraw:</label>
          <input
            type="number"
            id="thirdWithdraw"
            value={thirdWithdraw}
            onChange={(e) => setThirdWithdraw(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="fourthWithdraw">Fourth Withdraw:</label>
          <input
            type="number"
            id="fourthWithdraw"
            value={fourthWithdraw}
            onChange={(e) => setFourthWithdraw(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="fifthWithdraw">Fifth Withdraw:</label>
          <input
            type="number"
            id="fifthWithdraw"
            value={fifthWithdraw}
            onChange={(e) => setFifthWithdraw(e.target.value)}
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
        title="Edit Level"
        open={isModalOpenb}
        onOk={handleOkb}
        onCancel={handleCancelb}
      >
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="unlock">unlock:</label>
          <input
            type="number"
            id="unlock"
            value={unlock}
            onChange={(e) => setUnlock(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="firstWithdraw">First Withdraw:</label>
          <input
            type="number"
            id="firstWithdraw"
            value={firstWithdraw}
            onChange={(e) => setFirstWithdraw(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="secondWithdraw">Second Withdraw:</label>
          <input
            type="number"
            id="secondWithdraw"
            value={secondWithdraw}
            onChange={(e) => setSecondWithdraw(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="thirdWithdraw">Third Withdraw:</label>
          <input
            type="number"
            id="thirdWithdraw"
            value={thirdWithdraw}
            onChange={(e) => setThirdWithdraw(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="fourthWithdraw">Fourth Withdraw:</label>
          <input
            type="number"
            id="fourthWithdraw"
            value={fourthWithdraw}
            onChange={(e) => setFourthWithdraw(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="fifthWithdraw">Fifth Withdraw:</label>
          <input
            type="number"
            id="fifthWithdraw"
            value={fifthWithdraw}
            onChange={(e) => setFifthWithdraw(e.target.value)}
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

export default Levels;
