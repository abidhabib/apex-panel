import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Datatable from "../../components/datatable/Datatable";
import EasyPisaTabel from "../../components/easypisa/EasyPisaTabel";
import Rejected from "../../components/rejectedUser/Rejected";

const Listeasy = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <Rejected />

      </div>
    </div>
  );
};

export default Listeasy;
