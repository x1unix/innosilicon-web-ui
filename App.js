import React, { Component } from 'react';
import './Assets/css/styles.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import Loginpage from './components/pages/loginPage';
import Wrapper from './components/wrapperComponent/wrapper';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      "authenticated": false
    };

  }


  componentWillMount() {
    window.customVars = {
        urlPrefix: "",
        apiDevsPools: "/api/summary",
        apiConfigPools: "/api/pools",
        apiMinerType: "/api/type",
        apiUpdatePools: "/api/updatePools",
        apiLogin: "/api/auth",
        apiUpdatePassword: "/api/updatePassword",
        apiNetwork: "/api/network",
        apiUpdateNetwork: "/api/updateNetwork",
        apiPing: "/api/ping",
        apiReboot: "/api/reboot",
        apiOverview: "/api/overview",
        apiUpgrade: "/upgrade/upload",
        apiUpgradeDownload: "/upgrade/download",
        apiUpgradeProgress: "/upgrade/ws",
        apiFactoryReset: "/api/factoryReset",
        apiStartSelfTest: "/api/startSelfTest",
        apiSelfTestStatus: "/api/selfTestStatus",
        apiSelfTestLogs: "/api/getSelfTestLog",
        apiGetAutoTune: "/api/getAutoTune",
        apiGetAutoTuneStatus: "/api/getAutoTuneStatus",
        apiSetAutoTune: "/api/setAutoTune",
        apiLatestFirmwareVersion: "/api/getLatestFirmwareVersion",
        apiHashRates: "/api/getHashRates",
        apiDebug: "/api/getDebugStats",
        apiStreamLogs: "/stream/logs",
        //freq and vol
        apiSetFreqVol:"/api/setFreqVol",
        apiConfigFreqVol: "/api/getFreqVol",
        //miner unit
        apiGetMinerUnit:"/api/unit",
        //miner logs
        apiMinerLogs:"/stream/minerlogs",
        //miner test
        apiMinerTest:"/stream/minertest",
        apiStartTest:"/api/starttest",
        apiIsTestRun:"/api/istestrun",
        apiStartCg:"/api/startcg",
        apiUpdateFanspeed:"/api/updateFanspeed",
        //miner diagnostics
        apiGetError:"/api/getErrorDetail",
        apiCheckGateWay:"/api/checkGateWay",
        apiCheckDNS:"/api/checkDNS",
        apiCheckUrl:"/api/checkUrl",
        apiGetErrorManual:"/api/getErrorManual",
        apiGetFacInfo:"/api/getFacInfo",
        apiRestartSwupdate:"/api/restartSwupdate",
        //pool test
        apiStartTestingPool:"/api/TestingPool",
        apiCheckPoolTest:"/api/checkPoolTest",
    };
  }


  componentDidMount() {

  }

  render() {


    return (
      <div className="App">
          <Router>
            <Wrapper/>
          </Router>
      </div>
    );

  }
}

export default App;



// WEBPACK FOOTER //
// ./src/App.js
