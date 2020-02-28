import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase'
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('uploadEl', { static: false }) uploadElRef: ElementRef;

  constructor(public nav: NavController, private http: HttpClient,
    private papa: Papa,
    private plt: Platform,
    private file: File) { }

  ship = { conID: "", OrderDate: "", ETA: "", DueDate: "", inventory: {},shipID:""};

  close() {
    firebase.auth().signOut().then(()=>{
        this.nav.navigateRoot("adminlogin")
    })
  
  }

  readExistingData() {
    let existed = false
    firebase.database().ref('Shipment/').once('value', data => {

      data.forEach(element => {
        if (element.val().shipID == this.ship.shipID) {
          console.log('hello')
          alert("Shipment ID already exist")
          existed = true;
        }

      })
    }).then(() => {

        if (existed == false) {

          firebase.database().ref('Notifications').push({
            date:firebase.database.ServerValue.TIMESTAMP,
            title:'New Shipment Yay!',
            msg:'Admin has uploaded a shipment ('+this.ship.shipID+').'
          })

          console.log(this.ship)
          firebase.database().ref("Shipment/").push(this.ship).then(() => {

            this.ship.conID = null
            this.ship.OrderDate = null
            this.ship.ETA = null
            this.ship.DueDate = null
            this.ship.shipID=null
          })
        }
        this.ship.shipID=""
      })
    }

    

  upload() {

    if (this.ship.shipID == "" || this.ship.OrderDate == "" || this.ship.ETA == "" || this.ship.DueDate == ""||this.ship.conID=="") {
      alert("Please fill in the blank !!")
    }
    else if ( this.ship.shipID !==null) {
      console.log(this.ship.shipID)
      this.readExistingData()
      
    }
    this.table=[];
  }

  table = [];
  holder_name = {};
  end_array=[];

  spliter(texter){
    if(texter.includes(" ")==true){
        return texter.split(' ')[0]
      }else{
        return texter;
      }
 
  }

  changeListener(res: any): void {
    let csvData = res.target.files[0] || res.srcElement;
    this.uploadElRef.nativeElement.value = ''
    this.papa.parse(csvData, {
      complete: parsedData => {

        console.log(parsedData.data.splice(0, 3)[0])
        console.log(parsedData.data);
        this.table = parsedData.data;
        this.holder_name = {};

        for (let i = 3; i < parsedData.data[0].length - 3; i++) {
          this.holder_name[parsedData.data[0][i]] = {};
          if( (parsedData.data[0][i]).toLowerCase() =="total" ){
            this.end_array.push(i);
          }
        }
        this.ship['DOS']={};
        for( let i = 1; i <  parsedData.data.length ; i++ ){

          if(parseInt(parsedData.data[i][0])>0){
            for( let j = 8; j < this.end_array[this.end_array.length-1]; j++ ){
              
              if(this.holder_name[parsedData.data[0][j]][this.spliter(parsedData.data[i][2])]){
                this.holder_name[parsedData.data[0][j]][this.spliter(parsedData.data[i][2])].carton+=Math.ceil(parsedData.data[i][j] / parsedData.data[i][4]) || 0;
                console.log(this.holder_name[parsedData.data[0][j]][this.spliter(parsedData.data[i][2])].desc)+' got duplicate and add '+this.holder_name[parsedData.data[0][j]][this.spliter(parsedData.data[i][2])].carton;
              }else{
                this.holder_name[parsedData.data[0][j]][this.spliter(parsedData.data[i][2])]=({
                  desc:parsedData.data[i][1] || "",
                  barcode:this.spliter(parsedData.data[i][2]) || "",
                  carton:Math.ceil(parsedData.data[i][j] / parsedData.data[i][4]) || 0,
                  pcsCarton:parsedData.data[i][4] || 0,
                  branch:parsedData.data[0][j] || 0,
                  
                })
              }

              this.ship['DOS'][parsedData.data[0][j]] = {status:'Pending',DOid:parsedData.data[26][j]}
            }
          }
         }
         console.log(this.holder_name);
         for (const key in this.holder_name) {
          
          if(Object.keys(this.holder_name[key]).length==0 || (key).toLowerCase() =="total"){
            delete this.holder_name[key];
          }
         }
         this.ship.inventory=(this.holder_name)
         console.log(this.ship)
         console.log(this.holder_name);
         
          let holder = [];
          for (let x = 0; x < (parsedData.data).length - 1; x++) {
            // console.log(holder);
          }
      }
    })
  }
}
