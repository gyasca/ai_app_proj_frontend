import { useContext, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import NotFound from "./errors/NotFound";
import Home from "./Home";
import Login from "./Login";
import Map from "./Map";
import StudentPortal from "./StudentPortal";
import Dashboard from "./Dashboard";
import Test1 from "./Test1";
import Register from "./Register";
import StudentCompetenceMapPage from "./StudentCompetenceMapPage";
import HealthDashboard from "./HealthDashboard";
import OhamodelPredict from "./ohamodel/OhamodelPredict";
import DpModelPredict from "./dp_model/DpModelPredict";
import PredictionHistory from "./dp_model/PredictionHistory";


import EditProfile from "./EditProfile";

// import Login from './Login'
// import Register from './Register'
// import Verify from './Verify'
// import Reset from './Reset'
// import ProfileRoutes from './profile/ProfileRoutes'
// import DriverRoutes from './driver/DriverRoutes'
// import SupportRoutes from './support/SupportRoutes'
// import RiderRoutes from './rider/RiderRoutes'
// import Bicycle from './Bicycle'
// import ReportBicycle from './ReportBicycle'
// import BicycleHistory from './BicycleHistory'
// import ProductRoutes from './products/ProductRoutes'
// import CartRoutes from './cart/CartRoutes'
// import Wishlist from './wishlist/ViewWishlist'
// import About from './About'
import { UserContext } from "../main";

function UserRoutes() {
  // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
  const { setIsAdminPage } = useContext(UserContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    setIsAdminPage(false);
  }, []);
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/map" element={<Map />} />
      <Route path="/studentportal" element={<StudentPortal />} />
      <Route path="/test1" element={<Test1 />} />
      <Route path="/dashboard" element={<HealthDashboard />} />
      <Route path="/oral-health/analyse" element={<OhamodelPredict />} />
      <Route path="/disease-prediction/analyse" element={<DpModelPredict />} />
      <Route path="/prediction-history" element={<PredictionHistory />} />


      {/* if want to use this route must make sure to update the rest of the buttons that
      lead here. (unupdated as of 12 jan 2025) */}
      <Route path="/dashboard-old" element={<Dashboard />} />



      {/* <Route path="/register" element={<Register />} /> */}
      {/* <Route path="/login" element={!user ? <Login /> : <Navigate to={"/"} />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to={"/"} />} />
            <Route path="/test" element={<Test />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/profile/*" element={<ProfileRoutes />} />
            <Route path="/driver/*" element={<DriverRoutes />} />
            <Route path="/support/*" element={<SupportRoutes />} />
            <Route path="/bicycle" element={<Bicycle />} />
            <Route path="/bicycle/report" element={<ReportBicycle />} />
            <Route path="/bicycle/report/:id" element={<ReportBicycle />} />
            <Route path="/bicycle/usages" element={<BicycleHistory />} />
            <Route path="/products/*" element={<ProductRoutes />} />
            <Route path="/cart/*" element={<CartRoutes />} />
            <Route path="/riderequests/*" element={<RiderRoutes />} />
            <Route path="/wishlist" element={<Wishlist/>} />
            <Route path="/about" element={<About />} /> */}
    </Routes>
  );
}

export default UserRoutes;
