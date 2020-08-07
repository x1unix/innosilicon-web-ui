import React, { Component } from 'react';
import axios from 'axios';
import {getStorage,setStorage,deleteStorage,generateUrlEncoded} from '../lib/utils'

import {
  Redirect
} from 'react-router-dom';

class Rebootpage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      "rebooting":false,
      "redirectToLogin":false
    };
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentWillUnmount() {
    if (typeof this.timeOutLoad !== 'undefined')
      clearTimeout(this.timeOutLoad);
  }

  handleSubmit(event) {
    var page=this;
    event.preventDefault();
    var token=getStorage("jwt");
    if (token===null) {
      this.setState({"redirectToLogin":true});
    } else {
      this.setState({"rebooting":true});

      var postData = {

      };
      let axiosConfig = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
      };
      axios.post(window.customVars.urlPrefix+window.customVars.apiReboot,postData,axiosConfig)
      .then(res => {
          if (res.data.success) {
            page.timeOutLoad=setTimeout(() => {
              page.checkMiner();
            }, 5000);
          } else {
            if ((typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired") {
                deleteStorage("jwt");
                this.setState({"redirectToLogin":true});
            }
          }
      })
      .catch(function (error) {

      });

    }

  }

  componentDidMount() {
    this.checkMiner();
  }

  checkMiner() {
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
        if (res.data.success) {
          page.timeOutLoad=setTimeout(() => {
            page.checkMiner();
          }, 5000);
        } else {
          if ((typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired") {
              deleteStorage("jwt");
              page.setState({"redirectToLogin":true});
          }
        }

        })
        .catch(function (error) {
          page.timeOutLoad=setTimeout(() => {
            page.checkMiner();
          }, 5000);
        });
    }
  }

  render() {
    const { rebooting,redirectToLogin } = this.state;
    if (redirectToLogin) {
      return <Redirect to="/login?expired" />;
    }

    return (
      <div className="Rebootpage">

      <h1>Maintenance<br/><small>Reboot</small></h1>

      <div className="row">

          {/* Box  */}
           <div className="col-md-12 mt-5">
             <div className="box">
               <div className="box-header">
                 <h3>Reboot Miner</h3>
               </div>
                   <div className="box-body p-4">

                       <div className="alert alert-info">
                           <p>This web interface will became unavailable after your press the Reboot button. Please wait until the reboot cycle completes.</p>
                       </div>

                   </div>
                 <div className="box-footer">
                     <button disabled={rebooting} className="btn btn-primary" onClick={this.handleSubmit}>Reboot Now {rebooting && <div className="btn-loader lds-dual-ring"></div>}</button>
                 </div>

             </div>
           </div>
           {/* ./ Box  */}
        </div>

      </div>
    );
  }
}

export default Rebootpage;



// WEBPACK FOOTER //
// ./src/components/pages/rebootPage.js
