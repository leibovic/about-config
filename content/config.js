/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const { classes: Cc, interfaces: Ci, manager: Cm, utils: Cu } = Components;

Cu.import("resource://gre/modules/Services.jsm");

var allPrefs = Services.prefs.getChildList("").sort();
function getInputType(type) {
  switch(type) {
    case Services.prefs.PREF_BOOL:
      return "button";
    case Services.prefs.PREF_INT:
      return "number";
    case Services.prefs.PREF_STRING:
    default:
      return "text";
  }
}

function setPrefValue(type, name, value) {
  switch (type) {
    case Services.prefs.PREF_BOOL:
      Services.prefs.setBoolPref(name, value);
      break;
    case Services.prefs.PREF_INT:
      Services.prefs.setIntPref(name, value);
      break;
    case Services.prefs.PREF_STRING:
    default:
      Services.prefs.setCharPref(name, value);
  }

  // Ensure pref change flushed to disk immediately.
  Services.prefs.savePrefFile(null);
}

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
    this.setState({ value: value });
    setPrefValue(this.state.type, this.state.name, value);
  },

  handleClick: function(e) {
    if (this.state.type === Services.prefs.PREF_BOOL) {
      this.setValue(!this.state.value);
    }
  },

  handleChange: function(e) {
    if (e.target.value) {
      this.setValue(e.target.value);
    }
  },

  render: function() {
    var input;
    if (this.state.type == Services.prefs.PREF_BOOL) {
      input = (
        <select>
          <option value="false" selected={!this.state.value}>False</option>
          <option value="true" selected={!this.state.value}>True</option>
        </select>
      );
    } else {
      input = <input type={this.state.inputType} value={this.state.value} onChange={this.handleChange} onClick={this.handleClick}/>;
    }

    return (
      <li className="pref-item">
        <div onClick={this.handleClick}>{this.props.name}</div>
        <div>
          <input type={this.state.inputType} value={this.state.value} onChange={this.handleChange} onClick={this.handleClick}/>
        </div>
      </li>
    );
  }
});

var NewPrefDialog = React.createClass({
  getInitialState: function() {
    return {};
  },

  getDefaultValue: function(type) {
    return type == Services.prefs.PREF_BOOL ? false : "";
  },

  handleTypeChange: function(e) {
    this.setState({type: parseInt(e.target.value)});
  },

  handleCancel: function() {
    document.getElementById("new-pref-value").value = "0";
    document.getElementById("new-pref-name").value = "";
    document.getElementById("new-pref-value").value = "";
    document.getElementById("new-pref-dialog").removeAttribute("visible");
  },

  handleCreate: function() {
    var name = document.getElementById("new-pref-name").value;
    if (!name) {
      return;
    }

    var value = document.getElementById("new-pref-value").value;
    setPrefValue(this.state.type, name, value);

    this.handleCancel();
  },

  render: function() {
    var nameAndType = (
      <div>
        <input type="text" id="new-pref-name" placeholder="Name"/>
        <select id="new-pref-type" onChange={this.handleTypeChange}>
          <option value="0">Type</option>
          <option value={Services.prefs.PREF_BOOL}>Boolean</option>
          <option value={Services.prefs.PREF_STRING}>String</option>
          <option value={Services.prefs.PREF_INT}>Integer</option>
        </select>
      </div>
    );

    if (!this.state.type) {
      return <div id="new-pref-dialog-content">{nameAndType}</div>;
    }

    var input;
    if (this.state.type == Services.prefs.PREF_BOOL) {
      input = (
        <select id="new-pref-value">
          <option value="false">False</option>
          <option value="true">True</option>
        </select>
      );
    } else {
      input = <input id="new-pref-value" type={getInputType(this.state.type)} placeholder="Value"/>;
    }

    return (
      <div id="new-pref-dialog-content">
        {nameAndType}
        <div>{input}</div>
        <div>
          <button onClick={this.handleCancel}>Cancel</button>
          <button onClick={this.handleCreate}>Create</button>
        </div>
      </div>
    );
  }
});

var AboutConfig = React.createClass({
  getInitialState: function() {
    return { prefs: allPrefs, end: 30 };
  },

  handleScroll: function(e) {
    var prefsList = document.getElementById("prefs-list");
    if (prefsList.scrollHeight - (window.pageYOffset + window.innerHeight) < 200) {
      this.setState({ end: this.state.end + 30 });
    }
  },

  componentDidMount: function() {
    window.addEventListener("scroll", this.handleScroll);
  },

  componentWillUnmount: function() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  createNewPref: function() {
    document.getElementById("new-pref-dialog").setAttribute("visible", true);
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
    var prefs = this.state.prefs.slice(0, this.state.end).map(function(pref) {
      return <Pref key={pref} name={pref} />;
    });

    return (
      <div>
        <div id="toolbar">
          <input id="input" type="search" placeholder="Search" onInput={this.filterPrefs}/>
          <button onClick={this.clearInput}>Clear</button>
          <button onClick={this.createNewPref}>New Pref</button>
        </div>
        <div id="new-pref-dialog">
          <NewPrefDialog/>
        </div>
        <ul id="prefs-list">{prefs}</ul>
      </div>
    );
  }
})

React.render(
  <AboutConfig/>,
  document.body
);
