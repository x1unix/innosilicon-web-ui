import React, { Component } from 'react';
import axios from 'axios';
import {generateUrlEncoded, getStorage, deleteStorage,isValidSpeed} from '../lib/utils'
import { Redirect } from 'react-router-dom';

class Fanpage extends Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            fields: {
                "fanspeed":"",
                "automatic":"manual"
            },
            fieldsValidation: {
                "fanspeed":true,
            },
            "isLoaded": true,
            "updatingFanSpeed":false,
            "alert": {"type":"","message":""},
            "redirectToLogin":false,
            "updatedFan":false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount()
    {
    }

    validateForm()
    {
        var { fields,fieldsValidation,isLoaded,updatingFanSpeed,alert } = this.state;
        fieldsValidation.fanspeed = true;
        this.setState({"updatedFan":false,fieldsValidation:fieldsValidation});
        if (fields.automatic !== "automatic")
        {
            fieldsValidation.fanspeed=isValidSpeed(fields.fanspeed);
        }

        if (fields.automatic==="automatic"||(fieldsValidation.fanspeed))
        {
            var token=getStorage("jwt");
            if (token===null)
            {
                this.setState({"redirectToLogin":true});
            }
            else
            {
                updatingFanSpeed=true;
                var data=[];
                var strSend="";

                data=fields;
                var formBody = [];
                Object.keys(fields).forEach(function(index)
                {
                    var encodedKey = encodeURIComponent(index);
                    var encodedValue = encodeURIComponent(fields[index]);
                    formBody.push(encodedKey + "=" + encodedValue);
                });
                strSend=formBody.join("&");
                var comp=this;
                let axiosConfig =
                {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                };
                axios.post(window.customVars.urlPrefix+window.customVars.apiUpdateFanspeed, strSend,axiosConfig)
                    .then(res => {
                        if (res.data.success==true)
                        {
                            comp.setState({"updatedFan":true,"updatingFanSpeed":false});
                        }
                        else
                        {
                            comp.setState({"updatingFanSpeed":false});
                        }
                    })
                    .catch(function (error)
                    {

                    });
            }

        }
        this.setState({fieldsValidation:fieldsValidation,updatingFanSpeed:updatingFanSpeed,alert:alert});
    }

    handleSubmit(event)
    {
        event.preventDefault();
        this.validateForm();
    }

    handleInputChange(event)
    {
        var { fields,fieldsValidation,isLoaded,updatingFanSpeed,alert } = this.state;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if (name==="automatic")
        {
            fields[name]=(target.checked?"automatic":"manual");
        }
        else
        {
            fields[name]=value;
        }

        this.setState({"fields":fields,"fieldsValidation":fieldsValidation,"isLoaded":isLoaded,"updatingFanSpeed":updatingFanSpeed,alert:alert});
    }

    render()
    {
        const { fields,fieldsValidation,isLoaded,updatingFanSpeed,alert,redirectToLogin,updatedFan } = this.state;
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
        <div className="Fanpage">
            <h1>Settings<br/><small>Fan</small></h1>
            <div className="row">
            {/* Box */}
                <div className="col-md-12 mt-5">
                    <div className="box">
                        <div className="box-header">
                            <h3>Fan Settings {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                        </div>
                        <div className="box-body p-4">
                            {alert.type!=="" &&
                            <div className="alert alert-info">
                                {alert.message}
                            </div>
                            }

                            {updatedFan &&
                            <div className="alert alert-success">
                                The Fan Speed was updated successfully.
                            </div>
                            }
                            <div className="form-group row mt-4 ">
                                <label htmlFor="inputAutomatic" className="col-sm-2 col-form-label">Automatic</label>
                                <div className="col-sm-10">
                                    <input name="automatic" disabled={!isLoaded||!isAdmin} onChange={this.handleInputChange} type="checkbox" checked={fields.automatic==="automatic"} id="inputAutomatic" />
                                </div>
                            </div>
                            <div className={"form-group row mt-4 " + (!fieldsValidation.fanspeed && "has-error")}>
                                <label htmlFor="inputFanspeed" className="col-sm-2 col-form-label">Speed</label>
                                <div className="col-sm-4">
                                    <div className="input-group">
                                        <input type="text" name="fanspeed" disabled={this.state.fields.automatic==="automatic"||!isLoaded} value={this.state.fields.fanspeed} onChange={this.handleInputChange} className="form-control form-control-sm" id="inputFanspeed" placeholder="Fan Speed" />
                                        <div className="input-group-append">
                                            <span className="input-group-text">%</span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {(!fieldsValidation.fanspeed) &&
                            <div className="alert alert-warning">
                                Please correct the fields that are in red
                            </div>
                            }
                        </div>
                        {isAdmin &&
                        <div className="box-footer">
                            <button disabled={!isLoaded||updatingFanSpeed} className="btn btn-primary" onClick={this.handleSubmit}>Update{updatingFanSpeed && <div className="btn-loader lds-dual-ring"></div>}</button>
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

export default Fanpage;



// WEBPACK FOOTER //
// ./src/components/pages/fanPage.js
