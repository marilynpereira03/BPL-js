const bs58check = require('bs58check');


var bs58checkEncode = function(tokenShortName,payload){
  let x;
  if(tokenShortName!="BPL"){
    x = tokenShortName + "_" + bs58check.encode(payload);
  }
  else {
    x = bs58check.encode(payload);
  }
  return x;
}

var bs58checkDecode = function(address){
      address = address.substring(address.indexOf("_") + 1);
      return bs58check.decode(address);
}

module.exports = {
  bs58checkEncode,
  bs58checkDecode
}
