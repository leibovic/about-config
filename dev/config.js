/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

// var allPrefs = Services.prefs.getChildList("").sort();

var stuff = ["aa", "ab", "bb", "bbb", "foo", "bar", "baz"];
var allPrefs = [];
for (var i = 0; i < 1000; i++) {
  allPrefs.push(stuff[Math.floor(Math.random() * stuff.length)] + "-" + i);
}

var Pref = React.createClass({
  render: function() {
    return <li className="pref">{this.props.pref}</li>;
  }
});

var AboutConfig = React.createClass({
  getInitialState: function() {
    return { prefs: allPrefs }
  },

  handleScroll: function(e) {
    // XXX: Show more prefs if the user scrolls to the end of the lsit.
  },

  componentDidMount: function() {
    window.addEventListener("scroll", this.handleScroll);
  },

  componentWillUnmount: function() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  createNewPref: function() {
    // XXX: Show dialog to create a new pref.
  },

  filterPrefs: function(e) {
    var filterValue = e.target.value;
    if (!filterValue) {
      return allPrefs;
    }
    var filter = new RegExp(filterValue, "i");
    this.setState({
      prefs: allPrefs.filter(function(pref) {
        return filter.test(pref);
      })
    });
  },

  clearInput: function() {
    document.getElementById("input").value = "";
    this.setState({ prefs: allPrefs });
  },

  render: function() {
    // XXX: For now, only render first 100 prefs
    var prefs = this.state.prefs.slice(0, 100).map(function(pref) {
      return <Pref key={pref} pref={pref} />;
    });
    return (
      <div>
        <div className="toolbar">
          <button onClick={this.createNewPref}>New Pref</button>
          <input id="input" type="search" placeholder="Search" onInput={this.filterPrefs}/>
          <button onClick={this.clearInput}>Clear</button>
        </div>
        <ul className="prefs-list">{prefs}</ul>
      </div>
    );
  }
})

React.render(
  <AboutConfig/>,
  document.body
);
