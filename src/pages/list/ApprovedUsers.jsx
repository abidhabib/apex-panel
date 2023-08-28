import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ApprovedUsers from "../../components/approvedusers/ApprovedUsers";

const ApprovedUser = () => {
  return (
    <div className="list">
    <Sidebar />
    <div className="listContainer">
      <Navbar />
<ApprovedUsers/>
      </div>
    </div>
  );
};

export default ApprovedUser;
