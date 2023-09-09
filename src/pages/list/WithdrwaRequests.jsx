import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import WithdrwaRequest from "../../components/withdrwaRequest/WithdrwaRequest";

const WithdrwaRequests = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <WithdrwaRequest />
      </div>
    </div>
  );
};

export default WithdrwaRequests;
