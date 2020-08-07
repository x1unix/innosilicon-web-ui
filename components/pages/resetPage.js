import React, { Component } from 'react';
import axios from 'axios';
import {getStorage,setStorage,deleteStorage,generateUrlEncoded} from '../lib/utils'

import {
  Redirect
} from 'react-router-dom';

class Resetpage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      "rebooting":false,
      "redirectToIndex":false,
      "redirectToLogin":false
    };
    this.handleSubmit = this.handleSubmit.bind(this);

  }


  handleSubmit(event) {
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
      axios.post(window.customVars.urlPrefix+window.customVars.apiFactoryReset,postData,axiosConfig)
      .then(res => {
          if (res.data.success==false&&(typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired") {
              deleteStorage("jwt");
              this.setState({"redirectToLogin":true});
          }
      })
      .catch(function (error) {

      });
      var comp=this;
      setTimeout(() => {
        comp.setState({"redirectToIndex":true});
      }, 4000);
    }

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

  render() {
    const { rebooting, redirectToIndex,redirectToLogin } = this.state;
    if (redirectToIndex) {
      return <Redirect to="/?rebooting" />;
    }
    if (redirectToLogin) {
      return <Redirect to="/login?expired" />;
    }

    return (
      <div className="Resetpage">

      <h1>Maintenance<br/><small>Factory Reset</small></h1>

      <div className="row">

          {/* Box  */}
           <div className="col-md-12 mt-5">
             <div className="box">
               <div className="box-header">
                 <h3>Reboot Miner</h3>
               </div>
                   <div className="box-body p-4">

                       <div className="alert alert-warning">
                           <p>Pools settings and passwords will be reset to factory defaults.</p>
                           <p>The miner will retune</p>
                           <p>This web interface will became unavailable after your press the reset button and the miner will be restarted. Please wait until the reboot cycle complete.</p>
                       </div>

                   </div>
                 <div className="box-footer">
                     <button disabled={rebooting} className="btn btn-primary" onClick={this.handleSubmit}>Reset Now {rebooting && <div className="btn-loader lds-dual-ring"></div>}</button>
                 </div>

             </div>
           </div>
           {/* ./ Box  */}
        </div>

      </div>
    );
  }
}

export default Resetpage;



// WEBPACK FOOTER //
// ./src/components/pages/resetPage.js
