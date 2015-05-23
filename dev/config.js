/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

// Shim ===============================

var Services = {
  prefs: {
    PREF_STRING: 32,
    PREF_INT: 64,
    PREF_BOOL: 128,

    getChildList: function() {
      var stuff = ["aa", "ab", "bb", "bbb", "foo", "bar", "baz"];
      var list = [];
      for (var i = 0; i < 1000; i++) {
        list.push(stuff[Math.floor(Math.random() * stuff.length)] + "-" + i);
      }
      return list;
    },

    getPrefType: function(name) {
      return this.PREF_BOOL;
    },

    getBoolPref: function(name) {
      return Math.random() < 0.5;
    },

    setBoolPref: function(name, value) {

    }
  }
}

// =====================================


var allPrefs = Services.prefs.getChildList("").sort();

var Pref = React.createClass({
  getInitialState: function() {
    var type = Services.prefs.getPrefType(this.props.name);
    return {
      type: type,
      value: this.getValue(type, this.props.name)
    };
  },

  getValue: function(type) {
    switch (type) {
      case Services.prefs.PREF_BOOL:
        return Services.prefs.getBoolPref(this.props.name);
      case Services.prefs.PREF_INT:
        return Services.prefs.getIntPref(this.props.name);
      case Services.prefs.PREF_STRING:
      default:
        return Services.prefs.getCharPref(this.props.name);
    }
  },

  setValue: function(value) {
    switch (this.state.type) {
      case Services.prefs.PREF_BOOL:
        Services.prefs.setBoolPref(this.props.name, value);
        break;
      case Services.prefs.PREF_INT:
        Services.prefs.setIntPref(this.props.name, value);
        break;
      case Services.prefs.PREF_STRING:
      default:
        Services.prefs.setCharPref(this.props.name, value);
    }

    // Ensure pref change flushed to disk immediately.
    //Services.prefs.savePrefFile(null);
    this.setState({ value: value });
  },

  handleClick: function(e) {
    if (this.state.type === Services.prefs.PREF_BOOL) {
      this.setValue(!this.state.value);
    }
  },

  render: function() {
    return (
      <li className="pref-item">
        <div className="pref-name" onClick={ this.handleClick }>{ this.props.name }</div>
        <div className="pref-item-line">{ this.state.value.toString() }</div>
      </li>
    );
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
      return this.setState({prefs: allPrefs });
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
      return <Pref key={pref} name={pref} />;
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
