import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Datatable from "../../components/datatable/Datatable";
import EasyPisaTabel from "../../components/easypisa/EasyPisaTabel";

const Listeasy = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <EasyPisaTabel />
      </div>
    </div>
  );
};

export default Listeasy;
