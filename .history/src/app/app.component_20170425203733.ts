import { Component } from '@angular/core';
import { ipcRenderer } from 'electron';
import * as childProcess from 'child_process';

import * as fs from 'fs';
import * as yaml from 'js-yaml';

const separator = "\n# -----------------\n";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  data = {
    config: {},
    search: {},
    user: {}
  };
  
  constructor() {
    // Check if electron is correctly injected (see externals in webpack.config.js)
    console.log('c', ipcRenderer);
    // Check if nodeJs childProcess is correctly injected (see externals in webpack.config.js)
    console.log('c', childProcess);
    var str  = fs.readFileSync('./data.yaml').toString();
    console.log(str);
    var arr  = str.split( separator );
    // Get document, or throw exception on error
    try {
        this.data['config'] = yaml.load( arr[1] );
        this.data['search'] = yaml.load( arr[2] );
        this.data['user'] = arr[3];
        console.log( 'Naver vote data:', this.data);

        // default values

        this.data.config['browser'] = 'n';
        this.data.config['ip_change'] = 'n';
        this.data.config['visit_naver_main'] = 'n';
        this.data.config['click_pause'] = '1';
        this.data.config['show_devtool'] = 'n';
        this.data.config['visit_scroll'] = 'n';
        this.data.search['keyword'] = '';
        this.data.config['vote'] = 'y';
        this.data.config['document_url'] = '';
        this.data.config['user'] = '';
        
    } catch (e) {
        console.log(e);
    }
  }

  onClickSave() {
    let config = separator + Object.keys(this.data.config).reduce( ( total, k ) =>  total + "\n" + k + ': ' + this.data.config[k] , '' );
    let search = separator + Object.keys(this.data.search).reduce( ( total, k ) =>  total + "\n" + k + ': ' + this.data.search[k] , '' );
    let user = separator + this.data.user; // Object.keys(this.data.user).reduce( ( total, k ) =>  total + "\n" + k + ': ' + this.data.user[k] , '' );
    
    let data = config + search + user;

    console.log("data: ", data);
    fs.writeFileSync( "./data.yaml", data );

  }
}
