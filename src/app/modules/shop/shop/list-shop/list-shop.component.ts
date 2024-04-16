import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Table } from 'exceljs';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-list-shop',
  templateUrl: './list-shop.component.html',
  styleUrls: ['./list-shop.component.scss']
})
export class ListShopComponent implements OnInit, OnChanges {

  @Input("shopList") shopList:any = [];
  @Input("hqDetails") hqDetails:any = [];
  @ViewChild("table", { static: false }) table: Table;
  @Output() viewShop = new EventEmitter<any>();
  @Output() viewUsers = new EventEmitter<any>();
  @Output() editShop = new EventEmitter<any>();
  @Output() filterApplied = new EventEmitter<any>();

  attr1:any = {}
  attr2:any = {}
  attr3:any = {}

  public tableRemoveHeight: number = 160;
  public bodyElem;
  public bodyClass: string = "parts-list";

  constructor() {    
  }

  shopListColumns = [];

  // shopList = [
  //   { parent: "testParent1", storeNo: 1, storeName: "name1", location: "location1", shopType: "shopType1", dealerCode: "dealerCode1", numberUsers: "users1", region: "region1" },
  //   { parent: "testParent2", storeNo: 2, storeName: "name2", location: "location2", shopType: "shopType2", dealerCode: "dealerCode1", numberUsers: "users2", region: "region2" },
  //   { parent: "testParent3", storeNo: 3, storeName: "name3", location: "location3", shopType: "shopType3", dealerCode: "dealerCode1", numberUsers: "users3", region: "region3" },
  // ]

  ngOnInit(): void {
  }

  ngOnChanges(): void{

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);  

    this.setScreenHeight();
    this.setAttributeValues();
    this.shopListColumns = [
      // { field: 'parentId', header: 'Parent', columnpclass: 'w1 shop-thl-col-1 col-sticky' },
      { field: 'id', header: 'Location#', columnpclass: 'w1 shop-thl-col-2 col-sticky', sortName: 'id' },
      { field: 'name', header: 'Location Name', columnpclass: 'w3 shop-thl-col-3', sortName: 'name' },
      { field: 'city', header: 'City/State', columnpclass: 'w4 shop-thl-col-4'},
      { field: 'shopTypeName', header: 'Type', columnpclass: 'w5 shop-thl-col-5'},
      { field: 'dealerCode', header: 'Location Code', columnpclass: 'w5 shop-thl-col-5', sortName: 'dealerCode' },
      { field: 'usersCount', header: 'No. of Users', columnpclass: 'w3 shop-thl-col-3'},
      { field: 'levelOneName', header: this.attr1?.name, columnpclass: 'w5 shop-thl-col-5'},
      { field: 'levelTwoName', header: this.attr2?.name, columnpclass: 'w5 shop-thl-col-5'},
      { field: 'levelThreeName', header: this.attr3?.name, columnpclass: 'w5 shop-thl-col-5'},
      { field: '', header: '', columnpclass: 'w10 shop-thl-col-10 col-sticky' },
    ];
  }

  setAttributeValues(){
    if(this.hqDetails){
      this.attr1 = this.hqDetails.attributesInfo.find(e=>e.displayOrder == 1);
      this.attr2 = this.hqDetails.attributesInfo.find(e=>e.displayOrder == 2);
      this.attr3 = this.hqDetails.attributesInfo.find(e=>e.displayOrder == 3);

      this.shopList.forEach(s => {
          let level1 = this.attr1.items.find(e=>e.id == s.levelOneId);
          let level2 = this.attr2.items.find(e=>e.id == s.levelTwoId);
          let level3 = this.attr3.items.find(e=>e.id == s.levelThreeId);

          if(level1){
            s["levelOneItem"] = level1.name;
          }
          if(level2){
            s["levelTwoItem"] = level2.name;
          }
          if(level3){
            s["levelThreeItem"] = level3.name;
          }

      });
    }
  }

  onViewShop(shop:any){
    this.viewShop.emit(shop);
  }

  onViewUsers(shop:any){
    this.viewUsers.emit(shop);
  }

  onEditShop(shop:any){
    this.editShop.emit(shop);
  }

  setScreenHeight() {
     let headerHeight1 = 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.tableRemoveHeight = headerHeight + 130;
  }

  lazyLoad(event: LazyLoadEvent) {
    this.filterApplied.emit(event);
  }

}
