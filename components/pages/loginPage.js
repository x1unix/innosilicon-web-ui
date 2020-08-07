import React, { Component } from 'react';
import axios from 'axios';
import {generateUrlEncoded} from '../lib/utils'
import { withRouter,Redirect } from 'react-router-dom';
import {getStorage,setStorage} from '../lib/utils';
import queryString from 'query-string';

class Loginpage extends Component {

  constructor(props) {
    super(props);
    var params = queryString.parse(this.props.location.search);
    var isExpired=false;

    if (params!=null&typeof params["expired"] !== 'undefined') {
      isExpired=true;
    }


    this.state = {
      isLoggin:false,
      error: "",
      isLogged:false,
      isExpired:isExpired
    };
    this.handleSubmit = this.handleSubmit.bind(this);

  }


  componentDidMount() {


  }

  handleSubmit(event) {
    const {  } = this.state;
    event.preventDefault();
    var comp=this;
    if (this.username.value!==""&&this.password.value!=="") {
      var username=this.username.value;
      var strSend = generateUrlEncoded({"username":username,"password":this.password.value});
      this.setState({"isLoggin":true,"error":""});
      axios.post(window.customVars.urlPrefix+window.customVars.apiLogin, strSend)
      .then(function (response) {
        if(response.data.success === true){
          setStorage("jwt",response.data.jwt);
          setStorage("userName",username);
          setStorage("firmware_num",1);
          comp.setState({"isLogged":true});
        } else {
          comp.setState({"isLoggin":false,"error":response.data.message});
        }
      })
      .catch(function (error) {

      });
    }


  }

  render() {
    const { isLoggin,error,isLogged,isExpired } = this.state;
    if (isLogged) {
      return <Redirect to="/" />;
    }
    return (


      <div className="Loginpage light-skin">
        <div id="content">

        <div className="hm-logo">

        </div>





          <div className="row h-100 justify-content-center align-items-center">
            <div className="card login-box mt-5 login-card">
              <div className="card-body">
                  <h5 className="card-title text-center">Sign In</h5>

                    {!error && isExpired &&
                        <div className="alert alert-warning small">Your session is expired, please log in again</div>
                    }
                    {error!=="" &&
                      <div className="alert alert-warning small">
                        {error}
                      </div>
                    }
                    <form onSubmit={this.handleSubmit}>
                      <input type="text" id="inputUsername" className="form-control form-control-sm" ref={(input) => this.username = input} placeholder="Username" required autoFocus />
                      <input type="password" id="inputPassword" className="form-control form-control-sm mt-3" ref={(input) => this.password = input} placeholder="Password" required />

                      <button className="btn btn-sm btn-primary btn-block mt-3" disabled={isLoggin} onClick={this.handleSubmit} type="submit">Login {isLoggin && <div className="btn-loader lds-dual-ring"></div>}</button>
                    </form>
              </div> {/* ./card-body */}
            </div> {/* ./card */}
          </div> {/* ./row */}
        </div> {/* ./content */}
      </div>
    );
  }
}

export default Loginpage;



// WEBPACK FOOTER //
// ./src/components/pages/loginPage.js
