import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase'
@Component({
  selector: 'app-addbranch',
  templateUrl: './addbranch.page.html',
  styleUrls: ['./addbranch.page.scss'],
})
export class AddbranchPage implements OnInit {

  constructor(public toastController: ToastController, public nav: NavController) { }
  branch = { bID: "", mail: "", pass: "", name: "", id: "" }
  ngOnInit() {
  }

  backToBranch() {
    this.nav.navigateBack('adminlogin')
  }

  existedData = []

  async presentToast(header, msg, color) {
    const toast = await this.toastController.create({
      header: header,
      message: msg,
      duration: 2000,
      color: color,
      mode: 'ios',
      position: 'top',
    });
    toast.present();
  }

  checker(obj, keyname, val) {
    let ok = false;
    for (const key in obj) {

      if (obj[key][keyname] == val) {
        ok = true;
      }

    }

    return ok;
  }

  create() {

    if (this.branch.bID == "" || this.branch.mail == "" || this.branch.pass == "" || this.branch.name == "") {
      alert("Please fill in the blank !!")

    }

    else if (this.branch.bID !== "") {

      firebase.database().ref('Branch/').once('value', data => {

        if (this.checker(data.val(), 'bID', this.branch.bID) == true) {
          this.presentToast('Exist', 'ID existed', 'danger')
          this.branch = { bID: "", mail: "", pass: "", name: "", id: "" }

        } else {
          firebase.auth().createUserWithEmailAndPassword(this.branch["mail"], this.branch["pass"]).then(() => {

            firebase.database().ref("Branch/" + firebase.auth().currentUser.uid).update({
              id: firebase.auth().currentUser.uid,
              bID: this.branch.bID,
              mail: this.branch.mail,
              pass: this.branch.pass,
              name: this.branch.name,
            })
            this.presentToast('Success', 'Successful Create', 'primary')
            this.branch.bID = null,
              this.branch.mail = null,
              this.branch.name = null,
              this.branch.pass = null
            console.log(this.branch)
          })
        }
      })
    }
  }

}