import React, { Component } from 'react';
import axios from 'axios';
import {getStorage,setStorage,deleteStorage,generateUrlEncoded} from '../lib/utils'
import chunkedRequest from 'chunked-request';
import ReactDOM from 'react-dom';
import {
  Redirect
} from 'react-router-dom';

class Logspage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      "isLoaded":false,
      "redirectToLogin":false,
      "logLines":[],
    };

  }



  componentDidMount() {
    var page=this;
    var token=getStorage("jwt");
    if (token===null) {
      this.setState({"redirectToLogin":true});
    } else {
    const { isLoaded, redirectToLogin,logLines } = this.state;
    var comp=this;
    function hasSuffix(s, suffix) {
      return s.substr(s.length - suffix.length) === suffix;
    }
    chunkedRequest({
       url: window.customVars.urlPrefix+window.customVars.apiStreamLogs,
       method: 'GET',
       headers: {'Authorization': 'Bearer ' + token},
       chunkParser(bytes, state = {}, flush = false) {
          if (!state.textDecoder) {
            state.textDecoder = new TextDecoder();
          }
          const textDecoder = state.textDecoder;
          const chunkStr = textDecoder.decode(bytes, { stream: !flush })
          const lines = chunkStr.split("\n");

          if (!flush && !hasSuffix(chunkStr, "\n")) {
            state.trailer = lines.pop();
          }

          const linesObjects = lines
            .filter(v => v.trim() !== '')
            .map(v => v);

          return [ linesObjects, state ];
        },
       onChunk(err, parsedChunk) {
         parsedChunk.forEach(function(line)  {
          logLines.push(line);
         });
         comp.setState({"logLines":logLines});
       }
     });
   }

  }

  render() {
    const { isLoaded, redirectToLogin } = this.state;

    if (redirectToLogin) {
      return <Redirect to="/login?expired" />;
    }

    return (
      <div className="Logspage">

      <h1>Debug<br/><small>System Logs</small></h1>

      <div className="row">

          {/* Box  */}
           <div className="col-md-12 mt-5">
             <div className="box">
                <div className="box-header">
                  <h3>System Logs {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                </div>
                 <LogBox lines={this.state.logLines} />
             </div>
           </div>
           {/* ./ Box  */}
        </div>

      </div>
    );
  }
}

var LogBox = class LogBox extends React.Component {
  componentDidMount() {
  const node = ReactDOM.findDOMNode(this);
  node.scrollTop = node.scrollHeight;
}
componentWillUpdate() {
  const node = ReactDOM.findDOMNode(this);
  this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
}
componentDidUpdate(prevProps) {
  if (this.shouldScrollBottom) {
    const node = ReactDOM.findDOMNode(this);
    node.scrollTop = node.scrollHeight;
  }
}

  render(){
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

export default Logspage;



// WEBPACK FOOTER //
// ./src/components/pages/logsPage.js
