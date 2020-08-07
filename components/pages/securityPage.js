import React, { Component } from 'react';
import axios from 'axios';
import {generateUrlEncoded,getStorage,deleteStorage} from '../lib/utils'
import { Redirect } from 'react-router-dom';

class Securitypage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      "alertMessage": "",
      "updatedPassword": false,
      "updatingPassword": false,
      "redirectToLogin": false
    };
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentDidMount() {

    var page=this;
    var token=getStorage("jwt");
    if (token===null) {
      this.setState({"redirectToLogin":true});
    } else {
        var postData = {

        };
        let axiosConfig = {
          headers: {
              'Authorization': 'Bearer ' + token
          }
        };
        axios.post(window.customVars.urlPrefix+window.customVars.apiPing,postData,axiosConfig)
        .then(res => {
          if (!res.data.success) {
            if ((typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired") {
                deleteStorage("jwt");
                page.setState({"redirectToLogin":true});
            }
          }

          })
          .catch(function (error) {

          });
    }

  }


  handleSubmit(event) {
    event.preventDefault();
    var token=getStorage("jwt");
    if (token===null) {
      this.setState({"redirectToLogin":true});
    } else {
          var { alertMessage,updatingPassword } = this.state;
          if (!updatingPassword) {

            var currentPassword=this.refs.currentPassword.value;
            var newPassword=this.refs.newPassword.value;
            var confirmPassword=this.refs.confirmPassword.value;
            var user=this.refs.user.value;
            alertMessage="";
            if(currentPassword.length === ""){
                alertMessage="The current password can't be empty";
            }else if(newPassword.length <= 6){
                alertMessage="The new password should have at least 6 characters";
            }else if(currentPassword === newPassword){
                alertMessage="The new password should be different that the current password";
            }else if(newPassword !== confirmPassword){
                alertMessage="Thew new and the confirmation password doesn't match";
            }

            this.setState({"alertMessage":alertMessage,updatedPassword:false,"updatingPassword":(alertMessage==="")});
            if (alertMessage==="") {


              var strSend = generateUrlEncoded({"user":user,"currentPassword":currentPassword,"newPassword":newPassword});

              this.refs.currentPassword.value="";
              this.refs.newPassword.value="";
              this.refs.confirmPassword.value="";
              var comp=this;


              let axiosConfig = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
              };
              axios.post(window.customVars.urlPrefix+window.customVars.apiUpdatePassword,strSend,axiosConfig)
              .then(res => {
                if (res.data.success==true) {
                  comp.setState({"alertMessage":alertMessage,updatedPassword:true,"updatingPassword":false});
                } else if (res.data.success==false) {
                  if ((typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired") {
                      deleteStorage("jwt");
                      comp.setState({"redirectToLogin":true});
                  } else {
                    alertMessage=res.data.message;
                    comp.setState({"alertMessage":alertMessage,updatedPassword:false,"updatingPassword":false});
                  }
                }
              })
              .catch(function (error) {

                alertMessage="Error updating the password";
                comp.setState({"alertMessage":alertMessage,updatedPassword:false,"updatingPassword":false});
              });

            }

          }
      }
  }

  render() {
    var { alertMessage,updatedPassword,updatingPassword,redirectToLogin } = this.state;

    if (redirectToLogin) {
      return <Redirect to="/login?expired" />;
    }

    return (
      <div className="Securitypage">

      <h1>Settings<br/><small>Password</small></h1>


      <div className="row">

          {/* Box */}
         <div className="col-md-12 mt-5">
           <div className="box">
             <div className="box-header">
               <h3>Change password</h3>
             </div>


                 <div className="box-body p-4">

                 {alertMessage !== "" &&
                     <div className="alert alert-warning">
                       <strong>Error</strong> {alertMessage}
                     </div>
                 }

                 {updatedPassword &&
                     <div className="alert alert-success">
                       The password was updated successfully.
                     </div>
                 }

                     <div className="form-group row">
                         <label htmlFor="inputUser" className="col-sm-2 col-form-label">User</label>
                         <div className="col-sm-10">
                             <select ref="user" className="form-control form-control-sm" id="inputUser">
                                <option value="admin">admin</option>
                             </select>
                         </div>
                     </div>

                     <div className="form-group row">
                         <label htmlFor="inputCurrentPassword" className="col-sm-2 col-form-label">Current Admin Password</label>
                         <div className="col-sm-10">
                             <input ref="currentPassword" type="password" className="form-control form-control-sm" id="inputCurrentPassword" placeholder="Current Admin Password" />
                         </div>
                     </div>
                     <div className="form-group row">
                         <label htmlFor="inputNewPassword" className="col-sm-2 col-form-label">New Password</label>
                         <div className="col-sm-10">
                             <input ref="newPassword" type="password" className="form-control form-control-sm" id="inputNewPassword" placeholder="Current Password" />
                         </div>
                     </div>
                     <div className="form-group row">
                         <label htmlFor="inputConfirmPassword" className="col-sm-2 col-form-label">Confirm Password</label>
                         <div className="col-sm-10">
                             <input ref="confirmPassword" type="password" className="form-control form-control-sm" id="inputConfirmPassword" placeholder="Confirm Password" />
                         </div>
                     </div>
                 </div>
                 <div className="box-footer">
                     <button rel="btn" className="btn btn-primary" onClick={this.handleSubmit} >Update {updatingPassword && <div className="btn-loader lds-dual-ring"></div>}</button>
                 </div>
           </div>
         </div>
         {/* .Box */}


      </div>
      {/* ./row */}

      </div>
    );
  }
}

export default Securitypage;



// WEBPACK FOOTER //
// ./src/components/pages/securityPage.js
