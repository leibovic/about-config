/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const { classes: Cc, interfaces: Ci, manager: Cm, utils: Cu } = Components;
Cu.import("resource://gre/modules/Services.jsm");

var PrefsList = React.createClass({
  render: function() {
    var prefs = this.props.prefs.map(function(pref) {
      return <li>{ pref }</li>;
    });
    return <ul>{ prefs }</ul>;
  }
});

var prefs = Services.prefs.getChildList("").sort().slice(0, 100);
React.render(
  <PrefsList prefs={ prefs } />,
  document.body
);
