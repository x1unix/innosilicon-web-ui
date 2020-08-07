import React, { Component } from 'react';
import {
  Redirect
} from 'react-router-dom';
import axios from 'axios';
import {generateUrlEncoded,getStorage,deleteStorage} from '../lib/utils'


class Upgradepage extends Component {

  constructor(props) {
    super(props);

    this.state = {
        fields: {

        },
        upgrading:false,
        upgraded:false,
        upgradePercent:0,
        rebooting:false,
        redirectToIndex:false,
        redirectToLogin:false,
        errorMessage: "",
        upgradeMessages:[],
        upgradeStatus:"",
        upgradeStep:"",
        upgradeStepCount:"",
        upgradeDidRun: false,
        uploadPercent: 0,
        checkingLatestFirmware: false,
        latestFirmware: null,
        errorCheckingLatestFirmware: "",
        type: "upload",
        firmwareNotExist:false,
        restarting:false,
        restarted:false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.upgradeFromUrl = this.upgradeFromUrl.bind(this);
    this.checkLatestFirmware = this.checkLatestFirmware.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.restartSwupdate = this.restartSwupdate.bind(this);

  }

  componentWillUnmount() {
    if (typeof this.timeOutLoad !== 'undefined')
      clearTimeout(this.timeOutLoad);
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


  updateStatus(status) {
    this.setState({upgradeStatus:status});
    switch (status) {
      case 'START':
        this.setState({"upgradePercent":0});
        break
      case 'RUN':
        break
      case 'SUCCESS':
        this.setState({"upgraded":true,"upgrading":false});
        this.checkMiner();
        break
      case 'FAILURE':
        this.setState({"upgrading":false});
        break
      default:
        break
    }
  }

  upgrade(type) {
    var { upgrading, upgradeMessages,upgradeStatus,latestFirmware,uploadPercent } = this.state;


      if (!upgrading) {
        if (type==="upload"&&(this.fileInput.files[0]==null||this.fileInput.files[0].name.split('.').pop()!="swu"||(this.fileInput.files[0].size / Math.pow(1024,2)).toFixed(2) > 100)) {
          this.setState({errorMessage:"Please insert a valid firmware file."})
        } else {

          var token=getStorage("jwt");
          if (token===null) {
            this.setState({"redirectToLogin":true});
          } else {

            var comp=this;




            var ws = new WebSocket('ws://' + window.location.host + window.location.pathname.replace(/\/[^\/]*$/, '') + window.customVars.apiUpgradeProgress)
            upgradeMessages=[];

            ws.onmessage = function (event) {
              var msg = null;
              var downloadProgress=0;
              try {
                msg = JSON.parse(event.data)
              } catch(e) {
                //json is malformed, ingore it (info response) bug from swupdate
              }
              if (msg!=null) {
                switch (msg.type) {
                  case 'message':
                    if (msg.text.indexOf("Received")>=0&&msg.text.indexOf("percent")>=0) { //Is download progress
                      try {
                        var downloadJson=JSON.parse(msg.text);
                        if (typeof downloadJson !== "undefined"&&typeof downloadJson.percent !== "undefined" && downloadJson.percent!=uploadPercent) {
                          comp.setState({"uploadPercent":downloadJson.percent});
                        }
                      } catch(e) {}
                    } else {
                      upgradeMessages.push({"level":msg.level,"text":msg.text})
                      comp.setState({"upgradeMessages":upgradeMessages});
                    }
                    break
                  case 'status':
                    comp.updateStatus(msg.status);
                    break
                  case 'source':
                    break
                  case 'step':
                    var percent = Math.round((100 * (Number(msg.step) - 1) + Number(msg.percent)) / Number(msg.number))
                    //var value = percent + '%' + ' (' + msg.step + ' of ' + msg.number + ')'
                    var upgradeStepCount=msg.step + ' of ' + msg.number;
                    comp.setState({"upgradeStep":msg.name,"upgradeStepCount":upgradeStepCount,"upgradePercent":percent});
                    break
                }
              }
            }

            if (type==="upload") {
              comp.setState({"upgradeStatus":"IDLE","upgradeStep":"Uploading","upgradeMessages":[],"upgradeDidRun":true});
              const config = {
                onUploadProgress: function(progressEvent) {
                  var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                  comp.setState({uploadPercent:percentCompleted});
                },
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data'
                }
              }
              this.setState({upgrading:true,errorMessage:""});
              var fd = new FormData();
              fd.append("upfile", this.fileInput.files[0]);

              axios.post(window.customVars.urlPrefix+window.customVars.apiUpgrade, fd, config)
              .then(function (res) {
                  if (res.data.success === true) {

                  }
              })
              .catch(function (error) {
                  if (error.response&&error.response.status == 401) {
                    deleteStorage("jwt");
                    comp.setState({"redirectToLogin":true});
                  }

              });
            } else if (type=="download"){
              comp.setState({"upgradeStatus":"IDLE","upgradeStep":"Downloading","upgradeMessages":[],"upgradeDidRun":true});
              if (latestFirmware!=null && latestFirmware.url!="") {
                const config = {
                  headers: {
                      'Authorization': 'Bearer ' + token
                  }
                }
                this.setState({upgrading:true,errorMessage:""});
                var postData=new Array();
                postData["url"]=latestFirmware.url;
                var strSend = generateUrlEncoded(postData);

                axios.post(window.customVars.urlPrefix+window.customVars.apiUpgradeDownload, strSend, config)
                .then(function (res) {
                    if (res.data.success === true) {

                    }
                })
                .catch(function (error) {
                    if (error.response&&error.response.status == 401) {
                      deleteStorage("jwt");
                      comp.setState({"redirectToLogin":true});
                    }

                });
              }
            }


          }


        }
      }
  }
  upgradeFromUrl() {
    this.upgrade("download");
    this.setState({"type":"download"});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.upgrade("upload");
    this.setState({"type":"upload"});
  }
    restartSwupdate()
    {
        this.setState({"restarting":true});
        var page=this;
        var token=getStorage("jwt");
        if (token===null)
        {
            this.setState({"redirectToLogin":true});
        }
        else
        {
            var postData = {

            };
            let axiosConfig = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };
            axios.post(window.customVars.urlPrefix+window.customVars.apiRestartSwupdate,postData,axiosConfig)
                .then(res => {
                    if (res.data.success)
                    {
                        this.setState({"restarting":false,"restarted":true});
                    }
                    else
                    {
                        if ((typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired")
                        {
                            deleteStorage("jwt");
                            window.location.reload();
                        }
                    }

                })
                .catch(function (error)
                {

                });
        }
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
                window.location.reload();
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


  checkLatestFirmware(event) {
    event.preventDefault();
    var token=getStorage("jwt");
    if (token===null) {
      this.setState({"redirectToLogin":true});
    } else {
      this.setState({"checkingLatestFirmware":true,"errorCheckingLatestFirmware":""});

      var postData = {

      };
      var strSend = generateUrlEncoded({"type":"latest"});
      let axiosConfig = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
      };
      axios.post(window.customVars.urlPrefix+window.customVars.apiLatestFirmwareVersion,strSend,axiosConfig)
      .then(res => {
          if (res.data.success) {
            var latestFirmware={
              "version":res.data.version,
              "versionDate":res.data.versionDate,
              "info":res.data.info,
              "url":res.data.url,
              "currentVersion":res.data.currentVersion,
              "currentVersionDate":res.data.currentVersionDate,
              "isUpdated":res.data.isUpdated
            };
            this.setState({"latestFirmware":latestFirmware,"checkingLatestFirmware":false});
          }
          else if(res.data.success === false)
          {
              this.setState({"firmwareNotExist":true,"checkingLatestFirmware":false})
          }
          else {
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


  handleInputChange(event) {
   const target = event.target;
   const value = target.type === 'checkbox' ? target.checked : target.value;
   const name = target.name;

  }

  render() {
    const {
      upgrading,
      errorMessage,
      keepSettings,
      upgradePercent,
      uploadPercent,
      upgraded,
      redirectToIndex,
      redirectToLogin,
      upgradeStatus,
      upgradeMessages,
      upgradeStep,
      upgradeStepCount,
      upgradeDidRun,
      rebooting,
      checkingLatestFirmware,
      latestFirmware,
      errorCheckingLatestFirmware,
      type,
      firmwareNotExist,
      restarting,
      restarted
     } = this.state;

    if (redirectToIndex) {
      return <Redirect to="/?rebooting" />;
    }

    return (
      <div className="Upgradepage">

      <h1>Maintenance<br/><small>Firmware</small></h1>

        <div className="row">

           {/* Box  */}
           <div className="col-md-7 mt-5">
             <div className="box">
               <div className="box-header">
                 <h3>Upgrade</h3>
               </div>
                   <div className="box-body p-4">

                       {!upgraded &&
                       <div>
                           <ol className="small">
                           <li>The update.swu file should be obtained from our support center</li>
                           <li>Do not power off or refresh this page during the upgrade process</li>
                           <li>All your settings will be preserved</li>
                           </ol>



                             <div className="form-group row">
                                 <div className="col-md-12 text-center">
                                     <input ref={input => {this.fileInput = input;}} type="file" className="form-control-sm" id="inputImage" placeholder="Upload Firmware" />
                                 </div>
                             </div>

                             {errorMessage!="" &&
                               <div className="alert alert-warning small">
                                {errorMessage}
                               </div>
                              }
                               {restarted &&
                               <div className="alert alert-warning">
                                    <span>The Upgrader has been reset successfully!</span>
                               </div>
                               }
                           </div>
                           }

                          {upgradeDidRun &&
                            <div>

                               <h5 className="mt-4">Upgrade process</h5>
                               <div className="row mt-2">
                                  <div className="col-md-3 field-title">
                                    Status
                                  </div>
                                  <div className="col-md-9 field-value">
                                    <span className={upgradeStatus=="FAILURE" ? "text-warning":""}>{upgradeStatus}</span>
                                  </div>
                               </div>
                               <div className="row mt-2">
                                  <div className="col-md-3 field-title">
                                    {type==="upload" && "Upload"}{type==="download" && "Download"} progress
                                  </div>
                                  <div className="col-md-9">
                                    <div className="progress">
                                       <div className="progress-bar" role="progressbar" style={{width: uploadPercent + "%"}} aria-valuenow={uploadPercent} aria-valuemin="0" aria-valuemax="100">{uploadPercent}%</div>
                                    </div>
                                  </div>
                               </div>
                               <div className="row mt-2">
                                  <div className="col-md-3 field-title">
                                     Upgrade progress
                                  </div>
                                  <div className="col-md-9">
                                    <div className="progress">
                                       <div className="progress-bar" role="progressbar" style={{width: upgradePercent + "%"}} aria-valuenow={upgradePercent} aria-valuemin="0" aria-valuemax="100">{upgradePercent}%</div>
                                    </div>
                                  </div>
                               </div>
                               <div className="row mt-2">
                                  <div className="col-md-3 field-title">
                                    Step
                                  </div>
                                  <div className="col-md-9 field-value">
                                    {upgradeStep} <i>{upgradeStepCount}</i>
                                  </div>
                               </div>

                               <p className="text-center mt-3">
                                <button className="btn btn-secondary btn-sm" type="button" data-toggle="collapse" data-target="#collapseDetails" aria-expanded="false" aria-controls="collapseDetails">
                                  View details
                                </button>
                               </p>

                              <div className="collapse" id="collapseDetails">
                                <div className="card card-body">
                                  <ul className="small">
                                  {this.state.upgradeMessages.map((message, index) => (
                                     <li className={message.level<=3 &&"text-warning"}>{message.text}</li>
                                  ))}
                                  </ul>
                                </div>
                              </div>




                              {upgraded &&
                              <div className="alert alert-info small" role="alert">
                                 <h4 className="alert-heading">Rebooting <div className="btn-loader lds-dual-ring"></div></h4>
                                 The firmware has been upgraded and the miner is rebooting. You will be redirected to login page once miner has started.
                                 <hr/>
                                 <p className="mb-0">Please wait...</p>
                               </div>
                              }

                           </div>
                          }

                   </div>




                   {!upgraded &&
                   <div className="box-footer">
                       <button disabled={upgrading} className="btn btn-primary" onClick={this.handleSubmit}>Upgrade Now {upgrading && <div className="btn-loader lds-dual-ring"></div>}</button>
                       <button disabled={restarting} className="btn btn-primary ml-3 float-right" onClick={this.restartSwupdate}>Reset Upgrader {restarting && <div className="btn-loader lds-dual-ring"></div>}</button>
                   </div>
                   }

             </div>
           </div>
           {/* ./ Box  */}
           {/* Box  */}
           <div className="col-md-5 mt-5">
             <div className="box">
               <div className="box-header">
                 <h3>Latest Firmware</h3>
               </div>
                   <div className="box-body p-4 small">
                    Check for firmware updates.


                   {latestFirmware &&
                     <div>

                        <h6 className="mt-4">Installed Version
                        {latestFirmware.isUpdated && <span className="badge badge-success small ml-2">Updated</span>}
                        {!latestFirmware.isUpdated && <span className="badge badge-warning small ml-2">Not Updated</span>}</h6>
                        {!latestFirmware.isUpdated &&
                         <div>
                            <div className="row mt-2">
                               <div className="col-md-4 field-title">
                                 Current Version
                               </div>
                               <div className="col-md-8 field-value">
                                 {latestFirmware.currentVersion}<br/>{latestFirmware.currentVersionDate}
                               </div>
                            </div>
                            <div className="row mt-2">
                               <div className="col-md-4 field-title">
                                 Latest Version
                               </div>
                               <div className="col-md-8 field-value">
                                 {latestFirmware.version}<br/>{latestFirmware.versionDate}
                               </div>
                            </div>
                            <div className="row mt-2">
                               <div className="col-md-4 field-title">
                                  Download Link
                               </div>
                               <div className="col-md-8 field-value">
                                  <a href={latestFirmware.url} target="_blank" title="Download Now">Download Now</a>
                               </div>
                            </div>
                            <div className="row mt-2">
                               <div className="col-md-4 field-title">
                                  Version Information
                               </div>
                               <div className="col-md-8 field-value">
                                  {latestFirmware.info}
                               </div>
                            </div>
                        </div>
                        }
                        {latestFirmware.isUpdated &&
                          <div className="alert alert-info">
                            No updates available
                          </div>
                        }
                    </div>
                   }

                   {firmwareNotExist &&
                       <div>
                           <div className="alert alert-info">
                               No updates available
                           </div>
                       </div>
                   }

                   {errorCheckingLatestFirmware &&
                      <div className="alert alert-warning small">
                        {errorCheckingLatestFirmware}
                      </div>
                   }
                   </div> {/*.box-body*/}

                   <div className="box-footer clearfix">
                       <button disabled={checkingLatestFirmware} className="btn btn-primary float-left" onClick={this.checkLatestFirmware}>Check Now {checkingLatestFirmware && <div className="btn-loader lds-dual-ring"></div>}</button>
                       {latestFirmware!=null && !latestFirmware.isUpdated && !upgraded &&
                       <button disabled={checkingLatestFirmware||upgrading} className="btn btn-secondary float-right" onClick={this.upgradeFromUrl}>Upgrade Now {upgrading && <div className="btn-loader lds-dual-ring"></div>}</button>
                       }
                   </div>


             </div>
           </div>
        </div>
      </div>
    );
  }
}

export default Upgradepage;



// WEBPACK FOOTER //
// ./src/components/pages/upgradePage.js
