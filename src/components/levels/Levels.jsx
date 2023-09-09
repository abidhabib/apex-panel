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
  const [first_person_commsion, setFirst_person_commision] = useState(0);
  const [second_person_commsion, setSecond_person_commision] = useState(0);
  const [third_person_commsion, setThird_person_commision] = useState(0);
  const  [fourth_person_commsion, setFourth_person_commision] = useState(0);
  const [fifth_person_commsion, setFifth_person_commision] = useState(0);
  const [unlock, setUnlock] = useState(0);
const [rank, setRank] = useState("")
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
    setFifth_person_commision(row.fifth_person_commision);
    setFourth_person_commision(row.fourth_person_commision);
    setThird_person_commision(row.third_person_commision);
    setSecond_person_commision(row.second_person_commision);
    setFirst_person_commision(row.first_person_commision);
    setDocid(row.id);
    setRank (row.rank);
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
    setFirst_person_commision(0);
    setSecond_person_commision(0);
    setThird_person_commision(0);
    setFourth_person_commision(0);
    setFifth_person_commision(0);
    setRank("")
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
    setFirst_person_commision(0);
    setSecond_person_commision(0);
    setThird_person_commision(0);
    setFourth_person_commision(0);
    setFifth_person_commision(0);
setRank("")
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
        first_person_commsion: Number(first_person_commsion),
        second_person_commsion: Number(second_person_commsion),
        third_person_commsion: Number(third_person_commsion),
        fourth_person_commsion: Number(fourth_person_commsion),
        fifth_person_commsion: Number(fifth_person_commsion),
        rank:rank 
      });

      toast.success("Data saved successfully");
      setUnlock(0);
      setFirstWithdraw(0);
      setSecondWithdraw(0);
      setThirdWithdraw(0);
      setFourthWithdraw(0);
      setFifthWithdraw(0);
      setFirst_person_commision(0);
      setSecond_person_commision(0);
      setThird_person_commision(0);
      setFourth_person_commision(0);
      setFifth_person_commision(0);
      setRank("")
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
        first_person_commsion: Number(first_person_commsion),
        second_person_commsion: Number(second_person_commsion),
        third_person_commsion: Number(third_person_commsion),
        fourth_person_commsion: Number(fourth_person_commsion),
        fifth_person_commsion: Number(fifth_person_commsion),
      rank:rank
      });

      toast.success("Data updated successfully");
      setUnlock(0);
      setFirstWithdraw(0);
      setSecondWithdraw(0);
      setThirdWithdraw(0);
      setFourthWithdraw(0);
      setFifthWithdraw(0);
      setFirst_person_commision(0);
      setSecond_person_commision(0);
      setThird_person_commision(0);
      setFourth_person_commision(0);
      setFifth_person_commision(0);
      setDocid("");
      setRank("")
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
    { field: "rank", headerName: "Ranking", width: 70 },
    { field: "unlock", headerName: "Unlock On", width: 80 },
   { field: "firstWithdraw", headerName: "First Withdraw", width: 130 },
    { field: "secondWithdraw", headerName: "Second Withdraw", width: 130 },
    { field: "thirdWithdraw", headerName: "Third Withdraw", width: 130 },
    { field: "fourthWithdraw", headerName: "Fourth Withdraw", width: 130 },
    { field: "fifthWithdraw", headerName: "Fifth Withdraw", width: 130 },
    { field: "first_person_commsion", headerName: "1st Person Commission", width: 130 },
    { field: "second_person_commsion", headerName: "2nd Person Commission", width: 130 },
    { field: "third_person_commsion", headerName: "3rd Person Commission", width: 130 },
    { field: "fourth_person_commsion", headerName: "4th Person Commission", width: 130 },
    { field: "fifth_person_commsion", headerName: "5th Person Commission", width: 130 },
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
      </div>
      <DataGrid
        className="datagrid"
        columns={allColumns}
        rows={data}
        pageSize={9}
        rowsPerPageOptions={[9]}
        
      />
      <Modal
        title="Add Level"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
      
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="rank">Rank:</label>
          <input
            type="text"
            id="rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
          />
        </div>
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
         <div style={{ marginBottom: "16px" }}>
          <label htmlFor="first_person_commsion">1st Person Commission:</label>
          <input
            type="number"
            id="first_person_commsion"
            value={first_person_commsion}
            onChange={(e) => setFirst_person_commision(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="second_person_commsion">2nd Person Commission:</label>
          <input

            type="number"
            id="second_person_commsion"
            value={second_person_commsion}
            onChange={(e) => setSecond_person_commision(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="third_person_commsion">3rd Person Commission:</label>
          <input

            type="number"
            id="third_person_commsion"
            value={third_person_commsion}
            onChange={(e) => setThird_person_commision(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="fourth_person_commsion">4th Person Commission:</label>
          <input

            type="number"
            id="fourth_person_commsion"
            value={fourth_person_commsion}
            onChange={(e) => setFourth_person_commision(e.target.value)}
          />
        </div> <div style={{ marginBottom: "16px" }}>
          <label htmlFor="fifth_person_commsion">5th Person Commission:</label>
          <input

            type="number"
            id="fifth_person_commsion"
            value={fifth_person_commsion}
            onChange={(e) => setFifth_person_commision(e.target.value)}
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
          <label htmlFor="rank">Rank:</label>
          <input
            type="text"
            id="rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
          />
        </div>
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
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="first_person_commsion">1st Person Commission:</label>
          <input
            type="number"
            id="first_person_commsion"
            value={first_person_commsion}
            onChange={(e) => setFirst_person_commision(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="second_person_commsion">2nd Person Commission:</label>
          <input

            type="number"
            id="second_person_commsion"
            value={second_person_commsion}
            onChange={(e) => setSecond_person_commision(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="third_person_commsion">3rd Person Commission:</label>
          <input

            type="number"
            id="third_person_commsion"
            value={third_person_commsion}
            onChange={(e) => setThird_person_commision(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="fourth_person_commsion">4th Person Commission:</label>
          <input

            type="number"
            id="fourth_person_commsion"
            value={fourth_person_commsion}
            onChange={(e) => setFourth_person_commision(e.target.value)}
          />
        </div> <div style={{ marginBottom: "16px" }}>
          <label htmlFor="fifth_person_commsion">5th Person Commission:</label>
          <input

            type="number"
            id="fifth_person_commsion"
            value={fifth_person_commsion}
            onChange={(e) => setFifth_person_commision(e.target.value)}
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
