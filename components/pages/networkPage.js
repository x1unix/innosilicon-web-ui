import React, { Component } from 'react';
import axios from 'axios';
import {isValidNetMask,isValidIP,generateUrlEncoded,getStorage,deleteStorage} from '../lib/utils'
import { Redirect } from 'react-router-dom';

class Networkpage extends Component {

  constructor(props) {
    super(props);

    this.state = {
        fields: {
          "ipaddress":"",
          "netmask":"",
          "gateway":"",
          "dns1":"",
          "dns2":"",
          "dhcp":""
        },
        fieldsValidation: {
          "ipaddress":true,
          "netmask":true,
          "gateway":true,
          "dns1":true,
          "dns2":true
        },
        "isLoaded": false,
        "updatingNetwork":false,
        "alert": {"type":"","message":""},
        "redirectToLogin":false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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
        axios.post(window.customVars.urlPrefix+window.customVars.apiNetwork,postData,axiosConfig)
        .then(res => {
          if (res.data.success==true) {
            var fields={
              "ipaddress":res.data.ipaddress,
              "netmask":res.data.netmask,
              "gateway":res.data.gateway,
              "dns1":res.data.dns1,
              "dns2":res.data.dns2,
              "dhcp":res.data.dhcp};


              page.setState({fields:fields,isLoaded:true});
          } else {
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

  validateForm() {
    var { fields,fieldsValidation,isLoaded,updatingNetwork,alert } = this.state;

    if (fields.dhcp!=="dhcp") {
      fieldsValidation.ipaddress=isValidIP(fields.ipaddress);
      fieldsValidation.netmask=isValidNetMask(fields.netmask);
      fieldsValidation.gateway=isValidIP(fields.gateway);
      fieldsValidation.dns1=isValidIP(fields.dns1);
      fieldsValidation.dns2=isValidIP(fields.dns2);
    }

    if (fields.dhcp==="dhcp"||(fieldsValidation.ipaddress&&fieldsValidation.netmask&&fieldsValidation.gateway&&fieldsValidation.dns1&&fieldsValidation.dns2)) {
      var token=getStorage("jwt");
      if (token===null) {
        this.setState({"redirectToLogin":true});
      } else {
            updatingNetwork=true;
            var data=[];
            var strSend="";

            data=fields;
            var formBody = [];
            Object.keys(fields).forEach(function(index)  {
              if (index==="dns1"||index==="dns2") {
                var encodedKey = encodeURIComponent("dns[]");
                var encodedValue = encodeURIComponent(fields[index]);
                formBody.push(encodedKey + "=" + encodedValue);
              } else {
                var encodedKey = encodeURIComponent(index);
                var encodedValue = encodeURIComponent(fields[index]);
                formBody.push(encodedKey + "=" + encodedValue);
              }
            });
            strSend=formBody.join("&");


            var comp=this;
            let axiosConfig = {
              headers: {
                  'Authorization': 'Bearer ' + token
              }
            };
            axios.post(window.customVars.urlPrefix+window.customVars.apiUpdateNetwork, strSend,axiosConfig)
              .catch(function (error) {

              });

            if (fields.dhcp!=="dhcp")
              this.checkNewIp(fields.ipaddress);
            if (fields.dhcp==="dhcp") {
                alert={"type":"info","message":"The miner will take a new IP from the DHCP server, please find it and connect to it!"};
            } else {
                alert={"type":"info","message":"The miner will be available at the IP "+fields.ipaddress+" the browser will be redirected to that IP when the miner becomes avialble."};

            }
      }

    }


    this.setState({fieldsValidation:fieldsValidation,updatingNetwork:updatingNetwork,alert:alert});

  }

  checkNewIp(ip) {
    var comp=this;

    axios.get('http://'+ip+'/'+window.customVars.apiPing)
    .then(function (response) {
      window.location="http://"+ip;
    })
    .catch(function (error) {
      setTimeout(() => {
        comp.checkNewIp(ip);
      }, 5000);
    });
  }


  handleSubmit(event) {
    event.preventDefault();
    this.validateForm();

  }

  handleInputChange(event) {
   var { fields,fieldsValidation,isLoaded,updatingNetwork,alert } = this.state;
   const target = event.target;
   const value = target.type === 'checkbox' ? target.checked : target.value;
   const name = target.name;
   if (name==="dhcp") {
     fields[name]=(target.checked?"dhcp":"static");
   } else {
     fields[name]=value;
   }

   this.setState({"fields":fields,"fieldsValidation":fieldsValidation,"isLoaded":isLoaded,"updatingNetwork":updatingNetwork,alert:alert});
  }

  render() {
    const { fields,fieldsValidation,isLoaded,updatingNetwork,alert,redirectToLogin } = this.state;

    if (redirectToLogin) {
      return <Redirect to="/login?expired" />;
    }

    var token=getStorage("jwt");
    var user=getStorage("userName");
    var isAdmin=false;
    if (token!==null&&user!==null) {
      if (user=="admin")
        isAdmin=true;
    }

    return (
      <div className="Networkpage">

      <h1>Settings<br/><small>Network</small></h1>


          <div className="row">


          {/* Box */}
          <div className="col-md-12 mt-5">
              <div className="box">
                  <div className="box-header">
                      <h3>Network Settings {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                  </div>

                  <div className="box-body p-4">

                      {alert.type!=="" &&
                        <div className="alert alert-info">
                          {alert.message}
                        </div>
                      }

                     <div className="form-group row mt-4 ">
                         <label htmlFor="inputDhcp" className="col-sm-2 col-form-label">DHCP</label>
                         <div className="col-sm-10">
                             <input name="dhcp" disabled={!isLoaded||!isAdmin} onChange={this.handleInputChange} type="checkbox" checked={fields.dhcp==="dhcp"} id="inputDhcp" /> &nbsp;&nbsp;
                             <small>Please check this box if you want the miner to receive an IP address automatically from your DHCP server.</small>
                         </div>
                     </div>
                      <div className={"form-group row mt-4 " + (!fieldsValidation.ipaddress && "has-error")}>
                          <label htmlFor="inputIp" className="col-sm-2 col-form-label">IP</label>
                          <div className="col-sm-10">
                              <input type="text" name="ipaddress" disabled={this.state.fields.dhcp==="dhcp"||!isLoaded} value={this.state.fields.ipaddress} onChange={this.handleInputChange} className="form-control form-control-sm" id="inputIp" placeholder="Ip Address" />
                          </div>
                      </div>
                      <div className={"form-group row " + (!fieldsValidation.netmask && "has-error")}>
                          <label htmlFor="inputNetmask" className="col-sm-2 col-form-label">Netmask</label>
                          <div className="col-sm-10">
                              <input type="text" name="netmask" disabled={this.state.fields.dhcp==="dhcp"||!isLoaded} value={this.state.fields.netmask} onChange={this.handleInputChange} className="form-control form-control-sm" id="inputNetmask" placeholder="Netmask" />
                          </div>
                      </div>
                      <div className={"form-group row " + (!fieldsValidation.gateway && "has-error")}>
                          <label htmlFor="inputGateway" className="col-sm-2 col-form-label">Gateway</label>
                          <div className="col-sm-10">
                              <input type="text" name="gateway" disabled={this.state.fields.dhcp==="dhcp"||!isLoaded} value={this.state.fields.gateway} onChange={this.handleInputChange} className="form-control form-control-sm" id="inputGateway" placeholder="Gateway" />
                          </div>
                      </div>
                      <div className={"form-group row " + (!fieldsValidation.dns1 && "has-error")}>
                          <label htmlFor="inputDns1" className="col-sm-2 col-form-label">DNS 1</label>
                          <div className="col-sm-10">
                              <input type="text" name="dns1" disabled={this.state.fields.dhcp==="dhcp"||!isLoaded} value={this.state.fields.dns1} onChange={this.handleInputChange} className="form-control form-control-sm" id="inputDns1" placeholder="Name Server 1" />
                          </div>
                      </div>
                      <div className={"form-group row " + (!fieldsValidation.dns2 && "has-error")}>
                          <label htmlFor="inputDns2" className="col-sm-2 col-form-label">DNS 2</label>
                          <div className="col-sm-10">
                              <input type="text" name="dns2" disabled={this.state.fields.dhcp==="dhcp"||!isLoaded} value={this.state.fields.dns2} onChange={this.handleInputChange} className="form-control form-control-sm" id="inputDns2" placeholder="Name Server 2" />
                          </div>
                      </div>
                      {(!fieldsValidation.ipaddress || !fieldsValidation.netmask || !fieldsValidation.gateway || !fieldsValidation.dns1 || !fieldsValidation.dns2) &&
                      <div className="alert alert-warning">
                        Please correct the fields that are in red
                      </div>
                      }
                  </div>
                  {isAdmin &&
                  <div className="box-footer">
                      <button disabled={!isLoaded||updatingNetwork} className="btn btn-primary" onClick={this.handleSubmit}>Update {updatingNetwork && <div className="btn-loader lds-dual-ring"></div>}</button>
                  </div>
                  }
              </div>
          </div>
          {/* ./ Box  */}

          </div>
          {/* ./row */}

      </div>
    );
  }
}

export default Networkpage;



// WEBPACK FOOTER //
// ./src/components/pages/networkPage.js
