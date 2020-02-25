import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase'
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {


  selected = false
  highlights = [];
  counter = 0;
  countHighlight = 0;
  activatehighlight = false;
  title = "shipments"
  shipmentList = []
  keyword="";
  constructor(public navCtrl : NavController) { }

  ngOnInit() {
    this.ionViewWillEnter();
    this.readShipment();
  }
  ionViewWillEnter() {
    this.title = 'shipments'
  }
 
  multiples = false;
  clickMultiple(event) {
    console.log(event.target.value)
    if (this.multiples == false) {
      this.cancel();
    }
  }
  cancel() {
    this.highlights = [];
    this.activatehighlight = false;
    this.multiples = false;
    this.counter = 0;
    this.selected = false;
  }

  checkhighlight(i) {
    return this.highlights.indexOf(i) > -1;
  }

  highlight(i) {

    if (this.checkhighlight(i) == false) {
      this.highlights.push(i);
    } else {
      this.highlights.splice(this.highlights.indexOf(i), 1);
    }

    console.log(this.highlights)

  }

  highlight_pre(i) {

    if (this.activatehighlight == true) {
      if (this.checkhighlight(i) == false) {
        this.highlights.push(i);
        this.counter += 1;
      } else {
        this.highlights.splice(this.highlights.indexOf(i), 1);
        this.counter -= 1
      }
    }



    console.log(this.highlights)

  }
  activeHighlight(eve) {
    console.log(this.multiples)
    console.log(eve)
    // this.countHighlight +=1;
    console.log(this.countHighlight)
    if (this.multiples == true) {
      this.activatehighlight = true;
    }
    else {
      // this.activatehighlight = false;
      this.counter = 0;
      this.cancel()
    }
  }


  countSelected() {
    this.counter = 0
    this.highlights.forEach(element => {
      this.counter++;
    });
  }
  find() {

  }
  checkSelected() {
    if (this.selected == true) {
      return true
    }
    else {
      return false
    }
  }
  readShipment() {
    firebase.database().ref('Shipment').on('value', data => {
      let arr = []
      arr = []
      arr = data.val()
      for (let key in arr) {
        let obj = arr[key]
        obj.key = key
        this.shipmentList.push(obj)
      }
      console.log(this.shipmentList)
    })
  }
  toShipmentDetails(x) {
    console.log(x)
    if(this.activatehighlight == false)
    {
      this.navCtrl.navigateForward('shipmentdetails/'+ x)
    }
 
  }

}
