import React, { useEffect } from "react";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import ProfileItem from "./ProfileItem";
import { getProfiles } from "../../actions/profile";
const Profiles = ({ profile: { profiles, loading }, getProfiles }) => {
   useEffect(() => {
      getProfiles();
   }, [getProfiles]);
   return (
      <>
         {loading ? (
            <Spinner />
         ) : (
            <>
               <h1 className="large text-primart">Developers</h1>
               <p className="lead">
                  <i className="fab fa-connectdevelop"></i>Browse and connect with developers
               </p>

               <di className="profiles">
                  {profiles.length > 0 ? (
                     profiles.map((profile) => <ProfileItem key={profile._id} profile={profile} />)
                  ) : (
                     <h4>No Profiles found...</h4>
                  )}
               </di>
            </>
         )}
      </>
   );
};

const mapStateToProps = (state) => {
   return {
      profile: state.profile,
   };
};

export default connect(mapStateToProps, { getProfiles })(Profiles);
