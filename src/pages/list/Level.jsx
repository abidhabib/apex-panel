import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Levels from "../../components/levels/Levels";

const Level = () => {
  return (
    <div className="list">
    <Sidebar />
    <div className="listContainer">
      <Navbar />
<Levels/>
      </div>
    </div>
  );
};

export default Level;
