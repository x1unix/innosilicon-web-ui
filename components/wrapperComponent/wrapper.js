import React, { Component } from 'react';
import {
  Route,
  NavLink,
  Redirect,
  Switch
} from 'react-router-dom';

import {getStorage,setStorage,deleteStorage} from '../lib/utils'

import Homepage from '../../components/pages/homePage';
import Poolspage from '../../components/pages/poolsPage';
import Securitypage from '../../components/pages/securityPage';
import Networkpage from '../../components/pages/networkPage';
import Upgradepage from '../../components/pages/upgradePage';
import Rebootpage from '../../components/pages/rebootPage';
import OverViewpage from '../../components/pages/overViewPage';
import Advancedpage from '../../components/pages/advancedPage';
import Loginpage from '../../components/pages/loginPage';
import Resetpage from '../../components/pages/resetPage';
import Profilepage from '../../components/pages/profilePage';
import DebugPage from '../../components/pages/debugPage';
import LogsPage from '../../components/pages/logsPage';
import MinerLogsPage from '../../components/pages/minerlogsPage';
import MinerTestPage from '../../components/pages/minertestPage';
import Fanpage from '../../components/pages/fanPage';

import FreqVolPage from '../../components/pages/freqvolPage';
import DiagnosticsPage from '../../components/pages/diagnosticsPage';
import ErrorcodePage from '../../components/pages/errorcodePage';
class Wrapper extends Component {

  constructor(props) {
    super(props);
    var skin="light-skin";
    var skinStored=getStorage("skin");
    if (skinStored!=null) {
        skin=skinStored;
    }

    this.state = {
      skin: skin,
      user: "",
      sidebarClass:""
    };
    this.changeSkin = this.changeSkin.bind(this)
    this.logout = this.logout.bind(this);
  }

   changeSkin(e) {
    var { skin } = this.state;
    if (skin==="light-skin") {
      skin="dark-skin";
    } else if (skin==="dark-skin") {
      skin="light-skin";
    }
    setStorage("skin",skin);
    this.setState({
      skin: skin
    });


  }

  logout(event) {
    event.preventDefault();
    deleteStorage("jwt");
    this.setState({"authenticated":false});
  }

  componentDidMount() {
    var user=getStorage("userName");
    if (user!=null) {
      this.setState({"user":user});
    }
  }


  toggleSidenav() {
      const { sidebarClass } = this.state;
      if (sidebarClass==="") {
        this.setState({"sidebarClass":"active"});
      } else {
        this.setState({"sidebarClass":""});
      }
  }

  render() {
    const { skin,sidebarClass } = this.state;
    var authenticated=false;
    var token=getStorage("jwt");
    var user=getStorage("userName");
    var isAdmin=false;
    if (token!==null&&user!==null) {
      authenticated=true;
      if (user=="admin")
        isAdmin=true;
    }




    return (
        <Switch>
          <Route path='/login' component={Loginpage} />
          {!authenticated &&
            <Redirect to="/login" />
          }
          {authenticated &&
          <Route render={() =>
            <div className={"wrapper " + skin}>
                {/* Sidebar Holder */}
                <nav id="sidebar" className={sidebarClass}>
                    <div className="sidebar-header hm-logo">

                    </div>


                    <ul className="list-unstyled components">
                        <li><NavLink to="/" exact={true} activeClassName="active"><i className="fa fa-tachometer-alt"></i>&nbsp;&nbsp; Miner Status</NavLink></li>
                        <li><a href="#settingSubmenu" data-toggle="collapse" aria-expanded="false"><i className="fa fa-cogs"></i>&nbsp;&nbsp; Settings</a>
                            <Route path="/:path(pools|security|network|profile)" children={({ match }) => (
                              <ul className={match===null ? 'collapse list-unstyled':'list-unstyled'} id="settingSubmenu">
                                <li><NavLink to="/pools" activeClassName="active">Pools</NavLink></li>
                                {isAdmin &&<li><NavLink to="/security" activeClassName="active">Security</NavLink></li>}
                                <li><NavLink to="/network" activeClassName="active">Network</NavLink></li>
                                {isAdmin &&<li><NavLink to="/profile" activeClassName="active">Performance</NavLink></li>}
                            </ul>)} />

                        </li>
                        {isAdmin &&<li><a href="#maintenanceSubmenu" data-toggle="collapse" aria-expanded="false"><i className="fa fa-plug"></i>&nbsp;&nbsp; Maintenance</a>
                            <Route path="/:path(upgrade|reboot|reset)" children={({ match }) => (
                              <ul className={match===null ? 'collapse list-unstyled':'list-unstyled'} id="maintenanceSubmenu">
                                <li><NavLink to="/upgrade" activeClassName="active">Firmware</NavLink></li>
                                <li><NavLink to="/reboot" activeClassName="active">Reboot</NavLink></li>
                                {isAdmin &&<li><NavLink to="/reset" activeClassName="active">Factory Reset</NavLink></li>}
                            </ul>)} />
                        </li>}
                        <li><NavLink to="/overview" activeClassName="active"><i className="fa fa-microchip"></i>&nbsp;&nbsp; Overview</NavLink></li>
                        <li><a href="#" onClick={this.logout}><i className="fa fa-sign-out-alt"></i>&nbsp;&nbsp; Logout</a></li>
                    </ul>
                </nav>

                {/* Page Content Holder */}
                <div id="content">

                  <div className="row">
                    <div className="col-md-12 text-right mt-0 d-lg-block">
                        <i className="fa fa-user"></i> <small>{user}</small>
                        <button onClick={this.changeSkin} className="btn btn-sm ml-4"><i className="fa fa-paint-brush"></i></button>
                    </div>
                  </div>

                    <nav className="navbar navbar-default m-0 d-md-none">
                        <div className="container-fluid">

                            <div className="navbar-header">
                              <div className="hm-logo">

                              </div>
                                <button type="button" id="sidebarCollapse" className="btn navbar-btn btn-sm" onClick={this.toggleSidenav.bind(this)}>
                                    <i className="fa fa-bars"></i>
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* Page Content */}
                    <div id="page-content">
                        <Route exact path='/' component={Homepage}/>
                        <Route exact path='/pools' component={Poolspage} />
                        <Route exact path='/security' component={Securitypage} />
                        <Route exact path='/network' component={Networkpage} />
                        <Route exact path='/upgrade' component={Upgradepage} />
                        <Route exact path='/reboot' component={Rebootpage} />
                        <Route exact path='/overview' component={OverViewpage} />
                        <Route exact path='/reset' component={Resetpage} />
                        <Route exact path='/profile' component={Profilepage} />
                        <Route exact path='/stat' component={DebugPage} />
                        <Route exact path='/logs' component={LogsPage} />
                        <Route exact path='/mlogs' component={MinerLogsPage} />
                        <Route exact path='/mtest' component={MinerTestPage} />
                        <Route exact path='/fan' component={Fanpage} />
                        {/* <Route exact path='/diag' component={DiagnosticsPage} /> */}
                        <Route exact path='/error' component={ErrorcodePage} />
                        {/* <Route exact path='/tuning' component={FreqVolPage} /> */}
                    </div>
                    {/* ./ Page content */}
                </div>

                {/* ./ Wrapper */}

          </div>} />
          }
          </Switch>
    );
  }
}

export default Wrapper;



// WEBPACK FOOTER //
// ./src/components/wrapperComponent/wrapper.js
