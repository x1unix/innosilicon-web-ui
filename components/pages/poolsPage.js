import React, {Component} from 'react';
import axios from 'axios';
import {
    Redirect
} from 'react-router-dom';

import {getStorage, deleteStorage, isUrlValid, generateUrlEncoded} from '../lib/utils'

class Poolspage extends Component
{
    constructor(props)
    {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state =
        {
            pools: [{
                "url": "",
                "user": "",
                "pass": ""
            }, {
                "url": "",
                "user": "",
                "pass": ""
            }, {
                "url": "",
                "user": "",
                "pass": ""
            }],
            fieldsValidation:
            {
                "Password1": true,
                "Password2": true,
                "Password3": true,
                "Pool1": true,
                "Pool2": true,
                "Pool3": true,
                "UserName1": true,
                "UserName2": true,
                "UserName3": true
            },
            updatingPools: false,
            // isLoaded: false,
            isLoaded: true,
            showAlert: false,
            redirectToIndex: false,
            type: "",
            poolsUpdated: false,
            errorUpdating: false,
            errorLock: false,
            redirectToLogin: false,
            hasErrors: false,
            showResult1:false,
            TestResult1:"",
            showResult2:false,
            TestResult2:"",
            showResult3:false,
            TestResult3:"",
            testingPools:false,
            colorResult:false,
            supportPoolTest:false
        };
    }

