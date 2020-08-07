import React, { Component } from 'react';
import axios from 'axios';
import {
    getStorage,
    deleteStorage, setStorage, generateUrlEncoded,
} from '../lib/utils'
import chunkedRequest from 'chunked-request';
import ReactDOM from 'react-dom';
import {
  Redirect
} from 'react-router-dom';
class MinerTestPage extends Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            "isLoaded":false,
            "redirectToLogin":false,
            "logLines":[],
            "testing":false,
            "iscgrun":false,
            "resumesuccess":false,
            "alertMessage":""
        };
        this.startTest = this.startTest.bind(this);
        this.resumeCg = this.resumeCg.bind(this);
    }

    componentWillMount()
    {
        this.isTestRun();
    }

    componentDidMount()
    {
        this.isTestRunOnce();
    }

    startTest(event)
    {
        var page=this;
        var token=getStorage("jwt");
        if (token===null)
        {
            this.setState({"redirectToLogin":true});
        }
        else
        {
            var { alertMessage } = this.state;
            var currentChain=(this.refs.currentChain.value).replace(/\s/g, "");
            var currentPLL=(this.refs.currentPLL.value).replace(/\s/g, "");
            var currentVID=(this.refs.currentVID.value).replace(/\s/g, "");
            alertMessage="";
            if(currentChain.length == 0)
            {
                if(currentPLL.length > 0 || currentVID.length > 0)
                {
                    alertMessage="The chain should not be empty!";
                }
                else
                {
                    currentChain = "";
                    currentPLL = "";
                    currentVID = "";
                }
            }
            else
            {
                if(isNaN(currentChain))
                {
                    alertMessage="The current chain should be number!";
                }

                if(!((currentPLL.length == 0 && currentVID.length == 0) || (currentPLL.length > 0 && currentVID.length > 0)))
                {
                    alertMessage="The pll and vid should not be empty!";
                }
                else if(currentPLL.length > 0 && isNaN(currentPLL))
                {
                    alertMessage="The current pll should be number!";
                }
                else if(currentVID.length > 0 && isNaN(currentVID))
                {
                    alertMessage="The current vid should be number!";
                }
            }
            this.setState({"alertMessage":alertMessage});
            if(alertMessage === "")
            {
                var strSend = generateUrlEncoded({"chain":currentChain,"pll":currentPLL,"vid":currentVID});
                let axiosConfig = {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                };
                axios.post(window.customVars.urlPrefix+window.customVars.apiStartTest,strSend,axiosConfig)
                    .then(res => {
                        if (res.data.success === true)
                        {
                            page.setState({"testing":true});
                            page.runtest();
                        }
                        else
                        {
                            if ((typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired")
                            {
                                deleteStorage("jwt");
                                page.setState({"redirectToLogin":true});
                            }
                        }
                    })
                    .catch(function (error)
                    {
                    });
            }

        }
    }

    resumeCg(event)
    {
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
            axios.post(window.customVars.urlPrefix+window.customVars.apiStartCg,postData,axiosConfig)
                .then(res => {
                    if (res.data.success === true)
                    {
                        page.setState({"resumesuccess":true});
                    }
                    else
                    {
                        if ((typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired")
                        {
                            deleteStorage("jwt");
                            page.setState({"redirectToLogin":true});
                        }
                        page.setState({"iscgrun":true});
                    }

                })
                .catch(function (error)
                {

                });
        }
    }

    runtest()
    {
        var page=this;
        var token=getStorage("jwt");
        if (token===null)
        {
            this.setState({"redirectToLogin":true});
        }
        else
        {
            const { isLoaded, redirectToLogin,logLines } = this.state;
            var comp=this;
            function hasSuffix(s, suffix)
            {
                return s.substr(s.length - suffix.length) === suffix;
            }
            chunkedRequest({
                url: window.customVars.urlPrefix+window.customVars.apiMinerTest,
                method: 'GET',
                headers: {'Authorization': 'Bearer ' + token},
                chunkParser(bytes, state = {}, flush = false)
                {
                    if (!state.textDecoder)
                    {
                        state.textDecoder = new TextDecoder();
                    }
                    const textDecoder = state.textDecoder;
                    const chunkStr = textDecoder.decode(bytes, { stream: !flush });
                    const lines = chunkStr.split("\n");

                    if (!flush && !hasSuffix(chunkStr, "\n"))
                    {
                        state.trailer = lines.pop();
                    }

                    const linesObjects = lines
                        .filter(v => v.trim() !== '')
                        .map(v => v);

                    return [ linesObjects, state ];
                },
                onChunk(err, parsedChunk)
                {
                    parsedChunk.forEach(function(line)
                    {
                        logLines.push(line);
                    });
                    comp.setState({"logLines":logLines});
                }
            });
        }
    }

    isTestRun()
    {
        let page=this;
        let token=getStorage("jwt");
        if (token===null)
        {
            this.setState({"redirectToLogin":true});
        }
        else
        {
            let postData = {

            };
            let axiosConfig = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };
            axios.post(window.customVars.urlPrefix+window.customVars.apiIsTestRun,postData,axiosConfig)
                .then(res => {
                    if (res.data.success === true)
                    {
                        setTimeout(() => {
                            page.setState({"testing":true});
                        }, 0);

                    }
                    else
                    {
                        if ((typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired")
                        {
                            deleteStorage("jwt");
                            page.setState({"redirectToLogin":true});
                        }
                        setTimeout(() => {
                            page.setState({"testing":false});
                        }, 0);
                    }
                    setTimeout(() => {
                        page.isTestRun();
                    }, 5000);
                })
                .catch(function (error)
                {
                    setTimeout(() => {
                        page.isTestRun();
                    }, 5000);
                });
        }
    }

    isTestRunOnce()
    {
        let page=this;
        let token=getStorage("jwt");
        if (token===null)
        {
            this.setState({"redirectToLogin":true});
        }
        else
        {
            let postData = {

            };
            let axiosConfig = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };
            axios.post(window.customVars.urlPrefix+window.customVars.apiIsTestRun,postData,axiosConfig)
                .then(res => {
                    if (res.data.success === true)
                    {
                        this.setState({"testing":true});
                        this.runtest();
                    }
                    else
                    {
                        if ((typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired")
                        {
                            deleteStorage("jwt");
                            page.setState({"redirectToLogin":true});
                        }
                    }
                })
                .catch(function (error)
                {
                });
        }
    }


    render()
    {
        const { isLoaded, redirectToLogin,testing,iscgrun,resumesuccess,alertMessage } = this.state;
        if (redirectToLogin)
        {
          return <Redirect to="/login?expired" />;
        }
        return (
        <div className="Minertestpage">
            <h1>Debug<br/><small>Miner Test</small></h1>
            <div className="row">
                {/* Box  */}
                <div className="col-md-12 mt-5">
                    <div className="box">
                    <div className="box-header">
                        <h3>Miner Test{testing && <div className="lds-dual-ring pull-right"></div>}</h3>
                    </div>
                    <LogBox lines={this.state.logLines} />
                    <div className="box-footer">
                        <div className="form-group row mt-4 ">
                            <label htmlFor="input_test_chain" className="col-sm-1 col-form-label">Chain</label>
                            <div className="col-sm-11">
                                <input ref="currentChain" type="text" name="test_chain" className="form-control form-control-sm" id="input_test_chain" placeholder="Chain Number" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="input_test_pll" className="col-sm-1 col-form-label">PLL</label>
                            <div className="col-sm-11">
                                <input ref="currentPLL" type="text" name="test_pll" className="form-control form-control-sm" id="input_test_pll" placeholder="PLL Value" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="input_test_vid" className="col-sm-1 col-form-label">VID</label>
                            <div className="col-sm-11">
                                <input ref="currentVID" type="text" name="test_vid" className="form-control form-control-sm" id="input_test_vid" placeholder="VID Value" />
                            </div>
                        </div>
                        <button disabled={testing} className="btn btn-primary" onClick={this.startTest}>{!testing && "Start Test"}{testing && "The test is running"} {testing && <div className="btn-loader lds-dual-ring"></div>}</button>
                        {!testing && <button className="btn btn-warning ml-2" onClick={this.resumeCg}>Resume Cgminer</button>}

                        {iscgrun &&
                        <div className="alert alert-danger mt-2">
                            The Cgminer has already been running!
                        </div>
                        }

                        {resumesuccess &&
                        <div className="alert alert-info mt-2">
                            The Cgminer was running successful!
                        </div>
                        }

                        {alertMessage !== "" &&
                        <div className="alert alert-warning mt-2">
                            <strong>Error</strong> {alertMessage}
                        </div>
                        }

                        <div className="alert alert-warning mt-2">
                            <div className="row">
                                <div className="col-md-1">注意：</div>
                                <div className="col-md-11">测试完毕后请点击Resume Cgminer按钮恢复挖矿，否则设备将不会进入工作状态。</div>
                            </div>
                            <div className="row">
                                <div className="col-md-1">Attention:</div>
                                <div className="col-md-11">Please DO remember that your miner won't be working until you clicking the "Resume Cgminer" button.</div>
                            </div>
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

var LogBox = class LogBox extends React.Component
{
    componentDidMount()
    {
        const node = ReactDOM.findDOMNode(this);
        node.scrollTop = node.scrollHeight;
    }
    componentWillUpdate()
    {
        const node = ReactDOM.findDOMNode(this);
        this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
    }
    componentDidUpdate(prevProps)
    {
        if (this.shouldScrollBottom)
        {
            const node = ReactDOM.findDOMNode(this);
            node.scrollTop = node.scrollHeight;
        }
    }
    render()
    {
        return (
        <ul className="logBox small">
            {this.props.lines.map((line, index) => (
            <li key={index}>
            {line}
            </li>
            ))}
        </ul>
        );
    }
};
export default MinerTestPage;



// WEBPACK FOOTER //
// ./src/components/pages/minertestPage.js
