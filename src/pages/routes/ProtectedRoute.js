import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import Footer from '../shared/Footer';
// import SettingsPanel from '../shared/SettingsPanel';

const ProtectedRoute = ({ children }) => {
  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            {children}
            {/* <SettingsPanel /> */}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