    componentDidMount()
    {
        var {pools, fieldsValidation, isLoaded, showAlert, updatingPools, redirectToIndex, supportPoolTest} = this.state;
        var token = getStorage("jwt");
        if (token === null)
        {
            this.setState({"redirectToLogin": true});
        }
        else
        {
            var comp = this;
            var postData = {};
            let axiosConfig =
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };
            axios.post(window.customVars.urlPrefix + window.customVars.apiCheckPoolTest, postData, axiosConfig)
            .then(res => {
                if (res.data.success === true)
                {
                    comp.setState({"supportPoolTest":true});
                }
                else
                {
                    if ((typeof res.data.token !== 'undefined') && res.data.token !== null && res.data.token === "expired")
                    {
                        deleteStorage("jwt");
                        comp.setState({"redirectToLogin": true});
                    }
                    else
                    {
                        comp.setState({"supportPoolTest":false});
                    }
                }
            });


            axios.post(window.customVars.urlPrefix + window.customVars.apiConfigPools, postData, axiosConfig)
            .then(res => {
                if (res.data.success === true)
                {
                    if (res.data.pools instanceof Array)
                    {
                        var receivedPools = [];
                        for (var i = 0; i < 3; i++)
                        {
                            if (res.data.pools[i] !== void 0)
                            {
                                var url = "";
                                var user = "";
                                var pass = "";
                                if (typeof res.data.pools[i].url !== 'undefined')
                                {
                                    url = res.data.pools[i].url;
                                }
                                if (typeof res.data.pools[i].user !== 'undefined')
                                {
                                    user = res.data.pools[i].user;
                                }
                                if (typeof res.data.pools[i].pass !== 'undefined')
                                {
                                    pass = res.data.pools[i].pass;
                                }
                                receivedPools[i] = {"url": url, "user": user, "pass": pass};
                            }
                            else
                            {
                                receivedPools[i] = {"url": "", "user": "", "pass": ""};
                            }
                        }
                        comp.setState({
                            pools: receivedPools,
                            isLoaded: true
                        });
                    }
                }
                else
                {
                    if ((typeof res.data.token !== 'undefined') && res.data.token !== null && res.data.token === "expired")
                    {
                        deleteStorage("jwt");
                        comp.setState({"redirectToLogin": true});
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
        var {pools} = this.state;

        const target = event.target;
        const name = target.name;
        const pool = target.getAttribute('data-pool');
        pools[pool][name] = target.value;

        this.setState({pools: pools});
    }

    handleSubmit(event)
    {
        event.preventDefault();
        var {pools, fieldsValidation, isLoaded, showAlert, updatingPools, redirectToIndex} = this.state;

        fieldsValidation =
        {
            "Password1": true,
            "Password2": true,
            "Password3": true,
            "Pool1": true,
            "Pool2": true,
            "Pool3": true,
            "UserName1": true,
            "UserName2": true,
            "UserName3": true
        };
        var hasErrors = false;
        //Pool 1 is always required
        if (pools[0].url == "" || !isUrlValid(pools[0].url))
        {
            fieldsValidation["Pool1"] = false;
            hasErrors = true;
        }
        if (pools[0].user == "")
        {
            fieldsValidation["UserName1"] = false;
            hasErrors = true;
        }
        if (pools[0].pass == "")
        {
            fieldsValidation["Password1"] = false;
            hasErrors = true;
        }

        //Pool 2
        if (pools[1].url != "")
        {
            if (!isUrlValid(pools[1].url))
            {
                fieldsValidation["Pool2"] = false;
                hasErrors = true;
            }
            if (pools[1].user == "")
            {
                fieldsValidation["UserName2"] = false;
                hasErrors = true;
            }
            if (pools[1].pass == "")
            {
                fieldsValidation["Password2"] = false;
                hasErrors = true;
            }
        }
        else
        {
            if (pools[1].user != "")
            {
                fieldsValidation["Pool2"] = false;
                hasErrors = true;
            }
            if (pools[1].pass != "")
            {
                fieldsValidation["Pool2"] = false;
                hasErrors = true;
            }
        }
        //Pool 3
        if (pools[2].url != "")
        {
            if (!isUrlValid(pools[2].url))
            {
                fieldsValidation["Pool3"] = false;
                hasErrors = true;
            }
            if (pools[2].user == "")
            {
                fieldsValidation["UserName3"] = false;
                hasErrors = true;
            }
            if (pools[2].pass == "")
            {
                fieldsValidation["Password3"] = false;
                hasErrors = true;
            }
        }
        else
        {
            if (pools[2].user != "")
            {
                fieldsValidation["Pool3"] = false;
                hasErrors = true;
            }
            if (pools[2].pass != "")
            {
                fieldsValidation["Pool3"] = false;
                hasErrors = true;
            }
        }

        if (!hasErrors)
        {
            this.setState({hasErrors: false, fieldsValidation: fieldsValidation});
            var token = getStorage("jwt");
            if (token === null)
            {
                this.setState({"redirectToLogin": true});
            }
            else
            {
                if (updatingPools)
                    return;

                var postPools = [];
                for (var i = 0; i < 3; i++)
                {
                    if (pools[i].url != null && pools[i].url != "")
                    {
                        postPools["Pool" + (i + 1)] = pools[i].url;
                    }
                    else
                    {
                        postPools["Pool" + (i + 1)] = "";
                    }
                    if (pools[i].user != null && pools[i].user != "")
                    {
                        postPools["UserName" + (i + 1)] = pools[i].user;
                    }
                    else
                    {
                        postPools["UserName" + (i + 1)] = "";
                    }
                    if (pools[i].pass != null && pools[i].pass != "")
                    {
                        postPools["Password" + (i + 1)] = pools[i].pass;
                    }
                    else
                    {
                        postPools["Password" + (i + 1)] = "";
                    }
                }
                var strSend = generateUrlEncoded(postPools);

                var comp = this;
                comp.setState({updatingPools: true});
                let axiosConfig =
                {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                };
                axios.post(window.customVars.urlPrefix + window.customVars.apiUpdatePools, strSend, axiosConfig)
                    .then(function (response)
                    {
                        if (response.data.success === true)
                        {
                            if (response.data.message == 'lock')
                            {
                                comp.setState({errorLock: true, poolsUpdated: true});
                            }
                            else
                            {
                                comp.setState({poolsUpdated: true});
                            }
                            setTimeout(() => {
                                comp.setState({redirectToIndex: true});
                            }, 5000);
                        }
                        else if (response.data.success === false)
                        {
                            comp.setState({errorUpdating: true, updatingPools: false});
                        }
                    })
                    .catch(function (error)
                    {
                        comp.setState({updatingPools: false});
                    });
            }
        }
        else
        {
            this.setState({hasErrors: true, fieldsValidation: fieldsValidation});
        }
    }

    testPool(pool_type,event)
    {
        event.preventDefault();
        var {pools, fieldsValidation, redirectToIndex, updatingPools, testingPools,TestResult1, showResult1, TestResult2, showResult2, TestResult3, showResult3,colorResult} = this.state;
        var comp = this;
        comp.setState({"showResult1":false,"showResult2":false,"showResult3":false});
        fieldsValidation =
        {
            "Password1": true,
            "Password2": true,
            "Password3": true,
            "Pool1": true,
            "Pool2": true,
            "Pool3": true,
            "UserName1": true,
            "UserName2": true,
            "UserName3": true
        };
        let i = 0;
        if(pool_type === "pool2")
        {
            i = 1;
        }
        else if(pool_type === "pool3")
        {
            i = 2;
        }
        var hasErrors = false;
        //Pool check
        if (pools[i].url == "" || !isUrlValid(pools[i].url))
        {
            fieldsValidation["Pool" + (i + 1)] = false;
            hasErrors = true;
        }
        if (pools[i].user == "")
        {
            fieldsValidation["UserName" + (i + 1)] = false;
            hasErrors = true;
        }
        if (pools[i].pass == "")
        {
            fieldsValidation["Password" + (i + 1)] = false;
            hasErrors = true;
        }

        if (!hasErrors)
        {
            this.setState({hasErrors: false, fieldsValidation: fieldsValidation});
            var token = getStorage("jwt");
            if (token === null)
            {
                this.setState({"redirectToLogin": true});
            }
            else
            {
                if (updatingPools)
                {
                    return;
                }

                var postPools = [];

                if (pools[i].url != null && pools[i].url != "")
                {
                    postPools["Pool"] = pools[i].url;
                }
                else
                {
                    postPools["Pool"] = "";
                }

                if (pools[i].user != null && pools[i].user != "")
                {
                    postPools["UserName"] = pools[i].user;
                }
                else
                {
                    postPools["UserName"] = "";
                }

                if (pools[i].pass != null && pools[i].pass != "")
                {
                    postPools["Password"] = pools[i].pass;
                }
                else
                {
                    postPools["Password"] = "";
                }

                var strSend = generateUrlEncoded(postPools);
                comp.setState({testingPools: true});
                let axiosConfig =
                {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                };
                axios.post(window.customVars.urlPrefix + window.customVars.apiStartTestingPool, strSend, axiosConfig)
                .then(function (response)
                {
                    let set_result = {};
                    let show_text = "";
                    let result_text = "";
                    if(pool_type === "pool1")
                    {
                        show_text = "showResult1";
                        result_text = "TestResult1";
                    }
                    else if(pool_type === "pool2")
                    {
                        show_text = "showResult2";
                        result_text = "TestResult2";
                    }
                    else if(pool_type === "pool3")
                    {
                        show_text = "showResult3";
                        result_text = "TestResult3";
                    }

                    if (response.data.success === true)
                    {
                        set_result[show_text] = true;
                        set_result[result_text] = "Successful!";
                        set_result["colorResult"] = true;
                        set_result["testingPools"] = false;
                    }
                    else if (response.data.success === false)
                    {
                        set_result[show_text] = true;
                        set_result[result_text] = response.data.msg;
                        set_result["colorResult"] = false;
                        set_result["testingPools"] = false;
                    }
                    comp.setState(set_result);
                })
                .catch(function (error)
                {
                    comp.setState({testingPools: false});
                });
            }
        }
        else
        {
            this.setState({hasErrors: true, fieldsValidation: fieldsValidation});
        }
    }

    render()
    {
        const {pools, fieldsValidation, isLoaded, showAlert, updatingPools, redirectToIndex, type, poolsUpdated, errorUpdating, errorLock, redirectToLogin, hasErrors, testingPools, TestResult1, showResult1, TestResult2, showResult2, TestResult3, showResult3, colorResult, supportPoolTest} = this.state;
        if (redirectToIndex)
        {
            return <Redirect to="/?restarting"/>;
        }
        if (redirectToLogin)
        {
            return <Redirect to="/login?expired"/>;
        }
        var token = getStorage("jwt");
        var user = getStorage("userName");
        var isAdmin = false;
        if (token !== null && user !== null)
        {
            if (user == "admin")
                isAdmin = true;
        }


        return (
            <div className="Poolspage">
                <h1>Settings<br/>
                    <small>Mining Pools</small>
                </h1>

                {poolsUpdated &&
                <div className="alert alert-success mt-5">
                    Pools updated successfully! Restarting service, please wait <div lassName="btn-loader lds-dual-ring pt-1"></div>
                </div>
                }

                {errorUpdating &&
                <div className="alert alert-warning mt-5">
                    It was not possible to restart the service, please restart the miner manually
                </div>
                }

                {errorLock &&
                <div className="alert alert-warning mt-5">
                    Notice: currently using fixed pool setting.
                </div>
                }

                {hasErrors &&
                <div className="alert alert-warning mt-5">
                    Some fields in your form are invalid, please check the fields highlighted in red.
                </div>
                }
                <div className="row">
                    {/* Box Pool 1 */}
                    <div className="col-md-12 mt-5">
                        <div className="box">
                            <div className="box-header">
                                <h3>Pool 1 {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                            </div>
                            {isLoaded &&
                            <div className="box-body p-4">
                                <div className={"form-group " + (!fieldsValidation.Pool1 && "has-error")}>
                                    <label htmlFor="inputURL1">URL</label>
                                    <div className="input-group mb-2">
                                        <input type="text" className="form-control form-control-sm" data-pool="0"
                                               name="url" value={this.state.pools[0].url}
                                               onChange={this.handleInputChange} id="inputURL1" placeholder="Pool URL"/>
                                    </div>
                                </div>
                                <div className={"form-group " + (!fieldsValidation.UserName1 && "has-error")}>
                                    <label htmlFor="inputWorker1">Worker</label>
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text"><i className="fa fa-user"></i></div>
                                        </div>
                                        <input type="text" className="form-control form-control-sm" data-pool="0"
                                               name="user" value={this.state.pools[0].user}
                                               onChange={this.handleInputChange} id="inputWorker1"
                                               placeholder="Pool Worker"/>
                                    </div>
                                </div>
                                <div className={"form-group " + (!fieldsValidation.Password1 && "has-error")}>
                                    <label htmlFor="inputPassword1">Password</label>
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text"><i className="fa fa-lock"></i></div>
                                        </div>
                                        <input type="text" className="form-control form-control-sm" data-pool="0"
                                               name="pass" value={this.state.pools[0].pass}
                                               onChange={this.handleInputChange} id="inputPassword1"
                                               placeholder="Pool Password"/>
                                    </div>
                                </div>
                                <div className="col-md-12 text-center">
                                    <br/>
                                    {supportPoolTest &&
                                        <button ref="btn" disabled={!isLoaded || testingPools}
                                                onClick={this.testPool.bind(this, "pool1")}
                                                className="btn btn-primary">Test Pool1 {testingPools &&
                                        <div className="btn-loader lds-dual-ring"></div>}</button>
                                    }

                                    {showResult1 &&
                                    <div id="testpoolsAlert1" className={"alert mt-3 "+ (colorResult ? "alert-success" : "alert-warning")}>
                                        {TestResult1}
                                    </div>
                                    }
                                </div>
                            </div>
                            }
                            {/* ./box-body */}
                        </div>
                    </div>
                    {/* ./ Box Pool 1 */}
                </div>

                <div className="row">
                    {/* Box Pool 2 */}
                    <div className="col-md-6 mt-5">
                        <div className="box">
                            <div className="box-header">
                                <h3>Pool 2 {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                            </div>
                            {isLoaded &&
                            <div className="box-body p-4">
                                <div className={"form-group " + (!fieldsValidation.Pool2 && "has-error")}>
                                    <label htmlFor="inputURL2">URL</label>
                                    <div className="input-group mb-2">
                                        <input type="text" className="form-control form-control-sm" data-pool="1"
                                               name="url" value={this.state.pools[1].url}
                                               onChange={this.handleInputChange} id="inputURL2" placeholder="Pool URL"/>
                                    </div>
                                </div>
                                <div className={"form-group " + (!fieldsValidation.UserName2 && "has-error")}>
                                    <label htmlFor="inputWorker2">Worker</label>
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text"><i className="fa fa-user"></i></div>
                                        </div>
                                        <input type="text" className="form-control form-control-sm" data-pool="1"
                                               name="user" value={this.state.pools[1].user}
                                               onChange={this.handleInputChange} id="inputWorker2"
                                               placeholder="Pool Worker"/>
                                    </div>
                                </div>
                                <div className={"form-group " + (!fieldsValidation.Password2 && "has-error")}>
                                    <label htmlFor="inputPassword2">Password</label>
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text"><i className="fa fa-lock"></i></div>
                                        </div>
                                        <input type="text" className="form-control form-control-sm" data-pool="1"
                                               name="pass" value={this.state.pools[1].pass}
                                               onChange={this.handleInputChange} id="inputPassword2"
                                               placeholder="Pool Password"/>
                                    </div>
                                </div>
                                <div className="col-md-12 text-center">
                                    <br/>
                                    {supportPoolTest &&
                                        <button ref="btn" disabled={!isLoaded || testingPools} onClick={this.testPool.bind(this,"pool2")}
                                                className="btn btn-primary">Test Pool2 {testingPools &&
                                        <div className="btn-loader lds-dual-ring"></div>}</button>
                                    }

                                    {showResult2 &&
                                    <div id="testpoolsAlert2" className={"alert mt-3 "+ (colorResult ? "alert-success" : "alert-warning")}>
                                        {TestResult2}
                                    </div>
                                    }
                                </div>
                            </div>
                            }
                            {/* ./box-body */}
                        </div>
                    </div>
                    {/* ./ Box Pool 2 */}


                    {/* Box Pool 3 */}
                    <div className="col-md-6 mt-5">
                        <div className="box">
                            <div className="box-header">
                                <h3>Pool 3 {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                            </div>
                            {isLoaded &&
                            <div className="box-body p-4">
                                <div className={"form-group " + (!fieldsValidation.Pool3 && "has-error")}>
                                    <label htmlFor="inputURL3">URL</label>
                                    <div className="input-group mb-2">
                                        <input type="text" className="form-control form-control-sm" data-pool="2"
                                               name="url" value={this.state.pools[2].url}
                                               onChange={this.handleInputChange} id="inputURL3" placeholder="Pool URL"/>
                                    </div>
                                </div>
                                <div className={"form-group " + (!fieldsValidation.UserName3 && "has-error")}>
                                    <label htmlFor="inputWorker3">Worker</label>
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text"><i className="fa fa-user"></i></div>
                                        </div>
                                        <input type="text" className="form-control form-control-sm" data-pool="2"
                                               name="user" value={this.state.pools[2].user}
                                               onChange={this.handleInputChange} id="inputWorker3"
                                               placeholder="Pool Worker"/>
                                    </div>
                                </div>
                                <div className={"form-group " + (!fieldsValidation.Password3 && "has-error")}>
                                    <label htmlFor="inputPassword3">Password</label>
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text"><i className="fa fa-lock"></i></div>
                                        </div>
                                        <input type="text" className="form-control form-control-sm" data-pool="2"
                                               name="pass" value={this.state.pools[2].pass}
                                               onChange={this.handleInputChange} id="inputPassword3"
                                               placeholder="Pool Password"/>
                                    </div>
                                </div>
                                <div className="col-md-12 text-center">
                                    <br/>
                                    {supportPoolTest &&
                                        <button ref="btn" disabled={!isLoaded || testingPools} onClick={this.testPool.bind(this,"pool3")}
                                                className="btn btn-primary">Test Pool3 {testingPools &&
                                        <div className="btn-loader lds-dual-ring"></div>}</button>
                                    }

                                    {showResult3 &&
                                    <div id="testpoolsAlert3" className={"alert mt-3 "+ (colorResult ? "alert-success" : "alert-warning")}>
                                        {TestResult3}
                                    </div>
                                    }
                                </div>
                            </div>
                            }
                            {/* ./box-body */}
                        </div>
                    </div>
                    {/* ./ Box Pool 3 */}
                </div>
                {/* ./row */}

                <div className="row mt-5">
                    {isAdmin &&
                    <div className="col-md-12 text-center">
                        <br/>
                        <button ref="btn" disabled={!isLoaded || updatingPools} onClick={this.handleSubmit}
                                className="btn btn-primary">Update Pools {updatingPools &&
                        <div className="btn-loader lds-dual-ring"></div>}</button>
                        {showAlert &&
                        <div id="poolsAlert" className="alert alert-warning mt-3">
                            Please check your pools configuration, invalid fields are in red!
                        </div>
                        }
                    </div>
                    }
                </div>
            </div>
        );
    }
}

export default Poolspage;



// WEBPACK FOOTER //
// ./src/components/pages/poolsPage.js
