export function getStorage(name) {
    if (typeof (Storage) !== 'undefined') {
      return localStorage.getItem(name)
    } else {
      return null;
    }
  }

export function setStorage(name, val) {
  if (typeof (Storage) !== 'undefined') {
    localStorage.setItem(name, val)
  } else {
    return null;
  }
}

export function deleteStorage(name) {
  if (typeof (Storage) !== 'undefined') {
    localStorage.removeItem(name);
  }
}

export function formatUpTime(timestamp)
{
    var time = new Date(timestamp);
    var days=Math.floor(time/(24*3600*1000));
    var leave1=time%(24*3600*1000);
    var hours=Math.floor(leave1/(3600*1000));
    var leave2=leave1%(3600*1000);
    var minutes=Math.floor(leave2/(60*1000));
    var leave3=leave2%(60*1000);
    var seconds=Math.round(leave3/1000);
    var daysText="";
    var hoursText="";
    var minutesText="";
    if (days>0)
      daysText=days+'d ';
    if (hours>0)
      hoursText=hours+'h ';
    if (minutes>0)
      minutesText=minutes+'m';
    if (days==0&&hours==0&&minutes==0&&seconds>0)
        return seconds+'s'
    return daysText+hoursText+minutesText;
}

export function convertHashRate(hashRate,unit)
{
  var unit_list = ["","K","M","G","T","P","E"];
  var hash_show = hashRate;
  var unit_key = 0;
  while(hash_show >= 1000)
  {
    hash_show /= 1000;
    unit_key ++;
  }
  return hash_show.toFixed(2) + " " + unit_list[unit_key]+unit;

  // if(minertype == 'B29+')
  // {
  //   return (hashRate/1000).toFixed(2)+' KH/s';
  // }
  // else if(minertype == 'A8+')
  // {
  //   return hashRate.toFixed(2)+' KH/s';
  // }
  // else
  // {
  //   if (hashRate<1000)
  //   {
  //       return hashRate.toFixed(2)+' MH/s';
  //   }
  //   else if (hashRate>=1000 && hashRate<1000000)
  //   {
  //       return (hashRate/1000).toFixed(2)+' GH/s ';
  //   }
  //   else if (hashRate>=1000000)
  //   {
  //       return (hashRate / 1000000).toFixed(2) + ' TH/s ';
  //   }
  // }
}
export function parseQueryString(url)
{
    var obj={};
    var keyvalue=[];
    var key="",value="";
    var paraString=url.split("&");
    for(var i in paraString)
    {
        keyvalue=paraString[i].split("=");
        key=keyvalue[0];
        value=keyvalue[1];

        obj[key]=value;
    }
    return obj;
}
export function isUrlValid(url) {
  return /^(https?|stratum\+tcp|stratum\+tls|tcp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}


export function isUrlValid_diag(url)
{
    var strRegex = '^((https|http|ftp|rtsp|mms|stratum\\+tcp|stratum\\+tls|tcp)?://)'
        + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@ (ftp user@)
        + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 (URL in IP format)
        + '|' // 允许IP和DOMAIN（域名） (Allow IP and DOMAIN (domain name))
        + '([0-9a-z_!~*\'()-]+.)*' // 域名- www. (domain name)
        + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 (secondary domain)
        + '[a-z]{2,6})' // first level domain- .com or .museum
        + '(:[0-9]{1,4})?' // 端口- :80
        + '((/?)|' // a slash isn't required if there is no file name
        + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
    var re=new RegExp(strRegex);
    //re.test()
    if (re.test(url))
    {
        return true;
    }
    else
    {
        return false;
    }
}

export function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
}

export function isValidNetMask(mask)
{
    var exp=/^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
    var reg = mask.match(exp);
    if(reg==null)
    {
        return false; //"非法"
    }
    else
    {
        return true; //"合法"
    }
}
export function generateUrlEncoded(fields) {
  var formBody = [];
  Object.keys(fields).forEach(function(index)  {
    var encodedKey = encodeURIComponent(index);
    var encodedValue = encodeURIComponent(fields[index]);
    formBody.push(encodedKey + "=" + encodedValue);
  });
  return formBody.join("&");
}

