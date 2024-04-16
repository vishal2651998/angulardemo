import { Component, EventEmitter, OnInit, Output, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-user-grid-info',
  templateUrl: './user-grid-info.component.html',
  styleUrls: ['./user-grid-info.component.scss']
})
export class UserGridInfoComponent implements OnInit {

  @Input() userInfoData: any = [];
  @Output() updateEvent = new EventEmitter<Object>();
  public sconfig: PerfectScrollbarConfigInterface = {};
  public userDivWidth: number;
  isChildClick: boolean = false;

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setWidth();
  }

  constructor(
    private router:Router
  ) { }


  ngOnInit(): void {

    console.log(this.userInfoData);
    setTimeout(() => {
      this.setWidth();
    }, 1);
  }

  setWidth(){
    var elmnt = document.getElementById("loc-head-row");
    let itemLimitwidth = 0;
    itemLimitwidth = elmnt.offsetWidth - 10;
    this.userDivWidth = itemLimitwidth;
  }

  navigateToProfile(id:string){
    if(this.isChildClick){
      this.isChildClick = false;
    }else{
      this.router.navigate(["headquarters/user/" + id])
    }
  }

  updateUser(id, actiontype, actionFormType, item, titletext) {
    this.isChildClick = true
    setTimeout(() => {
      this.isChildClick = false;
    }, 500);
    let data = {
      id : id, 
      actiontype : actiontype, 
      actionFormType : actionFormType, 
      item : item, 
      titletext: titletext
    }
    this.updateEvent.emit({data});
  }

  navigateToUsers(id){
    this.router.navigate(["headquarters/all-users"],{queryParams:{hqId:id}})
  }
 

}
