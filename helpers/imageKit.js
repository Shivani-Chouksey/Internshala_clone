var ImageKit = require("imagekit");


exports.initImageKit=function(){
    var imagekit = new ImageKit({
        publicKey: process.env.PULICEKEY_IMAGEKIT,
        privateKey: process.env.PRIVATEKEY_IMAGEKIT,
        urlEndpoint: process.env.URLENDPOINT_IMAGEKIT,
      });

    return imagekit
}