export function getModeAndLevel(value)
{
  var return_info = {};
  var level_list = ["2","3","4","0","1","2","3","4","0","1","2","3","4","0","1","2","3"];
  var mode = "";
  var level = level_list[parseInt(value) - 1];
  switch (value) 
  {
    case 1:
    case 2:
    case 3:
      mode="efficient";
      break;
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      mode="balanced";
      break;
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
      mode="factory";
      break;
    case 14:
    case 15:
    case 16:
    case 17:
      mode="performance"
      break;
    default:
  }
  return_info['mode'] = mode;
  return_info['level'] = level;
  return return_info;
}

export function getAutoTuneValue(mode,level)
{
  var return_value;
  switch (mode) 
  {
    case "efficient":
      switch(level)
      {
        case "2":
         return_value = "1";
         break;
        case "3":
          return_value = "2";
          break;
        case "4":
          return_value = "3";
          break;
        default:
          return_value = "1";
          break;
      }
      break;
    case "balanced":
      switch(level)
      {
        case "0":
          return_value = "4";
          break;
        case "1":
          return_value = "5";
          break;
        case "2":
          return_value = "6";
          break;
        case "3":
          return_value = "7";
          break;
        case "4":
          return_value = "8";
          break;
        default:
          return_value = "6";
          break;
      }
      break;
    case "factory":
      switch(level)
      {
        case "0":
          return_value = "9";
          break;
        case "1":
          return_value = "10";
          break;
        case "2":
          return_value = "11";
          break;
        case "3":
          return_value = "12";
          break;
        case "4":
          return_value = "13";
          break;
        default:
          return_value = "11";
          break;
      }
      break;
    case "performance":
      switch(level)
      {
        case "0":
          return_value = "14";
          break;
        case "1":
          return_value = "15";
          break;
        case "2":
          return_value = "16";
          break;
        case "3":
          return_value = "17";
          break;
        default:
          return_value = "16";
          break;
      }
      break;
    default:
  }

  return return_value;
}

export function showLevel(mode,val)
{
    let get_val = parseInt(val);
    let eff_mode = [2,3,4];
    let bal_mode = [0,1,2,3,4];
    let fac_mode = [0,1,2,3,4];
    let per_mode = [0,1,2,3];
    switch (mode)
    {
        case "efficient":
            if(eff_mode.indexOf(get_val) < 0)
            {
              return "( wrong level )";
            }
            break;
        case "balanced":
            if(bal_mode.indexOf(get_val) < 0)
            {
                return "( wrong level )";
            }
            break;
        case "factory":
            if(fac_mode.indexOf(get_val) < 0)
            {
                return "( wrong level )";
            }
            break;
        case "performance":
            if(per_mode.indexOf(get_val) < 0)
            {
                return "( wrong level )";
            }
            break;
        default:
            return "( wrong mode )";
    }
    var sw_val = get_val - 2;
    var return_str = "";
    switch(sw_val)
    {
      case -2:
          return_str = " - -";
          break;
      case -1:
          return_str = " -";
          break;
      case 0:
          return_str = "";
          break;
      case 1:
          return_str = "+";
          break;
      case 2:
          return_str = "++";
          break;
      default:
          return_str = "";
          break;
    }
    return return_str;
}

export function showMode(val)
{
  var mode_str = "";
  switch(val)
  {
    case 1:
      mode_str="Efficiency";
      break;
    case 2:
      mode_str="Efficiency+";
      break;
    case 3:
      mode_str="Efficiency++";
      break;
    case 4:
      mode_str="Balanced - -";
      break;
    case 5:
      mode_str="Balanced -";
      break;
    case 6:
      mode_str="Balanced";
      break;
    case 7:
      mode_str="Balanced+";
      break;
    case 8:
      mode_str="Balanced++";
      break;
    case 9:
      mode_str="Factory - -";
      break;
    case 10:
      mode_str="Factory -";
      break;
    case 11:
      mode_str="Factory";
      break;
    case 12:
      mode_str="Factory+";
      break;
    case 13:
      mode_str="Factory++";
      break;
    case 14:
      mode_str="Performance - -";
      break;
    case 15:
      mode_str="Performance -";
      break;
    case 16:
      mode_str="Performance";
      break;
    case 17:
      mode_str="Performance+";
      break;
  }
  return mode_str;
}

