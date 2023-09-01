import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  updateSettings,
  updateSelectedImage// Import the action for updating selectedImage
} from "../../redux/reducers/settingsSlice";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc, // Import getDoc
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import './settings.scss'
const Settings = () => {
  const dispatch = useDispatch();
  const { fees, coinPrice, title, selectedImage } = useSelector(
    (state) => state.settings
  ); // Include selectedImage in state
const [localaccnumber, setlocalAccnumber] = useState("");
const [localaccname, setlocalAccname] = useState("John Doe");

  const [localFees, setLocalFees] = useState(fees);
  const [localCoinPrice, setLocalCoinPrice] = useState(coinPrice);
  const [localTitle, setLocalTitle] = useState(title);
const [imgurl, setImgurl] = useState("")

const [previewImage, setPreviewImage] = useState(""); // To store the temporary URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsSnapshot = await getDocs(collection(db, "settings"));
        if (!settingsSnapshot.empty) {
          const data = settingsSnapshot.docs[0].data();
          setLocalFees(data.fees);
          setLocalCoinPrice(data.coinPrice);
          setLocalTitle(data.title);
          setlocalAccnumber(data.accnumber)
          setlocalAccname(data.accname)
          setImgurl(data.imageUrl)
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    try {
      const data = {
        fees: parseFloat(localFees),
        coinPrice: parseFloat(localCoinPrice),
        title: localTitle,
        accnumber: localaccnumber,
        accname: localaccname
      };

      // Dispatch an action to update the Redux store
      dispatch(updateSettings(data));

      // Update Firestore document
      await updateDoc(doc(db, "settings", "KFwh6z2LS0msPDnZRaLq"), data);

      // If there's a selected image, upload it and update Firestore
      if (selectedImage) {
        const settingsDocRef = doc(db, "settings", "KFwh6z2LS0msPDnZRaLq");
        const storageRef = ref(storage, `images/${settingsDocRef.id}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.error("Error uploading image:", error);
          },
          async () => {
            const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(settingsDocRef, { ...data, imageUrl });
            toast.success("Settings and image saved successfully!");
          }
        );
      } else {
        // Show toast success message
        toast.success("Settings saved successfully!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error saving settings. Please try again.");
    }
  };  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    // Create a temporary URL for the selected image
    const previewImageUrl = URL.createObjectURL(selectedImage);

    // Update state with the selected image and preview URL
    dispatch(updateSelectedImage(selectedImage));
    setPreviewImage(previewImageUrl);
  };

  return (
    <div className="container">
      <div className="form-group">
        <label className="label">Fees:</label>
        <input
          className="input"
          type="number"
          value={localFees}
          onChange={(e) => setLocalFees(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="label">Coin Price:</label>
        <input
          className="input"
          type="number"
          value={localCoinPrice}
          onChange={(e) => setLocalCoinPrice(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="label">Title:</label>
        <input
          className="input"
          type="text"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
  <label className="label">Account Number</label>
  <input
    className="input"
    type="text"
    value={localaccnumber}
    onChange={(e) => setlocalAccnumber(e.target.value)} 
  />
</div>
<div className="form-group">
  <label className="label">Account Name</label>
  <input
    className="input"
    type="text"
    value={localaccname}
    onChange={(e) => setlocalAccname(e.target.value)}
  />
</div>
      <div className="image-container">
        {previewImage && (
          <img
            className="preview-image"
            src={previewImage}
            alt="Preview"
          />
        )}
        {imgurl && !previewImage && (
          <img className="preview-image" src={imgurl} alt="Image" />
        )}
      </div>
      <div className="form-group">
        <label className="label">Upload Image:</label>
        <input
          className="input"
          type="file"
          onChange={handleImageChange}
        />
      </div>
      <button className="button" onClick={handleSaveSettings}>
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
