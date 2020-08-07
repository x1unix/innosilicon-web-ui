import React, { Component } from 'react';
import axios from 'axios';
import {getStorage,setStorage,deleteStorage,generateUrlEncoded} from '../lib/utils'
import { Redirect } from 'react-router-dom';

class OverViewpage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      type:"",
      version:["build_date": "",
        "ethaddr": "",
        "hwver": "",
        "platform_v": ""],
      network: ["dns1","",
        "dns2": "",
        "ipaddress": "",
        "dhcp": "",
        "netmask": "",
        "gateway": ""],
      hardware: [  "cacheUsed": "",
        "cacheFree": "",
        "memTotal": "",
        "memFree": "",
        "status": "",
        "memUsed": "",
        "cacheTotal": ""],
      isLoaded: false,
      redirectToLogin:false
    };

  }


  componentDidMount() {
    var comp=this;

    //Get System
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
      axios.post(window.customVars.urlPrefix+window.customVars.apiOverview,postData,axiosConfig)
      .then(function (response) {
        if (response.data.success==true)
        comp.setState({"type":response.data.type,"hardware":response.data.hardware,"version":response.data.version,"network":response.data.network,"isLoaded":true})
      })
      .catch(function (error) {

      });
    }
  }



  render() {
    const { hardware,version,type,network,isLoadedSystem,isLoaded,redirectToLogin } = this.state;

    if (redirectToLogin) {
      return <Redirect to="/login?expired" />;
    }


    return (
      <div className="OverViewpage">

      <h1>Overview<br/><small>Miner Status</small></h1>
            <div className="row">

                {/* Box */}
               <div className="col-md-6 mt-5">
                 <div className="box">
                   <div className="box-header">
                     <h3>Version {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                   </div>
                    <div className="box-body p-4">
                        <div className="row">
                            <div className="col-md-6">
                               <span className="field-title">Type</span>
                            </div>
                            <div className="col-md-6 field-value">
                               {type}
                            </div>
                        </div>
                        <div className="row mt-3">
                             <div className="col-md-6">
                                 <span className="field-title">Controller Version</span>
                             </div>
                             <div className="col-md-6 field-value">
                                 {version.hwver}
                             </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6">
                                <span className="field-title">MAC Address</span>
                            </div>
                            <div className="col-md-6 field-value">
                                {version.ethaddr}
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6">
                                <span className="field-title">Build Date</span>
                            </div>
                            <div className="col-md-6 field-value">
                                {version.build_date}
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6">
                                <span className="field-title">Platform Version</span>
                            </div>
                            <div className="col-md-6 field-value">
                                {version.platform_v}
                            </div>
                        </div>

                    </div>

                 </div>
               </div>
               {/* ./ Box  */}
                {/* Box */}
                <div className="col-md-6 mt-5">
                    <div className="box">
                        <div className="box-header">
                            <h3>Network Status {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                        </div>
                        <div className="box-body p-4">
                            <div className="row">
                                <div className="col-md-6">
                                    <span className="field-title">Type</span>
                                </div>
                                <div className="col-md-6 field-value">
                                    {network.dhcp}
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <span className="field-title">IP</span>
                                </div>
                                <div className="col-md-6 field-value">
                                    {network.ipaddress}
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <span className="field-title">Netmask</span>
                                </div>
                                <div className="col-md-6 field-value">
                                    {network.netmask}
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <span className="field-title">Gateway</span>
                                </div>
                                <div className="col-md-6 field-value">
                                    {network.gateway}
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <span className="field-title">Name Server 1</span>
                                </div>
                                <div className="col-md-6 field-value">
                                    {network.dns1}
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <span className="field-title">Name Server 2</span>
                                </div>
                                <div className="col-md-6 field-value">
                                    {network.dns2}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {/* ./ Box  */}


            </div>
            {/* ./row */}

            <div className="row">

                {/* Box */}
                <div className="col-md-12 mt-5">
                    <div className="box">
                        <div className="box-header">
                            <h3>System {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                        </div>
                        <div className="box-body p-4">
                            <div className="row">
                                <div className="col-md-6">
                                    <span className="field-title">Uptime</span>
                                </div>
                                <div className="col-md-6 field-value">
                                    {hardware.status}
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <span className="field-title">Memory Used</span>
                                </div>
                                {hardware.memUsed >0 &&
                                <div className="col-md-6 field-value">
                                    <span className="small">{hardware.memUsed} kb / {hardware.memTotal} kb</span>
                                    <div className="progress">
                                        <div className="progress-bar" role="progressbar"  style={{width: (hardware.memUsed/hardware.memTotal*100).toFixed(0) + "%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{(hardware.memUsed/hardware.memTotal*100).toFixed(0)}%</div>
                                    </div>
                                </div>
                                }
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <span className="field-title">Memory Free</span>
                                </div>
                                {hardware.memFree >0 &&
                                <div className="col-md-6 field-value">
                                    <span className="small">{hardware.memFree} kb / {hardware.memTotal} kb</span>
                                    <div className="progress">
                                        <div className="progress-bar" role="progressbar"  style={{width: (hardware.memFree/hardware.memTotal*100).toFixed(0) + "%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{(hardware.memFree/hardware.memTotal*100).toFixed(0)}%</div>
                                    </div>
                                </div>
                                }
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <span className="field-title">Cached Used</span>
                                </div>
                                {hardware.cacheUsed >0 &&
                                <div className="col-md-6 field-value">
                                    <span className="small">{hardware.cacheUsed} kb / {hardware.cacheTotal} kb</span>
                                    <div className="progress">
                                        <div className="progress-bar" role="progressbar"  style={{width: (hardware.cacheUsed/hardware.cacheTotal*100).toFixed(0) + "%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{(hardware.cacheUsed/hardware.cacheTotal*100).toFixed(0)}%</div>
                                    </div>
                                </div>
                                }
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <span className="field-title">Cached Free</span>
                                </div>
                                {hardware.cacheFree >0 &&
                                <div className="col-md-6 field-value">
                                    <span className="small">{hardware.cacheFree} kb / {hardware.cacheTotal} kb</span>
                                    <div className="progress">
                                        <div className="progress-bar" role="progressbar"  style={{width: (hardware.cacheFree/hardware.cacheTotal*100).toFixed(0) + "%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{(hardware.cacheFree/hardware.cacheTotal*100).toFixed(0)}%</div>
                                    </div>
                                </div>
                                }
                            </div>
                        </div>

                    </div>
                </div>
                {/* ./ Box  */}



            </div>
            {/* ./row */}

      </div>
    );
  }
}

export default OverViewpage;



// WEBPACK FOOTER //
// ./src/components/pages/overViewPage.js