export function StandardMode(str)
{
  var standardmode = "";
  switch (str) 
  {
    case "efficient":
        standardmode = "Efficiency";
        break;
    case "balanced":
        standardmode = "Balanced";
        break;
    case "factory":
        standardmode = "Factory";
        break;
    case "performance":
        standardmode = "Performance";
        break;
    default:
        standardmode = "Wrong Mode";
        break;
  }
  return standardmode;
}

export function isValidSpeed(speed)
{
    if(speed.length == 0 || (parseInt(speed) < 0 || parseInt(speed) > 100) || isNaN(speed))
    {
        return false;
    }
    else
    {
        return true;
    }
}

export function gradientColor(startColor,centerColor, endColor, step)
{
    let step1 = parseInt(step / 2);
    let step2 = step - step1;

    let startRGB = this.colorRgb(startColor);//转换为rgb数组模式 Convert to rgb array mode
    let startR = startRGB[0];
    let startG = startRGB[1];
    let startB = startRGB[2];

    let centerRGB = this.colorRgb(centerColor);
    let centerR = centerRGB[0];
    let centerG = centerRGB[1];
    let centerB = centerRGB[2];

    let endRGB = this.colorRgb(endColor);
    let endR = endRGB[0];
    let endG = endRGB[1];
    let endB = endRGB[2];

    let sR1 = (centerR - startR) / step1;//总差值 Total difference
    let sG1 = (centerG - startG) / step1;
    let sB1 = (centerB - startB) / step1;

    let sR2 = (endR - centerR) / step2;//总差值 Total difference
    let sG2 = (endG - centerG) / step2;
    let sB2 = (endB - centerB) / step2;

    let colorArr1 = [];
    let colorArr2 = [];
    for (let i = 0; i < step1; i++)
    {
        //计算每一步的hex值
        // Calculate the hex value of each step
        let hex = this.colorHex('rgb('+ parseInt((sR1 * i + startR))+ ',' + parseInt((sG1 * i + startG))+ ',' + parseInt((sB1 * i + startB)) + ')');
        colorArr1.push(hex);
    }

    for (let j = 0; j < step2; j++)
    {
        //计算每一步的hex值
        // Calculate the hex value of each step
        let hex = this.colorHex('rgb('+ parseInt((sR2 * j + centerR))+ ',' + parseInt((sG2 * j + centerG))+ ',' + parseInt((sB2 * j + centerB)) + ')');
        colorArr2.push(hex);
    }
    return colorArr1.concat(colorArr2);
}

// 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
// Convert hex representation to rgb representation (here return to rgb array mode)
gradientColor.prototype.colorRgb = function (sColor)
{
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var sColor = sColor.toLowerCase();
    if (sColor && reg.test(sColor))
    {
        if (sColor.length === 4)
        {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1)
            {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        // Process the six-digit color value
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2)
        {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return sColorChange;
    }
    else
    {
        return sColor;
    }
};

// 将rgb表示方式转换为hex表示方式
// Convert rgb representation to hex representation
gradientColor.prototype.colorHex = function (rgb)
{
    var _this = rgb;
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (/^(rgb|RGB)/.test(_this))
    {
        var aColor = _this.replace(/(?:(|)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i = 0; i < aColor.length; i++)
        {
            var hex = Number(aColor[i]).toString(16);
            hex = hex < 10 ? 0 + '' + hex : hex;// 保证每个rgb的值为2位
            if (hex === "0")
            {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7)
        {
            strHex = _this;
        }
        return strHex;
    }
    else if (reg.test(_this))
    {
        var aNum = _this.replace(/#/, "").split("");
        if (aNum.length === 6)
        {
            return _this;
        }
        else if (aNum.length === 3)
        {
            var numHex = "#";
            for (var i = 0; i < aNum.length; i += 1)
            {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    }
    else
    {
        return _this;
    }
}

export function set_to_five(num)
{
    if(!isNaN(num))
    {
        let s;
        s = num / 5;
        let s_top = (parseInt(s) + 1) * 5;
        return s_top;
    }
    else
    {
        return num;
    }

}


// WEBPACK FOOTER //
// ./src/components/lib/utils.js
