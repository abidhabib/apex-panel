import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import WithdrwaApproved from "../../components/withdrwaRequest/WithdrwaApproved";

const WithdrwaApproveds = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <WithdrwaApproved />
      </div>
    </div>
  );
};

export default WithdrwaApproveds;
