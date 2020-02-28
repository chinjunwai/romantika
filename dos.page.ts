import { Component, OnInit } from '@angular/core';
import { database } from 'firebase';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase'

@Component({
  selector: 'app-dos',
  templateUrl: './dos.page.html',
  styleUrls: ['./dos.page.scss'],
})
export class DosPage implements OnInit {

  constructor(public nav : NavController) { }

  title="dos"
  Branch={};
  keyword="";
  Shipment={};

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  countship(branch_id){

    let holderreturn = {};

    for (const key in this.Shipment) {
        this.obj2arr(this.Shipment[key].inventory[branch_id]).forEach(element => {
          if(parseInt(element.carton)>0){
            holderreturn[key]=true;
            // console.log(holderreturn);
          }
        });

    }

    return Object.keys(holderreturn).length;

  }

  obj2arr(obj){
    let holder = [];

    for (const key in obj) {
      let ok = obj[key];
      ok.key = key;
      holder.push(ok);
    }

    return holder;
  }

  ngOnInit() {

    database().ref('Branch').on('value',data=>{
      this.Branch=data.val();
    })

    database().ref('Shipment').on('value',data=>{
      this.Shipment=data.val();
    })

    firebase.auth().onAuthStateChanged((login)=>{
      if(login){
        firebase.database().ref('Admin/'+ firebase.auth().currentUser.uid).once('value', data=>{
          if (data.val()){
            this.nav.navigateRoot("dos")
          }else{
            firebase.auth().signOut()
          }
        })
      }
    })

    this.ionViewWillEnter();
  }
  ionViewWillEnter() {
    this.title = 'dos'
  }

  close() {
    firebase.auth().signOut().then(()=>{
        this.nav.navigateRoot("adminlogin")
    })
  
  }
  bdo(eve){
    console.log(eve)
    this.nav.navigateForward("branchdo/"+ eve.key + "/" + eve.bID)
  }
  search(branch_id){
    let holder = []
    holder = []
    branch_id.forEach(element => {
      if((element.bID).includes(this.keyword.toUpperCase())){
        holder.push(element)
      }
    });
    return holder
  }
}
