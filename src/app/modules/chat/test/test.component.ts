import { Component, OnInit } from '@angular/core';
declare var lightGallery: any;
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  headerData:object;
  sidebarActiveClass:object;
  pageAccess: string = "landingpage";
  midHeight:number;
  constructor() { }

  ngOnInit(): void {
    this.midHeight=window.innerHeight;
    this.headerData = {
      'access': this.pageAccess,
      'profile': true,
      'welcomeProfile': true,
      'search': true
    };
    this.sidebarActiveClass={
      'page': 'home',
      'menu': 'Home'
    }
    lightGallery(document.getElementById('lightgallery'))
  }
  applySearch(val) {

  }
  OpenImage(newids){
   var element = document.getElementById(newids);
   element.click();
  }
}
