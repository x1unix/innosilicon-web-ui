import React, { Component } from 'react';
import axios from 'axios';
import {
  Redirect
} from 'react-router-dom';

import {getStorage,deleteStorage,generateUrlEncoded} from '../lib/utils'

class FreqVolPage extends Component 
{

  constructor(props) 
  {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      freqvol: {
        "freq":"",
        "vol":""
      },
      fieldsValidation: 
      {
        "Freq":true,
        "Vol":true,
      },
      updatingFreqVol: false,
      isLoaded: false,
      showAlert: false,
      redirectToIndex:false,
      type: "",
      tuningUpdated:false,
      errorUpdating:false,
      redirectToLogin:false,
      hasErrors:false
    };


  }


  componentDidMount() 
  {
    var { pools,fieldsValidation,isLoaded,showAlert,updatingFreqVol,redirectToIndex } = this.state;
    var token=getStorage("jwt");
    if (token===null) 
    {
      this.setState({"redirectToLogin":true});
    } 
    else 
    {
      var comp=this;
      var postData = {

      };
      let axiosConfig = 
      {
        headers:
        {
            'Authorization': 'Bearer ' + token
        }
      };
      axios.post(window.customVars.urlPrefix+window.customVars.apiConfigFreqVol,postData,axiosConfig)
      .then(res => 
        {
          if (res.data.success === true) 
          {
            var freqvol={
              "freq":res.data.freq,
              "vol":res.data.vol,
            };
            comp.setState({
              freqvol: freqvol,
              isLoaded: true
            });
          } 
          else 
          {
            if ((typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired") 
            {
                deleteStorage("jwt");
                comp.setState({"redirectToLogin":true});
            } 
            else 
            {
              comp.setState({
                isLoaded: true
              });
            }

          }
      });


    }

  }

  handleInputChange(event) 
  {
   var { freqvol } = this.state;

   const target = event.target;
   const name = target.name;
   freqvol[name]=target.value;

   this.setState({freqvol: freqvol});
  }

  handleSubmit(event) 
  {
    event.preventDefault();
    var { freqvol,fieldsValidation,isLoaded,showAlert,updatingFreqVol,redirectToIndex } = this.state;

    fieldsValidation={
      "Freq":true,
      "Vol":true,
    }
    var hasErrors=false;
    //freq and vol required
    if (freqvol.freq=="" || isNaN(freqvol.freq)) 
    {
      fieldsValidation["Freq"]=false;
      hasErrors=true;
    }
    if (freqvol.vol=="" || isNaN(freqvol.vol)) 
    {
      fieldsValidation["Vol"]=false;
      hasErrors=true;
    }

    if (!hasErrors) 
    {
        this.setState({hasErrors:false,fieldsValidation:fieldsValidation});
        var token=getStorage("jwt");
        if (token===null) 
        {
          this.setState({"redirectToLogin":true});
        } 
        else 
        {
            if (updatingFreqVol)
              return;

              var postFreqVol=[];
              postFreqVol['Freq'] = freqvol.freq;
              postFreqVol['Vol'] = freqvol.vol;
              var strSend = generateUrlEncoded(postFreqVol);

              var comp=this;
              comp.setState({updatingFreqVol:true});
              let axiosConfig = 
              {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
              };

              axios.post(window.customVars.urlPrefix+window.customVars.apiSetFreqVol, strSend,axiosConfig)
              .then(function (response) 
              {
                if(response.data.success === true)
                {
                    comp.setState({tuningUpdated:true});
                    setTimeout(() => 
                    {
                      comp.setState({redirectToIndex:true});
                    }, 5000);
                } 
                else if(response.data.success === false) 
                {
                  comp.setState({errorUpdating:true,updatingFreqVol:false});
                }
              })
              .catch(function (error) 
              {
                comp.setState({updatingFreqVol:false});
              });

          }
        } else {
            this.setState({hasErrors:true,fieldsValidation:fieldsValidation});
        }
  }


  render() 
  {
    const { pools,fieldsValidation,isLoaded,showAlert,updatingFreqVol,redirectToIndex,type,tuningUpdated,errorUpdating,redirectToLogin,hasErrors } = this.state;
    if (redirectToIndex) 
    {
      return <Redirect to="/?restarting" />;
    }
    if (redirectToLogin) 
    {
      return <Redirect to="/login?expired" />;
    }
    var token=getStorage("jwt");
    var user=getStorage("userName");
    var isAdmin=false;
    if (token!==null&&user!==null) 
    {
      if (user=="admin")
        isAdmin=true;
    }


    return (
      <div className="FreqVolPage">

      <h1>Settings<br/><small>Mining Tuning</small></h1>

          {tuningUpdated &&
            <div className="alert alert-success mt-5">
              Tuning updated successfully! Restarting service, please wait <div className="btn-loader lds-dual-ring pt-1"></div>
            </div>
          }

          {errorUpdating &&
            <div className="alert alert-warning mt-5">
              It was not possible to restart the service, please restart the miner manually
            </div>
          }

          {hasErrors &&
            <div className="alert alert-warning mt-5">
              Some fields in your form are invalid, please check the fields highlighted in red.
            </div>
          }


          {/* <div className="alert alert-info mt-5">
            Please ensure that your tuning settings are compatible with stratum version-rolling extension
          </div> */}

          <div className="row">
             <div className="col-md-12 mt-5">
               <div className="box">
                 <div className="box-header">
                   <h3>Tuning Settings  {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                 </div>
                     {isLoaded &&
                     <div className="box-body p-4">
                        <div className={"form-group " + (!fieldsValidation.Freq && "has-error")}>
                          <label htmlFor="inputFrequency">Frequency</label>
                            <div className="input-group mb-2">
                              <input type="text" className="form-control form-control-sm"  name="freq" value={this.state.freqvol.freq} onChange={this.handleInputChange} id="inputFrequency" placeholder="Tuning Frequency" />
                            </div>
                        </div>
                        <div className={"form-group " + (!fieldsValidation.Vol && "has-error")}>
                          <label htmlFor="inputVoltage">Voltage</label>
                            <div className="input-group mb-2">
                                <input type="text" className="form-control form-control-sm"  name="vol"  value={this.state.freqvol.vol} onChange={this.handleInputChange} id="inputVoltage" placeholder="Tuning Voltage" />
                            </div>
                        </div>
                     </div>
                     }
               </div>
             </div>
          </div>

          <div className="row mt-5">
              {isAdmin &&
              <div className="col-md-12 text-center">
              <br />
                    <button ref="btn" disabled={!isLoaded||updatingFreqVol} onClick={this.handleSubmit} className="btn btn-primary">Update Settings {updatingFreqVol && <div className="btn-loader lds-dual-ring"></div>}</button>
                  {showAlert &&
                  <div id="poolsAlert" className="alert alert-warning mt-3">
                      Please check your freq and vol configuration, invalid fields are in red!
                  </div>
              }
              </div>
              }
          </div>

      </div>
    );
  }
}

export default FreqVolPage;



// WEBPACK FOOTER //
// ./src/components/pages/freqvolPage.js
