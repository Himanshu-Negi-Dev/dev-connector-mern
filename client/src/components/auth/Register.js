import React, { useState } from "react";
import { Link,Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
const Register = ({ setAlert, register, isAuthenticated }) => {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      password2: "",
   });

   const { name, email, password, password2 } = formData;

   const onSubmit = async (e) => {
      e.preventDefault();

      if (password !== password2) {
         setAlert("password not matching", "danger");
      } else {
         register({ name, email, password });
      }
   };
   const onChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };


   if(isAuthenticated){
      return <Redirect to='/dashboard' />
   }

   return (
      <>
         <h1 className="large text-primary">Sign Up</h1>
         <p className="lead">
            <i className="fas fa-user"></i> Create Your Account
         </p>
         <form method="POST" className="form" onSubmit={(e) => onSubmit(e)}>
            <div className="form-group">
               <input type="text" placeholder="Name" name="name" value={name} onChange={(e) => onChange(e)} required />
            </div>
            <div className="form-group">
               <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={email}
                  onChange={(e) => onChange(e)}
                  required
               />
               <small className="form-text">
                  This site uses Gravatar, so if you want a profile image, use a Gravatar email
               </small>
            </div>
            <div className="form-group">
               <input
                  type="password"
                  placeholder="Password"
                  minLength="6"
                  name="password"
                  value={password}
                  onChange={(e) => onChange(e)}
                  required
               />
            </div>
            <div className="form-group">
               <input
                  type="password"
                  placeholder="Confirm Password"
                  minLength="6"
                  name="password2"
                  value={password2}
                  onChange={(e) => onChange(e)}
               />
            </div>
            <input type="submit" value="Register" className="btn btn-primary" />
         </form>
         <p className="my-1">
            Already have an account? <Link to="/login">Sign In</Link>
         </p>
      </>
   );
};

const mapStateToProps = (state) => {
   return {
      isAuthenticated: state.auth.isAuthenticated,
   };
};

export default connect(mapStateToProps, { setAlert, register })(Register);
