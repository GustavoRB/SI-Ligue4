/**
 * Created by Osvaldo on 19/10/15.
 */

var hub = require('../hub/hub.js');
var Mensagem = require('../util/mensagem.js');
var utility = require('util');
var basico = require('./basicRtc.js');
utility.inherits(RtcComum, basico);

function RtcComum(conf){
    var me = this;
    me.config = conf;

    console.log('rtcRoottttt', me.config.socket.id);
}

module.exports = RtcComum;