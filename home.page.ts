import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase'
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  title = ""
  constructor(public navCtrl: NavController) { }
  ngOnInit() {
    this.readShipments()
  }
  ionViewWillEnter() {
    this.title = 'Shipments'
  }

  

  sorting(array){

    let holder = [];

    array.forEach(element => {
      if((element.shipID).includes(this.keyword)){
        holder.push(element);
      }

    });
//console.log(holder[0].key)
    return holder;
  }

  keyword="";
  array = []
  shipmentList = []
  readShipments() {
    firebase.database().ref('Shipment/').on('value', data => {
      this.array = []
      this.shipmentList = []
      let array = data.val()
      for (let key in array) {
        
        let obj = array[key]
        obj.key = key
        console.log(obj.key)
        this.shipmentList.push(obj)
        console.log(this.shipmentList)
      } 
    })
  }
  toBranch() {
    this.title = "Branch"
    this.navCtrl.navigateForward('branch')
  }
  addshipment(){
    this.navCtrl.navigateForward('addshipment')
  }
  toShipmentDetail(x){
    console.log(x)
    this.navCtrl.navigateForward('shipmentdetails/' + x)
  }
  toDispatch(){
    this.navCtrl.navigateForward('dispatch')
  }
  toReport(){
    this.title = "Report"
    this.navCtrl.navigateForward('report')
  }
}
