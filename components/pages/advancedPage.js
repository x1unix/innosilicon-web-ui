import React, { Component } from 'react';
import axios from 'axios';
import {
  Redirect
} from 'react-router-dom';

import {generateUrlEncoded} from '../lib/utils'

class Advancedpage extends Component {

  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.autoTune = this.autoTune.bind(this);
    this.state = {
      isLoaded: false,
      redirectToIndex:false,
      fields: [
      "Voltage": "",
      "vidmode": "",
      "Frequency": "",
      "perflevel": "",
      "fanmode": "",
      "fanspeed": ""],
      "isUpdating":false,
      "isAutoTuning":false,
      "defaultVoltage":"",
      "redirectToIndex":false
    };


  }

  autoTune(event) {
    event.preventDefault();
    axios.post(window.customVars.urlPrefix+'/../cgi-bin/selftest.py')
    .then(res => {})
    .catch(function (error) {});

    this.setState({
      isAutoTuning:true
    });
    this.checkAutoTune();
  }

  checkAutoTune() {
    var comp=this;
    axios.get(window.customVars.urlPrefix+"/../conf/defaultVID?v="+new Date)
    .then(res => {
      this.setState({
        isAutoTuning:false,
        defaultVoltage:res.data
      });
    })
    .catch(function (error) {
      setTimeout(() => {
        comp.checkAutoTune();
      }, 10000);
    });
  }


  componentDidMount() {

    axios.get(window.customVars.urlPrefix+'/../conf/miner.conf?v='+new Date)
    .then(res => {
      //const chains = res.data.DEVS;
      var fields=[];
      var neededKeys=["perflevel","vidmode","Frequency","Voltage"];
      Object.keys(res.data).forEach(function (key) {
        if (res.data[key]!==null&&neededKeys.indexOf(key)>=0) {
          fields[key]=res.data[key];
        }

      });

      this.setState({
        fields:fields
      });

    })
    .catch(function (error) {});
    axios.get(window.customVars.urlPrefix+'/../cgi-bin/type.py')
    .then(res => {
      this.setState({
        type: res.data.type,
        isLoaded: true
      });
    })
    .catch(function (error) {});

  }

  handleInputChange(event) {

    var { fields } = this.state;
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if (name==="vidmode") {
      fields[name]=(value?"1":"0");
    } else {
      fields[name]=value;
    }
    this.setState({
      fields:fields
    });
  }

  handleSubmit(event) {
      const { fields } = this.state;
      event.preventDefault();

      if (fields.Voltage>0&&fields.Frequency>0) {
        var strSend = generateUrlEncoded(fields);
        var comp=this;
        comp.setState({
          "isUpdating":true
        });
        axios.post(window.customVars.urlPrefix+'/../cgi-bin/pool.py', strSend)
        .then(function (response) {
          if(response.data.result === 'true'){
            comp.setState({
              "redirectToIndex":true
            });
          }
        })
        .catch(function (error) {
          comp.setState({
            "isUpdating":false
          });
        });
      }

  }


  render() {
    const { fields,isLoaded,type,isUpdating,isAutoTuning,defaultVoltage,redirectToIndex } = this.state;
    if (redirectToIndex) {
      return <Redirect to="/?restarting" />;
    }
    if (isAutoTuning) {
      return(
        <div className="Advancedpage">

        <h1>Settings<br/><small>Advanced</small></h1>
            <div className="row">
                {/* Box Pool 1 */}
               <div className="col-md-12 mt-5">
                 <div className="box">
                   <div className="box-header">
                     <h3>Auto Tuning {isAutoTuning && <div className="lds-dual-ring pull-right"></div>}</h3>
                   </div>
                        <div className="box-body p-4">
                             {isAutoTuning &&
                             <div className="alert alert-info">
                                <strong>Please wait:</strong> Searching the base values for your miner. This may take more than 30 minutes.
                             </div>
                             }
                             {!isAutoTuning &&
                             <div className="alert alert-success">
                                <strong>Success:</strong> The most suitable voltage value for your miner is: <strong>{defaultVoltage}</strong>.
                             </div>
                             }
                       </div>
                 </div>
               </div>
               {/* ./ Box Pool 1 */}
            </div>





        </div>
      )
    }

    let selectVoltage="";
    let selectPerformance="";
    let selectFrequency="";

    switch (type) {
      case 16:
          selectFrequency=(
            <select name="Frequency" disabled={fields.vidmode==="1"} defaultValue={fields.Frequency} onChange={this.handleInputChange} id="inputFrequency" className="from-control form-control-sm">
              <option value="1260">1260</option>
              <option value="1308">1308</option>
              <option value="1320">1320</option>
              <option value="1332">1332 (default)</option>
              <option value="1344">1344 (overclock)</option>
              <option value="1356">1356 (overclock)</option>
            </select>);
            selectVoltage=(
              <select name="Voltage" disabled={fields.vidmode==="1"} defaultValue={fields.Voltage} onChange={this.handleInputChange} id="inputVoltage" className="from-control form-control-sm">
                  <option value="13">13</option>
                  <option value="12">12</option>
                  <option value="11">11</option>
                  <option value="10">10 (default)</option>
                  <option value="9">9</option>
                  <option value="8">8</option>
              </select>);
              selectPerformance=(
                  <div>
                  <select name="perflevel" disabled={fields.vidmode==="0"} defaultValue={fields.perflevel} onChange={this.handleInputChange} id="inputPerformance" className="form-control form-control-sm">
                    <option value="0">Power Save Mode with reduced hashrate</option>
                    <option value="2">High Hashrate Mode with more power consumption</option>
                  </select>
                  <button className="btn btn-sm btn-primary mt-2" disabled={fields.vidmode==="0"} onClick={this.autoTune}>Start Auto Tune</button>
                  </div>
              );
        break;
      case 17:
      selectFrequency=(
        <select name="Frequency" disabled={fields.vidmode==="1"} defaultValue={fields.Frequency} onChange={this.handleInputChange} id="inputFrequency" className="from-control form-control-sm">
          <option value="1260">1260</option>
          <option value="1308">1308</option>
          <option value="1320">1320</option>
          <option value="1332">1332 (default)</option>
          <option value="1344">1344 (overclock)</option>
          <option value="1356">1356 (overclock)</option>
        </select>);
        selectVoltage=(
          <select name="Voltage" disabled={fields.vidmode==="1"} defaultValue={fields.Voltage} onChange={this.handleInputChange} id="inputVoltage" className="from-control form-control-sm">
              <option value="27">27</option>
              <option value="26">26</option>
              <option value="25">25 (efficient)</option>
              <option value="24">24</option>
              <option value="23">23</option>
              <option value="22">22</option>
              <option value="21">21</option>
              <option value="20">20</option>
              <option value="19">19</option>
              <option value="18">18</option>
              <option value="17">17</option>
              <option value="16">16</option>
              <option value="15">15</option>
              <option value="14">14 (default)</option>
              <option value="13">13</option>
          </select>);
      break;
      case 18:
      selectFrequency=(
        <select name="Frequency" disabled={fields.vidmode==="1"} defaultValue={fields.Frequency} onChange={this.handleInputChange} id="inputFrequency" className="from-control form-control-sm">
            <option value="1000">1000</option>
            <option value="1050">1050</option>
            <option value="1100">1100 (default)</option>
            <option value="1130">1130 (overclock)</option>
            <option value="1160">1160 (overclock)</option>
            <option value="1200">1200 (overclock)</option>
        </select>);
        selectVoltage=(
          <select name="Voltage" disabled={fields.vidmode==="1"} defaultValue={fields.Voltage} onChange={this.handleInputChange} id="inputVoltage" className="from-control form-control-sm">
              <option value="14">14</option>
              <option value="13">13</option>
              <option value="12">12 (default)</option>
              <option value="11">11</option>
              <option value="10">10</option>
          </select>);
      break;
      case 19:
      selectFrequency=(
        <select name="Frequency" disabled={fields.vidmode==="1"} defaultValue={fields.Frequency} onChange={this.handleInputChange} id="inputFrequency" className="from-control form-control-sm">
            <option value="800">800</option>
            <option value="850">850</option>
            <option value="900">900</option>
            <option value="950">950</option>
            <option value="1000">1000 (default)</option>
            <option value="1100">1100 (overclock)</option>
        </select>);
        selectVoltage=(
          <select name="Voltage" disabled={fields.vidmode==="1"} defaultValue={fields.Voltage} onChange={this.handleInputChange} id="inputVoltage" className="from-control form-control-sm">
              <option value="170">170</option>
              <option value="165">165</option>
              <option value="160">160</option>
              <option value="155">155</option>
              <option value="150">150</option>
          </select>);
      break;
    }



    return (
      <div className="Advancedpage">

      <h1>Settings<br/><small>Advanced</small></h1>
          <div className="row">
              {/* Box Pool 1 */}
             <div className="col-md-12 mt-5">
               <div className="box">
                 <div className="box-header">
                   <h3>Advanced Settings  {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                 </div>
                     {isLoaded &&
                       <div>
                         <div className="box-body p-4">
                           <div className="form-group row ">
                               <label htmlFor="inputVidMode" className="col-sm-3 col-form-label">Auto Tune</label>

                               <div className="col-sm-9">
                                   <input name="vidmode" onChange={this.handleInputChange} type="checkbox" checked={fields.vidmode==="1"} id="inputVidMode" /> &nbsp;&nbsp;
                                   <small>Please check this box if you want the miner find the base values automatically.</small>
                               </div>

                           </div>
                           <div className="form-group row">
                               <label htmlFor="inputPerformance" className="col-sm-3 col-form-label">Performence Level</label>
                               <div className="col-sm-9">
                                   {selectPerformance}

                               </div>
                           </div>


                           <div className="form-group row">
                               <label htmlFor="inputVoltage" className="col-sm-3 col-form-label">Voltage</label>
                               <div className="col-sm-9">
                                   {selectVoltage}
                               </div>
                           </div>


                           <div className="form-group row">
                               <label htmlFor="inputPassword1" className="col-sm-3 col-form-label">Frequency</label>
                               <div className="col-sm-9">
                                   {selectFrequency}
                               </div>
                           </div>

                         </div>
                         <div className="box-footer">
                             <button rel="btn" disabled={isUpdating} className="btn btn-primary" onClick={this.handleSubmit} >Update {isUpdating && <div className="btn-loader lds-dual-ring"></div>}</button>
                         </div>
                     </div>
                     }
               </div>
             </div>
             {/* ./ Box Pool 1 */}
          </div>





      </div>
    );
  }
}

export default Advancedpage;



// WEBPACK FOOTER //
// ./src/components/pages/advancedPage.js
