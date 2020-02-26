import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase'

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.page.html',
  styleUrls: ['./adminlogin.page.scss'],
})
export class AdminloginPage implements OnInit {

  constructor(public nav:NavController, public loadingControl:LoadingController) { }

  ngOnInit() {
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
  }
admin={}
loading=false
login(){
  this.loading= true
  firebase.auth().signInWithEmailAndPassword(this.admin['admail'],this.admin['adpass']).then(()=>{
    firebase.database().ref('Admin/'+firebase.auth().currentUser.uid).once('value', data=>{
      if(data.val()){
        this.nav.navigateRoot("dos")
      }else{
        firebase.auth().signOut
      }
    })
    this.loading=false
  }).catch((e)=>{
    alert(e)
    this.loading=false
  })
}
}
