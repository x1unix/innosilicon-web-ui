
import React, { Component } from 'react';
import axios from 'axios';
import {getStorage, generateUrlEncoded} from '../lib/utils'
import { Redirect } from 'react-router-dom';

class ErrorcodePage extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            ErrLoaded:false,
            ErrManualLoaded:false,
            err_code:"",
            err_msg:"",
            err_description:"",
            err_analysis:"",
            alertMessage:"",
            ErrManual:[],
            NoteInfo:"",
        };
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
            axios.post(window.customVars.urlPrefix+window.customVars.apiGetError,postData,axiosConfig)
                .then(function (response)
                {
                    if (response.data.success==true)
                    {
                        let detail_msg = response.data.detail;
                        let analysis = detail_msg.analysis.replace(/\n/g,"<br>");
                        comp.setState({"err_code":response.data.code,"err_description":detail_msg.description,"err_msg":detail_msg.msg,"err_analysis":analysis,"ErrLoaded":true});
                    }
                })
                .catch(function (error)
                {

                });

            axios.post(window.customVars.urlPrefix+window.customVars.apiGetErrorManual,postData,axiosConfig)
                .then(function (response)
                {
                    if (response.data.success==true)
                    {
                        let info_arr = [];
                        let info = response.data.info.err_arr;
                        let note = response.data.info.note_info.replace(/\n/g,"<br>");
                        // let analysis = detail_msg.analysis.replace(/\n/g,"<br>");
                        for(var index in info)
                        {
                            var in_arr = [];
                            in_arr.push(index);
                            for(var key in info[index])
                            {
                                if(key == 'analysis')
                                {
                                    in_arr.push(info[index][key].replace(/\n/g,"<br>"));
                                }
                                else
                                {
                                    in_arr.push(info[index][key]);
                                }
                            }
                            info_arr.push(in_arr);
                        }
                        comp.setState({"ErrManual":info_arr,"ErrManualLoaded":true,"NoteInfo":note});
                    }
                })
                .catch(function (error)
                {

                });
        }
    }

    render()
    {
        const { ErrLoaded,ErrManualLoaded,redirectToLogin,err_code,err_description,err_msg,alertMessage,err_analysis,ErrManual,NoteInfo } = this.state;
        if (redirectToLogin)
        {
            return <Redirect to="/login?expired" />;
        }
        ErrManual.forEach(function(line,index){console.log(line);console.log(line[0])});
        return (
        <div className="Errorcodepage">
            <h1>Error Code<br/><small>error message</small></h1>
            <div className="row">
                {/* Box */}
                <div className="col-md-12 mt-5">
                    <div className="box">
                        <div className="box-header">
                            <h3>Error Code{!ErrLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                        </div>
                        <div className="box-body body-style-error">
                            <div className="row">
                                <div className="col-md-3 col-sm-6 font-weight-bold">
                                    ERROR CODE:
                                </div>
                                <div className="col-md-9 col-sm-6">
                                    {err_code}
                                </div>
                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col-md-3 col-sm-6 font-weight-bold">
                                    ERROR MESSAGE:
                                </div>
                                <div className="col-md-9 col-sm-6 wrap-word">
                                    {err_msg}
                                </div>
                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col-md-3 col-sm-6 font-weight-bold">
                                    DESCRIPTION:
                                </div>
                                <div className="col-md-9 col-sm-6 wrap-word">
                                    {err_description}
                                </div>
                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col-md-3 col-sm-6 font-weight-bold">
                                    SOLUTION:
                                </div>
                                <div className="col-md-9 col-sm-6 wrap-word" dangerouslySetInnerHTML={{__html: err_analysis}}>
                                </div>
                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col-md-12 col-sm-12 wrap-word" dangerouslySetInnerHTML={{__html: NoteInfo}}>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ./ Box  */}
            </div>
            <div className="row">
                <div className="col-md-12 mt-5">
                    <div className="box">
                        <div className="box-header">
                            <h3>ErrorCode Manual{!ErrManualLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                        </div>
                        <div className="box-body body-style-manual">
                            <div className="row">
                                <table className="table table-hover table-dark">
                                    <thead>
                                    <tr>
                                        <th scope="col">错误码</th>
                                        <th scope="col">错误名称</th>
                                        <th scope="col">说明</th>
                                        <th scope="col">解决步骤</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {ErrManual.map((line, index) => (
                                        <tr>
                                            <td>{line[0]}</td>
                                            <td>{line[1]}</td>
                                            <td>{line[2]}</td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{__html: line[5]}}></div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}
export default ErrorcodePage;



// WEBPACK FOOTER //
// ./src/components/pages/errorcodePage.js
