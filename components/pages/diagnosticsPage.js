import React, { Component } from 'react';
import axios from 'axios';
import {getStorage, isUrlValid_diag, isUrlValid, generateUrlEncoded} from '../lib/utils'
import { Redirect } from 'react-router-dom';

class DiagnosticsPage extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            fac_info:[
                "vendor":"",
                "power_vendor": "",
                "power_version": "",
                "sync_power": "",
            ],
            facInfoLoaded:false,
            NetCheckLoaded:false,
            net_check_detail:"",
            alertMessage:""
        };
        this.check_gw = this.check_gw.bind(this);
        this.check_dns = this.check_dns.bind(this);
        this.check_url = this.check_url.bind(this);
    }


    componentDidMount()
    {
        var comp=this;
        //Get System
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
            axios.post(window.customVars.urlPrefix+window.customVars.apiGetFacInfo,postData,axiosConfig)
                .then(function (response)
                {
                    if (response.data.success==true)
                    {
                        comp.setState({"fac_info":response.data.fac_info,"facInfoLoaded":true})
                    }
                })
                .catch(function (error)
                {

                });
        }
    }

    check_gw(event)
    {
        event.preventDefault();
        var comp=this;
        var token=getStorage("jwt");
        comp.setState({"alertMessage":""});
        if (token===null)
        {
            this.setState({"redirectToLogin":true});
        }
        else
        {
            comp.setState({"NetCheckLoaded":true});
            var show_msg = "Starting to check gateway...<br>";
            this.setState({"net_check_detail":show_msg});
            var postData = {

            };
            let axiosConfig = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };
            show_msg += "Waiting";
            var waiting_timeout = setInterval(function(){
                show_msg += ".";
                comp.setState({"net_check_detail":show_msg});
            },1000);
            axios.post(window.customVars.urlPrefix+window.customVars.apiCheckGateWay,postData,axiosConfig)
                .then(function (response)
                {
                    clearInterval(waiting_timeout);
                    if (response.data.success==true)
                    {
                        var check_detail = response.data.msg;
                        show_msg += '<br>'+check_detail.replace(/\n/g,"<br>");
                        show_msg += "<br>End...";
                        comp.setState({"net_check_detail":show_msg,"NetCheckLoaded":false});
                    }
                    else
                    {
                        comp.setState({"NetCheckLoaded":false});
                    }
                })
                .catch(function (error)
                {

                });
        }
    }

    check_dns(event)
    {
        event.preventDefault();
        var comp=this;
        var token=getStorage("jwt");
        comp.setState({"alertMessage":""});
        if (token===null)
        {
            this.setState({"redirectToLogin":true});
        }
        else
        {
            comp.setState({"NetCheckLoaded":true});
            var show_msg = "Starting to check DNS...<br>";
            this.setState({"net_check_detail":show_msg});
            var postData = {

            };
            let axiosConfig = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };
            show_msg += "Waiting";
            var waiting_timeout = setInterval(function(){
                show_msg += ".";
                comp.setState({"net_check_detail":show_msg});
            },1000);


            axios.post(window.customVars.urlPrefix+window.customVars.apiCheckDNS,postData,axiosConfig)
                .then(function (response)
                {
                    clearInterval(waiting_timeout);
                    if (response.data.success==true)
                    {
                        var check_detail = response.data.msg;
                        show_msg += '<br>'+check_detail.replace(/\n/g,"<br>");
                        show_msg += "<br>End...";
                        comp.setState({"net_check_detail":show_msg,"NetCheckLoaded":false});
                    }
                    else
                    {
                        comp.setState({"NetCheckLoaded":false});
                    }
                })
                .catch(function (error)
                {

                });
        }
    }

    check_url(event)
    {
        event.preventDefault();
        var comp=this;
        var token=getStorage("jwt");
        if (token===null)
        {
            this.setState({"redirectToLogin":true});
        }
        else
        {
            let continue_exec = true;
            let alertMessage = "";
            var {NetCheckLoaded } = this.state;
            if(!NetCheckLoaded)
            {
                var check_url=this.refs.check_url.value;
                if(check_url.length === 0)
                {
                    alertMessage = "The url can't be empty";
                    continue_exec = false;
                }
                else if(!isUrlValid_diag(check_url))
                {
                    alertMessage = "Wrong Url";
                    continue_exec = false;
                }
            }
            comp.setState({"alertMessage":alertMessage});
            if(continue_exec)
            {
                comp.setState({"NetCheckLoaded":true});
                var show_msg = "Starting to check Url:  "+check_url+"<br>";
                this.setState({"net_check_detail":show_msg});
                show_msg += "Waiting";
                var waiting_timeout = setInterval(function(){
                    show_msg += ".";
                    comp.setState({"net_check_detail":show_msg});
                },1000);
                var strSend = generateUrlEncoded({"check_url":check_url});
                let axiosConfig = {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                };
                axios.post(window.customVars.urlPrefix+window.customVars.apiCheckUrl,strSend,axiosConfig)
                    .then(function (response)
                    {
                        clearInterval(waiting_timeout);
                        if (response.data.success==true)
                        {
                            var check_detail = response.data.msg;
                            if(check_detail.length > 0)
                            {
                                show_msg += '<br>'+check_detail.replace(/\n/g,"<br>");
                            }
                            else
                            {
                                show_msg += "command error";
                            }
                            show_msg += "<br>End...";
                            comp.setState({"net_check_detail":show_msg,"NetCheckLoaded":false});
                        }
                        else
                        {
                            comp.setState({"NetCheckLoaded":false});
                        }
                    })
                    .catch(function (error)
                    {

                    });
            }

        }
    }
    render()
    {
        const { NetCheckLoaded,redirectToLogin,net_check_detail,alertMessage,facInfoLoaded,fac_info } = this.state;
        if (redirectToLogin)
        {
            return <Redirect to="/login?expired" />;
        }

    return (
    <div className="Diagnosticspage">
        <h1>Diagnostics<br/><small>Self Check</small></h1>
        <div className="row">
            <div className="col-md-6 mt-5">
                <div className="box">
                    <div className="box-header">
                        <h3>Factory Information {!facInfoLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                    </div>
                    <div className="box-body p-4">
                        <div className="row">
                            <div className="col-md-6">
                                <span className="field-title">Vendor</span>
                            </div>
                            <div className="col-md-6 field-value">
                                {fac_info.vendor}
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6">
                                <span className="field-title">Power Vendor</span>
                            </div>
                            <div className="col-md-6 field-value">
                                {fac_info.power_vendor}
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6">
                                <span className="field-title">Power Version</span>
                            </div>
                            <div className="col-md-6 field-value">
                                {fac_info.power_version}
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6">
                                <span className="field-title">Sync Power</span>
                            </div>
                            <div className="col-md-6 field-value">
                                {fac_info.sync_power}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Box */}
            <div className="col-md-6 mt-5">
                <div className="box">
                    <div className="box-header">
                        <h3>Network Check{NetCheckLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                    </div>
                    <div className="box-body body-style-net">
                        <div className="row net_check_detail" dangerouslySetInnerHTML={{__html: net_check_detail}}>
                        </div>
                    </div>
                    <div className="box-footer clearfix">
                        <div className="row">
                            <button disabled={NetCheckLoaded} className="btn btn-primary check-button" onClick={this.check_gw}>Check Gateway</button>
                            <button disabled={NetCheckLoaded} className="btn btn-primary check-button" onClick={this.check_dns}>Check DNS</button>
                        </div>
                        <div className="row mt-3">
                            <div className="col col-md-8">
                                <input type="text" className="form-control form-control-sm" name="url" placeholder="eg. www.baidu.com" ref="check_url"/>
                            </div>
                            <div className="col col-md-4">
                                <button disabled={NetCheckLoaded} className="btn btn-primary check-button" onClick={this.check_url}>Check Url</button>
                            </div>
                            {alertMessage !== "" &&
                            <div className="alert alert-warning col-md-10">
                                <strong>Error</strong> {alertMessage}
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* ./ Box  */}
        </div>
    </div>
    );
    }
    }

export default DiagnosticsPage;



// WEBPACK FOOTER //
// ./src/components/pages/diagnosticsPage.js
