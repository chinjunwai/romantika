import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase'
@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {

  constructor(public navCtrl : NavController) { }
  title
ionViewWillEnter(){
  this.title = "notification"
}
  ngOnInit() {
    this.readMessage()
  }
  toBranch(){
    this.navCtrl.navigateForward('branch')
  }
  toshipment() {
    this.navCtrl.navigateForward("home")
  }
  messagelist = []
  readMessage(){
    firebase.database().ref('Notifications/').on('value',data=>{
      let arr  = []
      this.messagelist = []
      arr = data.val()
      for (let key in arr) {
        let obj = arr[key]
        this.messagelist.push(obj)
      }
      this.messagelist.sort((a, b) => (new Date(a.ETA).getTime() < (new Date(b.ETA).getTime()) ? 1 : -1));

    })
  }
  todos(){
    this.navCtrl.navigateForward('dos')
  }
  close() {
    firebase.auth().signOut().then(()=>{
        this.navCtrl.navigateRoot("adminlogin")
    })
  
  }

 
}
