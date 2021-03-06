import React, { Component } from 'react';
import './App.css';

import * as serverAPI from './actions/serverAPI';

import Table from './components/Table';
import Search from './components/Search';
import Navigation from './components/Navigation';
import DetailPage from './DetailPage';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      politicians: [],
      original_politicians: [],     
    };    
    this.loadListOfPoliticiants = this.loadListOfPoliticiants.bind(this);        
    this.filterNames = this.filterNames.bind(this);
  }

  componentWillMount() {
    this.loadListOfPoliticiants();
  }

  loadListOfPoliticiants() {
    serverAPI.listPoliticians(
      (list) => {
        this.setState({
          politicians: list,
          original_politicians : list,
        });
      });
  }

  static normalizeName(name) {
      return name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  filterNames(query) {
    query = App.normalizeName(query);
    const politicians = this.state.original_politicians.filter(p => 
      (App.normalizeName(p.firstname).startsWith(query) || App.normalizeName(p.surname).startsWith(query) || App.normalizeName(p.party_abbreviation).indexOf(query) !== -1));
    this.setState({
      politicians : politicians, 
    })
  }

  render() {
    let detail_id = window.location.href.replace(/.*\?/,"");
    return (window.location.href.indexOf("?") !== -1) ?
     (<DetailPage id={detail_id} />) :
     (
      <div className="App container">        
        <div className="App-header">
          <Navigation />
          <div className="App-title">                                  
          </div>
        </div>         
        <div className="App-search">
          <Search filterNames={this.filterNames} />
        </div>
        <div className="fbframe">
            <iframe title="fb_like" src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2Fverejne.digital&width=111&layout=button_count&action=like&size=small&show_faces=true&share=true&height=46&appId=" width="201" height="23" className="fbIframe" scrolling="no" frameBorder="0" allowtransparency="true" />
        </div>
        <div className="App-body">
          <Table politicians={this.state.politicians}/>        
        </div>        
      </div>
    );
  }
}

export default App;
