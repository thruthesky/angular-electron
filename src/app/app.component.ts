import { Component } from '@angular/core';
import { ipcRenderer } from 'electron';
import * as childProcess from 'child_process';

import * as fs from 'fs';
import * as yaml from 'js-yaml';

const separator = "\n# -----------------\n";
const data_yml = "./data.yaml.txt";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  data = {
    config: {},
    search: {},
    user: ''
  };
  
  constructor() {
    // Check if electron is correctly injected (see externals in webpack.config.js)
    console.log('c', ipcRenderer);
    // Check if nodeJs childProcess is correctly injected (see externals in webpack.config.js)
    console.log('c', childProcess);
    var str  = '';
    try {
      str = fs.readFileSync('./data.yaml').toString();
      console.log("str: ", str);
    } catch ( e ) {
    }
    console.log(str);
    // Get document, or throw exception on error
    if ( str ) {
      try {  
      var arr  = str.split( separator );
          this.data['config'] = yaml.load( arr[1] );
          this.data['search'] = yaml.load( arr[2] );
          this.data['user'] = arr[3];
      } catch (e) {
          console.log(e);
      }
    }

    console.log("data: ", this.data);
    
        // default values
      if ( this.data.config['browser'] === void 0 ) this.data.config['browser'] = 'n';
      if ( this.data.config['ip_change'] === void 0 )   this.data.config['ip_change'] = 'n';
      if ( this.data.config['visit_naver_main'] === void 0 )   this.data.config['visit_naver_main'] = 'n';
      if ( this.data.config['click_pause'] === void 0 )   this.data.config['click_pause'] = '1';
      if ( this.data.config['show_devtool'] === void 0 )   this.data.config['show_devtool'] = 'n';
      if ( this.data.config['visit_scroll'] === void 0 )   this.data.config['visit_scroll'] = 'n';
      if ( this.data.search['keyword'] === void 0 )   this.data.search['keyword'] = '';
      if ( this.data.search['vote'] === void 0 )   this.data.search['vote'] = 'y';
      if ( this.data.search['document_url'] === void 0 )   this.data.search['document_url'] = '';
      if ( this.data.user === void 0 )   this.data.user = '';
        
        console.log( 'Naver vote data:', this.data);
  }

  onClickSave() {
    let config = separator + Object.keys(this.data.config).reduce( ( total, k ) =>  total + "\n" + k + ': ' + this.data.config[k] , '' );
    let search = separator + Object.keys(this.data.search).reduce( ( total, k ) =>  total + "\n" + k + ': ' + this.data.search[k] , '' );
    let user = separator + this.data.user; // Object.keys(this.data.user).reduce( ( total, k ) =>  total + "\n" + k + ': ' + this.data.user[k] , '' );
    
    let data = config + search + user;

    console.log("data: ", data);
    fs.writeFileSync( data_yml, data );

  }
}
