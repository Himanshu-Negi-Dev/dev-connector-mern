import React from "react";

const ProfileTop = ({
   profile: {
      status,
      company,
      location,
      website,
      social,
      user: { name, avatar },
   },
}) => {
   return (
      <>
         <div class="profile-top bg-primary p-2">
            <img class="round-img my-1" src={avatar} alt="" />

            <h1 class="large">{name}</h1>
            <p class="lead">
               {status} {company && <span>{company}</span>}{" "}
            </p>
            <p>{location && <span>{location}</span>}</p>
            <div class="icons my-1">
               {website && (
                  <a href={website}>
                     <i class="fas fa-globe fa-2x" />
                  </a>
               )}

               {social && social.twitter && (
                  <a href={social.twitter}>
                     <i class="fab fa-twitter fa-2x"></i>
                  </a>
               )}

               {social && social.facebook && (
                  <a href={social.facebook}>
                     <i class="fab fa-facebook fa-2x"></i>
                  </a>
               )}

               {social && social.linkedin && (
                  <a href={social.linkedin}>
                     <i class="fab fa-linkedin fa-2x"></i>
                  </a>
               )}

               {social && social.youtube && (
                  <a href={social.youtube}>
                     <i class="fab fa-youtube fa-2x"></i>
                  </a>
               )}

               {social && social.instagram && (
                  <a href={social.instagram}>
                     <i class="fab fa-instagram fa-2x"></i>
                  </a>
               )}
            </div>
         </div>
      </>
   );
};

export default ProfileTop;
