"use strict";

const {interfaces: Ci, manager: Cm, results: Cr, utils: Cu} = Components;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

const contract = "@mozilla.org/network/protocol/about;1?what=config";
const description = "about:config";
const uuid = Components.ID("b4cd7fd2-c94d-450f-81cb-a5bc2b2ae238");

let factory = {
  createInstance: function(outer, iid) {
    if (outer != null)
      throw Cr.NS_ERROR_NO_AGGREGATION;

    return aboutConfig.QueryInterface(iid);
  }
};

let aboutConfig = {
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIAboutModule]),

  getURIFlags: function(aURI) {
    return Ci.nsIAboutModule.ALLOW_SCRIPT;
  },

  newChannel: function(aURI) {
    if (aURI.spec != "about:config")
      return;

    let uri = Services.io.newURI("chrome://config/content/config.xhtml", null, null);
    return Services.io.newChannelFromURI(uri);
  }
};

function startup(data, reason) {
  Cm.QueryInterface(Ci.nsIComponentRegistrar).registerFactory(uuid, description, contract, factory);
}

function shutdown(data, reason) {
  Cm.QueryInterface(Ci.nsIComponentRegistrar).unregisterFactory(uuid, factory);
}

function install(data, reason) {}

function uninstall(data, reason) {}
