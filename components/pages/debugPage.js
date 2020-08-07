import React, { Component } from 'react';
import axios from 'axios';
import {getStorage, setStorage, deleteStorage, generateUrlEncoded, gradientColor, convertHashRate,set_to_five} from '../lib/utils'

import {
  Redirect
} from 'react-router-dom';
import {Line} from 'react-chartjs-2';

class Debugpage extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
        "isLoaded":false,
        "boards": [],
        "redirectToLogin":false,
        "hashes": [],
        "show_nonce":false,
        "show_chip_reject":false
        };
    }


    componentDidMount()
    {
        var page=this;
        var token=getStorage("jwt");
        if (token===null)
        {
            this.setState({"redirectToLogin":true});
        }
        else
        {
            var postData = {};
            let axiosConfig = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };
            axios.post(window.customVars.urlPrefix+window.customVars.apiDebug,postData,axiosConfig)
            .then(res => {
                if (res.data.success&&res.data.boards&&res.data.boards.length>0)
                {
                    page.setState({"isLoaded":true,"boards":res.data.boards,"hashes":res.data.hashes,"show_nonce":res.data.show_nonce,"show_chip_reject":res.data.show_chip_reject});
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
        const { isLoaded, redirectToIndex,redirectToLogin,boards,hashes,show_nonce,show_chip_reject } = this.state;
        if (redirectToLogin)
        {
            return <Redirect to="/login?expired" />;
        }
        return (
            <div className="Debugpage">
                <h1>Stats<br/><small>Miner Stats and Versions</small></h1>
                <div className="row">
                    {/* Box  */}
                    <div className="col-md-12 mt-5">
                        <div className="box">
                            <div className="box-header">
                                <h3>Miner Stats {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                            </div>
                            <div className="box-body p-4">
                                <h4>GIT hashes</h4>
                                <div className="row">
                                    <div className="col-md-3 field-title">
                                        Firmware
                                    </div>
                                    <div className="col-md-9 field-value">
                                        {hashes.firmware && hashes.firmware}
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-3 field-title">
                                        CgMiner
                                    </div>
                                    <div className="col-md-9 field-value">
                                        {hashes.cgminer && hashes.cgminer}
                                    </div>
                                </div>
                                <div className="row  mt-2">
                                    <div className="col-md-3 field-title">
                                        Backend
                                    </div>
                                    <div className="col-md-9 field-value">
                                        {hashes.backend && hashes.backend}
                                    </div>
                                </div>
                                <hr/>
                                <h4>Boards</h4>
                                {boards.map((item, index) => {
                                    let top_color = "#F8696B";
                                    let middle_color = "#FFEB84";
                                    let end_color = "#63BE7B";
                                    let red_color = "#FF0000";
                                    let green_color = "#00FF00";
                                    let Temp_colorArr = new gradientColor(end_color,middle_color,top_color,30);
                                    let Vol_colorArr = new gradientColor(end_color,middle_color,top_color,40);
                                    //temp area
                                    let temp_area_max = parseInt(item.board["Temp"]) + 15;
                                    let temp_area_min = parseInt(item.board["Temp"]) - 15;
                                    // vol area
                                    let vol_area_max = parseInt(item.board["Voltage Avg"]) + 20;
                                    let vol_area_min = parseInt(item.board["Voltage Avg"]) - 20;
                                    let Nonce_colorArr;
                                    if(show_nonce)
                                    {
                                        Nonce_colorArr =  new gradientColor(end_color,middle_color,top_color,item.nonce_area.area + 1);
                                    }

                                    let x_labels = [];
                                    let tmp_temp_data = [];
                                    let temp_data ={
                                        label: 'T',
                                        fill: false,
                                        borderColor: "#f57e22",
                                        pointHoverBackgroundColor: "#f57e22",
                                        pointHoverBorderColor: "#f57e22",
                                        yAxisID: 'y-axis-1'
                                    };
                                    let tmp_vol_data = [];
                                    let vol_data ={
                                        label: 'V',
                                        fill: false,
                                        borderColor: "#f57e22",
                                        pointHoverBackgroundColor: "#f57e22",
                                        pointHoverBorderColor: "#f57e22",
                                        yAxisID: 'y-axis-1'
                                    };
                                    let tmp_nonce_data = [];
                                    let nonce_data ={
                                        label: 'N',
                                        fill: false,
                                        borderColor: "#20c997",
                                        pointHoverBackgroundColor: "#20c997",
                                        pointHoverBorderColor: "#20c997",
                                        yAxisID: 'y-axis-2',
                                        hidden:true
                                    };
                                    let total_nonce = 0;
                                    for(var j=0;j<item.chips.length;j++)
                                    {
                                        x_labels.push(j+1);
                                        tmp_temp_data.push(item.chips[j].Temp);
                                        tmp_vol_data.push(item.chips[j].nVol);
                                        tmp_nonce_data.push(item.chips[j]["Nonces found"]);
                                        total_nonce += parseInt(item.chips[j]["Nonces found"]);
                                    }
                                    let avg_nonce = parseInt(total_nonce / item.chips.length);
                                    let start_nonce = parseInt(avg_nonce * 4 / 3);
                                    let end_nonce = parseInt(avg_nonce * 2 / 3);
                                    let step_nonce = parseInt((start_nonce - end_nonce) / 15);
                                    temp_data['data'] = tmp_temp_data;
                                    vol_data['data'] = tmp_vol_data;
                                    nonce_data['data'] = tmp_nonce_data;
                                    // console.log(x_labels);
                                    // console.log(temp_data);
                                    // console.log(vol_data);
                                    // console.log(nonce_data);
                                    // console.log(start_nonce);
                                    // console.log(end_nonce);
                                    let temp_show_data = {
                                        labels: x_labels,
                                        datasets: [temp_data,nonce_data]
                                    };
                                    let vol_show_data = {
                                        labels: x_labels,
                                        datasets: [vol_data,nonce_data]
                                    };

                                    let chart_option_1 =
                                    {
                                        tooltips: {
                                            mode: 'index',
                                            intersect: false,
                                        },
                                        maintainAspectRatio: false,
                                        elements:
                                            {
                                                point: {
                                                    radius: 3,
                                                    hitRadius: 5,
                                                    hoverRadius: 5
                                                }
                                            },
                                        hover:
                                            {
                                                mode: 'nearest',
                                                intersect: true
                                            },
                                        scales: {
                                            xAxes: [{
                                                display: true,
                                                ticks:
                                                    {
                                                        callback: function(dataLabel, index)
                                                        {
                                                            return index % 5 === 0 ? dataLabel : '';
                                                        }
                                                    }
                                            }],
                                            yAxes: [
                                                {
                                                    display: true,
                                                    position: 'left',
                                                    ticks: {
                                                        beginAtZero: false,
                                                        stepSize:5,
                                                        max:set_to_five(parseInt(item.board["Temp max"]) + 20),
                                                        min:set_to_five(parseInt(item.board["Temp min"]) - 20),
                                                        callback: function(label, index, labels)
                                                        {
                                                            return label;
                                                        }
                                                    },
                                                    id: 'y-axis-1',
                                                },
                                                {
                                                    display: true,
                                                    position: 'right',
                                                    ticks: {
                                                        beginAtZero: true,
                                                        stepSize:step_nonce,
                                                        // max:start_nonce,
                                                        // min:end_nonce,
                                                        callback: function(label, index, labels)
                                                        {
                                                            return label;
                                                        }
                                                    },
                                                    id: 'y-axis-2',
                                                }
                                            ]
                                        }
                                    };
                                    let chart_option_2 =
                                    {
                                        tooltips:
                                            {
                                                mode: 'index',
                                                intersect: false,
                                            },
                                        maintainAspectRatio: false,
                                        elements:
                                            {
                                                point: {
                                                    radius: 3,
                                                    hitRadius: 5,
                                                    hoverRadius: 5
                                                }
                                            },
                                        hover:
                                            {
                                                mode: 'nearest',
                                                intersect: true
                                            },
                                        scales: {
                                            xAxes: [{
                                                display: true,
                                                ticks:
                                                    {
                                                        callback: function(dataLabel, index)
                                                        {
                                                            return index % 5 === 0 ? dataLabel : '';
                                                        }
                                                    }
                                            }],
                                            yAxes: [
                                                {
                                                    display: true,
                                                    position: 'left',
                                                    ticks: {
                                                        beginAtZero: false,
                                                        stepSize:5,
                                                        max:set_to_five(parseInt(item.board["Voltage Max"]) + 20),
                                                        min:set_to_five(parseInt(item.board["Voltage Min"]) - 20),
                                                        callback: function(label, index, labels)
                                                        {
                                                            return label;
                                                        }
                                                    },
                                                    id: 'y-axis-1'
                                                },
                                                {
                                                    display: true,
                                                    position: 'right',
                                                    ticks: {
                                                        beginAtZero: true,
                                                        stepSize:step_nonce,
                                                        // max:start_nonce,
                                                        // min:end_nonce,
                                                        callback: function(label, index, labels)
                                                        {
                                                            return label;
                                                        }
                                                    },
                                                    id: 'y-axis-2',
                                                }
                                            ]
                                        }
                                    };

                                    //A10 chip reject
                                    if(show_chip_reject)
                                    {
                                        var colors=["#03a9f3","#20c997","#bc2929","#6c757d","#ab8ce4","#6495ED","#fec107","#6610f2"];
                                        var dataSets=[];
                                        var times=[];

                                        if (item.chip_stats)
                                        {
                                            Object.keys(item.chip_stats).forEach(function(key)
                                            {
                                                var chain=item.chip_stats[key];
                                                var dataSet={
                                                    label: 'Chip '+parseInt(key),
                                                    data: chain,
                                                    fill: false,
                                                    borderWidth: 2,
                                                    borderColor: colors[key],
                                                    pointHoverBackgroundColor: colors[key],
                                                    pointHoverBorderColor: colors[key],
                                                    pointRadius:4,
                                                    pointHitRadius:10,
                                                    showLine: false
                                                };
                                                dataSets.push(dataSet);
                                            });
                                        }
                                        if (item.chip_times)
                                        {
                                            item.chip_times.forEach(function(time)
                                            {
                                                var date=new Date(time*1000);
                                                date.setSeconds(0,0);
                                                times.push(date);
                                            });
                                        }

                                        var chipRejectData={
                                            labels: times,
                                            datasets: dataSets
                                        };

                                        var chipRejectOptions=
                                        {
                                            tooltips: {
                                                callbacks: {
                                                    label: function(tooltipItem, data)
                                                    {
                                                        return " "+tooltipItem.yLabel;
                                                    }
                                                }
                                            },
                                            maintainAspectRatio: false,
                                            elements: {
                                                point: {
                                                    radius: 1,
                                                    hitRadius: 6,
                                                    hoverRadius: 6,
                                                    pointStyle:"circle"
                                                }
                                            },
                                            scales: {
                                                xAxes: [{
                                                    type: 'time',
                                                    time: {
                                                        unit: "hour"
                                                    }
                                                }],
                                                yAxes: [
                                                    {
                                                        ticks: {
                                                            callback: function(label, index, labels)
                                                            {
                                                                return label;
                                                            }
                                                        }
                                                    }
                                                ]
                                            }

                                        };
                                    }


                                    return (<div key={index} className="mt-3">
                                        <h5>Board {item.board["Chain ID"] + 1}</h5>
                                        <div className="row small">
                                            {Object.keys(item.board).map(function (key) {
                                                return <div className="col-md-4" key={key}>
                                                    <b>{key}:</b> {item.board[key] !== false && item.board[key]}{item.board[key] === false && "false"}{item.board[key] === true && "true"}
                                                </div>
                                            })}
                                        </div>
                                        <button className="btn btn-primary mt-2" type="button" data-toggle="collapse"
                                                data-target={"#collapse" + index} aria-expanded="false"
                                                aria-controls={"collapse" + index} >
                                            Show Chips
                                        </button>
                                        <button className="btn btn-primary mt-2 ml-2" type="button"
                                                data-toggle="collapse" data-target={"#chipstruct" + index}
                                                aria-expanded="false" aria-controls={"chipstruct" + index}>
                                            Show Chart
                                        </button>
                                        <div className="row" id={"#coll_parent" + index}>
                                            <div className="collapse small col-md-12" id={"collapse" + index}>
                                                <table className="table table-striped mt-2 debug-table">
                                                    <thead>
                                                    <tr>
                                                        <th scope="col">ID</th>
                                                        {Object.keys(item.chips[0]).map(function (key)
                                                        {
                                                            return (<th scope="col">{key}</th>)
                                                        })}
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {item.chips.map((chip, indexChip) => (
                                                        <tr key={indexChip}>
                                                            <td>{indexChip + 1}</td>
                                                            {Object.keys(item.chips[0]).map(function (key)
                                                            {
                                                                return (<td>{chip[key] !== false && chip[key]}{chip[key] === false && "false"}{chip[key] === true && "true"}</td>)
                                                            })}
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="collapse small mt-2" id={"chipstruct" + index} data-parent={"#coll_parent" + index}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <table className="table table-bordered chip-structure">
                                                        <tbody>
                                                        {item.structure.map((detail, index) => (
                                                            <tr>
                                                                {index === 0 && <td rowSpan={item.structure.length} className="td-noboard-right"><i className="fa fa-arrow-left"></i></td>}
                                                                {index === 0 && <td rowSpan={item.structure.length} className="td-noboard-left">FAN<br/>OUT</td>}
                                                                {detail.map((td_info, index) => {
                                                                    if (td_info["code"] > 0)
                                                                    {
                                                                        let show_color = "";
                                                                        if (td_info["temp"] >= temp_area_max)
                                                                        {
                                                                            show_color = red_color;
                                                                        }
                                                                        else if(td_info["temp"] <= temp_area_min)
                                                                        {
                                                                            show_color = green_color;
                                                                        }
                                                                        else
                                                                        {
                                                                            let color_key = td_info["temp"] - temp_area_min;
                                                                            show_color = Temp_colorArr[color_key];
                                                                        }
                                                                        return (
                                                                            <td style={{"background-color": show_color}}>
                                                                                <span>{td_info["code"]}</span><br/>
                                                                                <span className="debug-info">{td_info["temp"]}</span><br/>
                                                                                {td_info["nonce"] && <span className="nonce-info">{td_info["nonce"]}</span>}
                                                                            </td>)
                                                                    }
                                                                    else {
                                                                        return (<td></td>)
                                                                    }
                                                                })}
                                                                {index === 0 && <td rowSpan={item.structure.length} className="td-noboard-right"><i className="fa fa-arrow-left"></i></td>}
                                                                {index === 0 && <td rowSpan={item.structure.length} className="td-noboard-left">FAN<br/>IN</td>}
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 mt-2">
                                                    <div className="box">
                                                        <div className="box-body chart-height">
                                                            <Line data={temp_show_data} options={chart_option_1}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <table className="table table-bordered chip-structure">
                                                        <tbody>
                                                        {item.structure.map((detail, index) => (
                                                            <tr>

                                                                {index === 0 && <td rowSpan={item.structure.length} className="td-noboard-right"><i className="fa fa-arrow-left"></i></td>}
                                                                {index === 0 && <td rowSpan={item.structure.length} className="td-noboard-left">FAN<br/>OUT</td>}
                                                                {detail.map((td_info, index) => {
                                                                    if (td_info["code"] > 0)
                                                                    {
                                                                        let show_color = "";
                                                                        if (td_info["vol"] >= vol_area_max)
                                                                        {
                                                                            show_color = red_color;
                                                                        }
                                                                        else if(td_info["vol"] <= vol_area_min)
                                                                        {
                                                                            show_color = green_color;
                                                                        }
                                                                        else
                                                                        {
                                                                            let color_key = td_info["vol"] - vol_area_min;
                                                                            show_color = Vol_colorArr[color_key];
                                                                        }
                                                                        return (
                                                                            <td style={{"background-color": show_color}}>
                                                                                <span>{td_info["code"]}</span><br/>
                                                                                <span className="debug-info">{td_info["vol"]}</span><br/>
                                                                                {td_info["nonce"] && <span className="nonce-info">{td_info["nonce"]}</span>}
                                                                            </td>)
                                                                    }
                                                                    else {
                                                                        return (<td></td>)
                                                                    }
                                                                })}
                                                                {index === 0 && <td rowSpan={item.structure.length} className="td-noboard-right"><i className="fa fa-arrow-left"></i></td>}
                                                                {index === 0 && <td rowSpan={item.structure.length} className="td-noboard-left">FAN<br/>IN</td>}
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 mt-2">
                                                    <div className="box">
                                                        <div className="box-body chart-height">
                                                            <Line data={vol_show_data} options={chart_option_2}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {show_nonce && <div className="row">
                                                <div className="col-md-12">
                                                    <table className="table table-bordered chip-structure">
                                                        <tbody>
                                                        {item.structure.map((detail, index) => (
                                                            <tr>

                                                                {index === 0 && <td rowSpan={item.structure.length} className="td-noboard-right"><i className="fa fa-arrow-left"></i></td>}
                                                                {index === 0 && <td rowSpan={item.structure.length} className="td-noboard-left">FAN<br/>OUT</td>}
                                                                {detail.map((td_info, index) => {
                                                                    if (td_info["code"] > 0)
                                                                    {
                                                                        let show_color = "";
                                                                        show_color = Nonce_colorArr[td_info["nonce"] - item.nonce_area.min];
                                                                        return (
                                                                            <td style={{"background-color": show_color}}>
                                                                                <span>{td_info["code"]}</span><br/>
                                                                                {td_info["nonce"] && <span className="debug-info">{td_info["nonce"]}</span>}<br/>
                                                                                <span className="nonce-info">{td_info["vol"]}</span>
                                                                            </td>)
                                                                    }
                                                                    else {
                                                                        return (<td></td>)
                                                                    }
                                                                })}
                                                                {index === 0 && <td rowSpan={item.structure.length} className="td-noboard-right"><i className="fa fa-arrow-left"></i></td>}
                                                                {index === 0 && <td rowSpan={item.structure.length} className="td-noboard-left">FAN<br/>IN</td>}
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>}
                                            {show_chip_reject && <div className="row">
                                                <div className="col-md-12 mt-2">
                                                    <div className="box">
                                                        <div className="box-body chart-height">
                                                            <Line data={chipRejectData} options={chipRejectOptions} height={268}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>}
                                        </div>
                                        <hr/>
                                    </div>)
                                })}
                            </div>
                        </div>
                    </div>
                    {/* ./ Box  */}
                </div>
            </div>
        );
    }
}
export default Debugpage;



// WEBPACK FOOTER //
// ./src/components/pages/debugPage.js 
