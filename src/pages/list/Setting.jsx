import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Settings from "../../components/settings/Settings";

const Setting = () => {
  return (
    <div className="list">
    <Sidebar />
    <div className="listContainer">
      <Navbar />
<Settings/>
      </div>
    </div>
  );
};

export default Setting;
