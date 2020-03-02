import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase'
import { timingSafeEqual } from 'crypto';
import { element } from 'protractor';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  constructor(public nav: NavController, public ar: ActivatedRoute, public alertController: AlertController) { }

  key;
  bID;
  ship = []
  vship = {}
  ngOnInit() {
    this.key = this.ar.snapshot.paramMap.get("key")
    this.bID = this.ar.snapshot.paramMap.get("bID")

    firebase.database().ref("Shipment/" + this.key + "/inventory/" + this.bID).on('value', data => {
      if (data.val()) {
        this.ship = [];
        this.vship = data.val()
        for (let key in this.vship) {
          let obj = this.vship[key];
          obj.key = key
          console.log(this.vship[key])
          this.ship.push(obj)
        } console.log(this.ship)
      }
    })


    this.read()
    this.readStatus()
    this.readStock()
   this.readReport()

  }

  title = "report"
  ionViewWillEnter() {
    this.title = 'report'
  }

  selected = 'stock'

  segmentChanged(event) {
    this.selected = event.target.value
    console.log(event.target.value)
  }

  bdo() {
    this.nav.navigateBack("branchdo/" + this.key + "/" + this.bID)
  }
  close() {
    firebase.auth().signOut().then(() => {
      this.nav.navigateRoot("adminlogin")
    })
  }

  sID;
  read() {
    firebase.database().ref("Shipment/" + this.key).on('value', data => {
      this.sID = data.val().shipID
      console.log(data.val())
    })
  }
  stat;
  readStatus() {
    firebase.database().ref("Shipment/" + this.key + "/DOS/" + this.bID + "/status").on('value', data => {
      this.stat = data.val()
      console.log(data.val())
    })
  }
  stock = [];
  readStock() {
    firebase.database().ref("Shipment/" + this.key + "/inventory/" + this.bID).on('value', data => {
      let arr = []
      arr = data.val()
      this.stock = []
      console.log(arr)
      for (let key in arr) {
        if (!(arr[key].cartoncount)) {
          arr[key].cartoncount = 0
        }
        console.log(arr[key].cartoncount)
        console.log(this.stock)
        this.stock.push(arr[key])
      }
      this.checkComplete(this.cartonplus(),this.cartoncountplus());
 

    })
  }  
  rep=[];
  repo={};

  highlighter(item){

    if(item.highlight==true){
      item.highlight=false;
    }else{
      item.highlight=true;
    }

  }

  readReport() {
    firebase.database().ref("Shipment/"+ this.key + "/Reports/" + this.bID).on('value',data=>{
     if (data.val()) {
      this.rep = [];
      this.repo = data.val()
      for (let key in this.repo) {
        let obj = this.repo[key];
        obj.key = key
        console.log(this.repo[key])
        this.rep.push(obj)
      } console.log(this.rep)
    }
    })
  }
  
  comparecarton(x, y) {

    if (x == null) {
      x = 0
    }
    if (x > y) {
      return 0
    } else if (x < y) {
      return 1
    } else if (x == y) {
      return 2
    } else {
      return 3
    }

  }
  totalcarton;
  totalcartoncount;


  cartonplus() {
    let counter = 0
    this.stock.forEach(element => {
      counter += element.carton
    });

    return counter
  }
  cartoncountplus() {
    let counter = 0
    this.stock.forEach(element => {
      counter += element.cartoncount
    });

    return counter
  }

  keyword = ""
  search(x) {
    let holder = []
    holder = []
    x.forEach(element => {
      if ((element.barcode).includes(this.keyword.toUpperCase())) {
        holder.push(element)
      }
    });
    return holder
  }
  percen;
  percentcolor
  countpercen(got,stock) {

    if(got/stock<=1/3){

      document.getElementById('colorchange').style.color='rgba(255,'+(Math.floor(got/stock*255/(1/3))).toString()+',0,1)'
    }else if(got/stock<=2/3 && got/stock>1/3){

      

      document.getElementById('colorchange').style.color='rgba('+(255 - Math.floor((got/stock)-1/3)*255/(1/3)).toString()+',255,0,1)'
    }else if(got/stock<=3/3 && got/stock>2/3){

      document.getElementById('colorchange').style.color='rgba(0,255,'+ (Math.floor(((got/stock) - 2/3 )*255/(1/3))).toString() +',1)'
    }else{

      document.getElementById('colorchange').style.color='red';
    }

   

    return Math.floor(got/stock * 100);
    
  }
  checkComplete(x,y) {
    if (x == y) {
      console.log(x,y)
      firebase.database().ref("Shipment/" + this.key + "/DOS/" + this.bID + "/").update({ status: "Completed" })
    } else if (y = 0 && (y < x ||y >x)) {
      console.log(x,y)
      firebase.database().ref("Shipment/" + this.key + "/DOS/" + this.bID + "/").update({ status: "Incomplete" })
    } else {
      console.log(x,y)
      firebase.database().ref("Shipment/" + this.key + "/DOS/" + this.bID + "/").update({ status: "Pending" })
    }
  }
  confirmSelection = false;
  async presentAlertConfirm(carton, barcode) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.confirmSelection = false
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.addcarton(carton, barcode)
          }
        }
      ]
    });

    await alert.present();
  }

  async minusCartonConfirm(carton, barcode) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.confirmSelection = false
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.minuscarton(carton, barcode)
          }
        }
      ]
    });

    await alert.present();
  }

  addcartoncount(cartoncount, barcode) {
    firebase.database().ref('Shipment/' + this.key + '/inventory/' + this.bID + '/' + barcode + '/cartoncount').transaction((res) => {
      if (res != undefined) {
        return cartoncount + 1
      } else {
        return cartoncount = 1

      }
    })
  }
  addcarton(carton, barcode) {
    firebase.database().ref('Shipment/' + this.key + '/inventory/' + this.bID + '/' + barcode + '/carton').transaction((res) => {
      if (res != undefined) {
        return carton + 1
      } else {
        return carton = 1

      }
    })
  }
  minuscartoncount(cartoncount, barcode) {
    firebase.database().ref('Shipment/' + this.key + '/inventory/' + this.bID + '/' + barcode + '/cartoncount').transaction((res) => {
      if (res != undefined) {
        if (cartoncount != 0) {
          return cartoncount - 1
        }

      } else {
        return cartoncount = 1
      }
    })
  }
  minuscarton(carton, barcode) {
    firebase.database().ref('Shipment/' + this.key + '/inventory/' + this.bID + '/' + barcode + '/carton').transaction((res) => {
      if (res != undefined) {
        if (carton != 0) {
          return carton - 1
        }

      } else {
        return carton = 1
      }

    })
  }


}

