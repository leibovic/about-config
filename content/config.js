/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const { classes: Cc, interfaces: Ci, manager: Cm, utils: Cu } = Components;
Cu.import("resource://gre/modules/Services.jsm");

var PrefsList = React.createClass({
  render: function() {
    return React.DOM.ul(
      this.props.prefs.slice(0, 100).map(function(pref) {
        return React.DOM.li(null, pref);
      })
    );
  }
});

var PrefsListFactory = React.createFactory(PrefsList);
React.render(
  PrefsListFactory({ prefs: Services.prefs.getChildList("").sort() }),
  document.body
);
