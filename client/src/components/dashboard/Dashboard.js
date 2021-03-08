import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { deleteAccount, getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import DashboardActions from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";
const Dashboard = ({ getCurrentProfile, auth: { user }, profile: { loading, profile } ,deleteAccount}) => {
   useEffect(() => {
      getCurrentProfile();
   }, [getCurrentProfile]);

   return loading && profile === null ? (
      <Spinner />
   ) : (
      <>
         <h1 className="large text-primary">Dashboard</h1>
         <p className="lead">
            <i className="fas fa-user" /> Welcome {user && user.name}
         </p>
         {profile !== null ? (
            <>
               <DashboardActions />
               <Experience experience={profile.experience} />
               <Education education={profile.education} />
               <div className="my-2">
                  <button onClick={()=> deleteAccount()} className="btn btn-danger">
                     <i className="fas fa-user-minus"></i> Delete My Account
                  </button>
               </div>
            </>
         ) : (
            <>
               <p>You have not yet setup a profile, please add some info</p>
               <Link to="Create-profile" className="btn btn-primary my-1">
                  Create Profile
               </Link>
            </>
         )}
      </>
   );
};

const mapStateToProps = (state) => {
   return {
      auth: state.auth,
      profile: state.profile,
   };
};

export default connect(mapStateToProps, { getCurrentProfile ,deleteAccount})(Dashboard);
