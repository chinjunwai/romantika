import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase'
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-branchdo',
  templateUrl: './branchdo.page.html',
  styleUrls: ['./branchdo.page.scss'],
})
export class BranchdoPage implements OnInit {

  constructor(public nav: NavController, public route: ActivatedRoute) { }
  title = "branchdo"

  bID;
  key;
  view = {}
  vdo = {};
  keyword = "";

  obj2arr(x){
    let holder= [];
    for (const key in x) {
  holder.push(x[key]);
  // console.log(x)
    }
    return holder;
  }
  ngOnInit() {
    this.key = this.route.snapshot.paramMap.get("key")
    this.bID = this.route.snapshot.paramMap.get("bID")
    
    firebase.database().ref("Shipment/").on('value', data => {
      if (data.val()) {

        data.forEach(element => {

          console.log(element.key);

          this.view[element.key]={
            DOid:element.val().DOS[this.bID].DOid,
            shipment_id:element.key,
            carton:0,
            status:element.val().DOS[this.bID].status || "Pending",
          }

          for (const key in element.val().inventory[this.bID]) {

            this.view[element.key].carton+=element.val().inventory[this.bID][key].carton;

          }
          
        });

      }
    })
    console.log(this.view)

  }
  

  ionViewWillEnter() {
    this.title = 'branchdo'
  }

  close() {
    firebase.auth().signOut().then(() => {
      this.nav.navigateRoot("adminlogin")
    })
  }

  dos() {
    this.nav.navigateBack("dos")
  }

  rep(x){
    console.log(x)
    this.nav.navigateForward("report/"+x.shipment_id+ "/" + this.bID)
  }
  search(x){
    let holder = []
    holder = []
    x.forEach(element => {
      if((element.DOid).includes(this.keyword)){
        holder.push(element)
      }
    });
    return holder
  }
}
