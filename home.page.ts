import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  shipments=['x','y','z']

  highlights=[];
  counter = 0;
  countHighlight=0;
  activatehighlight=false;
  ngOnInit(){

  }
  cancel(){
    this.highlights=[];
    this.activatehighlight=false;
  }

  checkhighlight(i){
    return this.highlights.indexOf(i)>-1;
  }

  highlight(i){

    if(this.checkhighlight(i)==false){
      this.highlights.push(i);
    }else{
      this.highlights.splice(this.highlights.indexOf(i),1);
    }

    console.log(this.highlights)

  }

  highlight_pre(i){

    if(this.activatehighlight==true){
      if(this.checkhighlight(i)==false){
        this.highlights.push(i);
        this.counter +=1;
      }else{
        this.highlights.splice(this.highlights.indexOf(i),1);
        this.counter -=1
      }
    }

    

    console.log(this.highlights)

  }
  activeHighlight(){
    this.countHighlight +=1;
    console.log(this.countHighlight)
    if(this.countHighlight % 2 != 0){
      this.activatehighlight = true;
    }
    else{
      this.activatehighlight = false;
      this.counter = 0
    }
  }

  constructor() {}
  onPress($event) {
    console.log("onPress", $event);
}
  onPressUp($event) {
  console.log("onPressUp", $event);
}
  countSelected(){
    this.counter = 0
    this.highlights.forEach(element => {
      this.counter++;    
    });
  }
}
