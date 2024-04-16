import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductMatrixService } from '../../../services/product-matrix/product-matrix.service';

@Component({
  selector: 'app-product-make',
  templateUrl: './product-make.component.html',
  styleUrls: ['./product-make.component.scss']
})
export class ProductMakeComponent implements OnInit {

  @Input() makeList: any;
  @Input() workstreams: any;
  @Input() apiData: any;
  @Input() height: number;
  @Output() confirmAction: EventEmitter<any> = new EventEmitter();

  public bodyElem;
  public bodyClass:string = "product-make-list";
  public makeTxt: string = "Make";
  public wsTxt: string = "Workstream Access";
  public addMakeTxt: string = "New";
  public addMakeOnTxt: string = "";
  public workstreamName: string = "All";
  public makeVal: string = "";
  public checkedBox:boolean=true;
  public makeItems = [];
  public filteredWorkstreams = [];
  public selectedWorkstreamLists = [];
  public newWorkstreams = [];
  public deletedWorkstreams = [];
  public makeActionFlag: boolean = false;
  public submitActionFlag: boolean = false;
  public makeFlag: any = null;
  public itemAction: string = "";
  public successMsg: string = "";
  public makeSuccess: boolean = false;
  public makeLoading: boolean = true;
  public makeEmpty: boolean = false;
  public makeSearchNew: boolean = false;
  public makeTotal: number;

  public searchVal: string = '';
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted:boolean = false;

  // convenience getter for easy access to form fields
  get f() { return this.searchForm.controls; }

  constructor(
    public activeModal: NgbActiveModal,
    private ProductMatrixApi: ProductMatrixService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.searchForm = this.formBuilder.group({
      searchKey: [this.searchVal, [Validators.required]],
    });
    this.makeTotal = this.makeList.length;
    console.log(this.makeTotal)
    this.initMakeList('init', this.makeList);
  }

  // Initiate Make List
  initMakeList(action, makeList) {
    this.makeItems = [];
    this.addMakeOnTxt = "TURN ON"; 
    for(let m in makeList) {
      this.makeItems.push(makeList[m].makeName);
      let wsList = makeList[m].workstreamList;
      let wsName = (wsList.length > 0 && wsList.length < 2) ? wsList[0].name : 'None';
      if(wsList.length > 1) {
        wsName = (wsList.length > 1) ? 'Multiple' : wsList[0].name;
      }
      // TURN ON / TURN OFF      
      if(makeList[m].isActiveMake){
        this.addMakeOnTxt = "TURN OFF";  
      }      

      makeList[m]['action'] = "";
      makeList[m]['makeExists'] = false;
      makeList[m]['activeMore'] = false;
      makeList[m]['actionFlag'] = false;
      makeList[m]['wsName'] = wsName;
      makeList[m]['checkedBox'] = makeList[m].isActiveMake;
    }
    setTimeout(() => {
      this.makeLoading = false;      
    }, 500);
  }

  onToggleBoxChange(id,index,val, optIndex,wsName) {
    val = (val == undefined || val == 'undefined') ? '' : val;
    this.submitActionFlag=true;
    this.manageMake('submit', index,val,'toggle');

  }
  manageMakeToggle() {    
    this.submitActionFlag=true;
    this.manageMake('alltoggle', '','','alltoggle');
  }

  // Add, Edit, Cancel Make
  manageMake(action, index,checkedBoxVal='',type='') {
    switch(action) {
      case 'new':
        if(this.makeEmpty) {
          this.makeSearchNew = true;
          this.clearSearch();
          return false;
        }
        if(!this.makeActionFlag) {
          let timeOut = 0;
          this.makeSearchNew = false;
          //setTimeout(() => {
            this.itemAction = action;
            this.filteredWorkstreams = [];
            this.selectedWorkstreamLists = [];
            this.deletedWorkstreams = [];
            this.makeActionFlag = true;
            this.submitActionFlag = false;
            this.makeVal = "";
            let newMake = {
              id: 0,
              makeName: '',
              workstreamName: [],
              isPredefined: 0,
              action: action,
              activeMore: false,
              actionFlag: false
            };
            this.makeList.unshift(newMake);
            let el = document.getElementById('makeTable');
            el.scrollTo(0,0);
          //}, timeOut);
        }
        break;
      case 'edit':
        this.itemAction = action;
        this.makeActionFlag = true;
        //this.submitActionFlag = (this.filteredWorkstreams.length == 0) ? false : true;
        this.submitActionFlag = true;
        this.makeVal = this.makeList[index].makeName;
        this.makeList[index].action = action;
        this.filteredWorkstreams = [];
        this.selectedWorkstreamLists = [];
        this.deletedWorkstreams = [];
        let rmIndex = 0;
        if(this.makeList[rmIndex].action == 'new') {
          index = index-1;
          this.makeList.splice(rmIndex, 1);
        }
        
        for(let ws of this.makeList[index].workstreamList) {
          this.filteredWorkstreams.push(ws.id);
          this.selectedWorkstreamLists.push(ws.id);
        }

        for(let m in this.makeList) {
          this.makeList[m].action = (index != m) ? '' : 'edit';
        }
        break;
      case 'cancel':
        this.makeVal = "";
        this.filteredWorkstreams = [];
        this.selectedWorkstreamLists = [];
        this.deletedWorkstreams = [];
        this.makeActionFlag = false;
        this.submitActionFlag = false;
        if(this.makeList[index].action == 'new') {
          this.makeList.splice(index, 1);
        } else {
          this.makeList[index].action = "";
          this.makeList[index].activeMore = false;
        }
        break;
      case 'submit':
        if(this.submitActionFlag) {
          let id = this.makeList[index].id;
          if(id == 0) {
            this.newWorkstreams = this.filteredWorkstreams;
          } else {
            /*console.log('Filtered: '+this.filteredWorkstreams)
            console.log('Selected: '+this.selectedWorkstreamLists)
            console.log('New: '+this.newWorkstreams)
            console.log('Delete: '+this.deletedWorkstreams)
            console.log(id)*/
            if(this.newWorkstreams.length > 0) {
              let chkItems = [];
              for(let fi of this.filteredWorkstreams) {
                if(!this.newWorkstreams.some(n => n == fi)) {
                  chkItems.push(fi);
                }
              }
            
              for(let ri of this.selectedWorkstreamLists) {
                if(!chkItems.some(r => r == ri)) {
                  this.deletedWorkstreams.push(ri);
                }
              }
            } else {
              for(let fi of this.filteredWorkstreams) {
                if(!this.selectedWorkstreamLists.some(s => s == fi)) {
                  this.newWorkstreams.push(fi);
                }
              }

              for(let ri of this.selectedWorkstreamLists) {
                if(!this.filteredWorkstreams.some(r => r == ri)) {
                  this.deletedWorkstreams.push(ri);
                }
              }
            }
          }

          setTimeout(() => {
            let apiData = {
              'apiKey': this.apiData['apiKey'],
              'userId': this.apiData['userId'],
              'domainId': this.apiData['domainId'],
              'countryId': this.apiData['countryId'],
              'MakeName': this.makeVal,
              'newworkstreams': JSON.stringify(this.newWorkstreams),
              'deletedWorkstreams': JSON.stringify(this.deletedWorkstreams)
            };

            if(id > 0) {
              apiData['makeId'] = id;
            }
            this.makeAction(index, apiData,checkedBoxVal,type);       
          }, 100);
        }
        break; 
      case 'alltoggle':
        setTimeout(() => {
          let apiData = {
            'apiKey': this.apiData['apiKey'],
            'userId': this.apiData['userId'],
            'domainId': this.apiData['domainId'],
            'countryId': this.apiData['countryId']
          };
          this.makeAction('', apiData,'',type);       
        }, 100);        
        break;  
    }
  }

  // On Change
  onChange(index, value) {
    if(value.length > 0) {
      this.checkMakeExists(index, value);
    } else {
      if(this.makeFlag){
        this.makeFlag.unsubscribe();
      }
      this.makeVal = "";
      this.makeList[index].makeExists = false;
      this.submitActionFlag = false;
    }
  }

  // Check Model Exists
  checkMakeExists(index, value) {
    let apiData = {
      'apiKey': this.apiData['apiKey'],
      'userId': this.apiData['userId'],
      'domainId': this.apiData['domainId'],
      'countryId': this.apiData['countryId'],
      'makeName': value
    };
    
    if(this.makeFlag){
      this.makeFlag.unsubscribe();
      this.getMakeData(index, apiData);
    } else {
      this.getMakeData(index, apiData);      
    }
  }

  // Get Product Make Exists
  getMakeData(index, apiData) {
    let matrixData = new FormData();
    matrixData.append('apiKey', apiData.apiKey);
    matrixData.append('userId', apiData.userId);
    matrixData.append('domainId', apiData.domainId);
    matrixData.append('countryId', apiData.countryId);
    matrixData.append('makeName', apiData.makeName);
    if(this.makeList[index].action == 'edit') {
      let id:any = this.makeList[index].id;
      matrixData.append('makeId', id);
    }
    this.makeFlag = this.ProductMatrixApi.checkModelExists(matrixData).subscribe((response) => {
      this.makeList[index].makeExists = (response.status == 'Success') ? false : true;
      if(!this.makeList[index].makeExists) {
        this.makeVal = apiData.makeName;
        //this.submitActionFlag = (this.makeVal !='' && this.filteredWorkstreams.length > 0) ? true : false;
        this.submitActionFlag = (this.makeVal !='') ? true : false;
      } else {
        this.submitActionFlag = false;
      }
    });
  }

  // Make Submit Action
  makeAction(index, makeApiData,checkedBoxVal,type='') {
    let makeIndex = 0;
    let makeData = new FormData();
    makeData.append('apiKey', makeApiData.apiKey);
    makeData.append('userId', makeApiData.userId);
    makeData.append('domainId', makeApiData.domainId);
    makeData.append('countryId', makeApiData.countryId);   
    if(type != 'alltoggle'){
      makeData.append('MakeName', makeApiData.MakeName);
      makeData.append('newworkstreams', makeApiData.newworkstreams);
      makeData.append('deletedWorkstreams', makeApiData.deletedWorkstreams);
      makeData.append('isAddmodel', checkedBoxVal);
    }
    else{
      let Saveproductmake = '';
     
      if(this.addMakeOnTxt == "TURN OFF"){  
        Saveproductmake = '1'; 
      }
      else{ 
        Saveproductmake = '2';
      }      
      makeData.append('turnOff', Saveproductmake);
    }    
    if(makeApiData.makeId > 0) {
      makeIndex = makeApiData.makeId;
      makeData.append('makeId', makeApiData.makeId);
    }
    //new Response(makeData).text().then(console.log)
    //return false;
    this.ProductMatrixApi.manageMake(makeData).subscribe((response) => {
      this.searchVal = '';
      this.makeSuccess = true;
      this.successMsg = response.result;
      setTimeout(() => {
        this.makeSuccess = false;
        this.makeActionFlag = false;
      }, 3000);
      let actionFlag = (response.status == 'Success') ? true : false;
      if(type != 'toggle'){
        this.getMakeList(index); 
      }  
      // TURN ON / TURN OFF
      if(type == 'toggle'){
        this.addMakeOnTxt = "TURN ON"; 
        for(let m in this.makeList) {
          if(this.makeList[m].isActiveMake){
            this.addMakeOnTxt = "TURN OFF";  
          }
        } 
      }     
      
      let data = {
        flag: true,
        action: 'edit'
      };
      this.confirmAction.emit(data);             
    });
  }

  // Get Make Lists
  getMakeList(index) {
    this.makeLoading = true;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('searchKey', this.searchVal);
    apiFormData.append('fromProductMatrix', '1');

    this.ProductMatrixApi.fetchProductMakeLists(apiFormData).subscribe((response) => {
      if(response.status == "Success") {
        let resultData = response.modelData;
        this.makeList = [];
        this.makeList = resultData;
        this.initMakeList('get', this.makeList);
        if(index < 0) {
          let makeListLen = this.makeList.length;
          this.makeEmpty = (makeListLen < 1) ? true : false;
          if(this.makeEmpty) {
            this.successMsg = response.result;
          }
        }
        
        if(index > 0) {
          let data = {
            flag: true,
            action: 'edit'
          };
          this.confirmAction.emit(data);
        }
        
        if(this.makeSearchNew) {
          this.manageMake('new', 0);
        }
      }
    });
  }

  // Filtered Workstreams
  selectedWorkstreams(list) {
    let items = list.items;
    this.newWorkstreams = [];
    this.deletedWorkstreams = [];
    this.filteredWorkstreams = items;
    //this.submitActionFlag = (this.makeVal != '' && items.length > 0) ? true : false;
    if(this.itemAction == 'edit') {
      for(let i of items) {
        if(!this.selectedWorkstreamLists.some(x => x == i)) {
          this.newWorkstreams.push(i);
        }
      }
    }
  }

  // Modal Close
  close() {
    this.searchVal = '';
    this.bodyElem.classList.remove(this.bodyClass);
    this.activeModal.dismiss('Cross click');
    let data = {
      flag: true,
      action: 'close'
    };
    this.confirmAction.emit(data);
  }
  
  // On Submit
  onSubmit() {
    this.submitted = true;
    if (this.searchForm.invalid) {  
      return;
    } else {
      this.searchVal = this.searchForm.value.searchKey;
      this.submitSearch();
    }
  }

  // Search Onchange
  onSearchChange(searchValue : string ) {  
    this.searchForm.value.searchKey = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
    if(searchValue.length == 0) {
      this.submitted = false;
      if(this.makeTotal != this.makeList.length) {
        this.clearSearch();
      }      
    }
  }

  // Submit Search
  submitSearch() {
    this.getMakeList(-1);
  }

  // Clear Search
  clearSearch() {
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.makeActionFlag = false;
    if(this.makeTotal != this.makeList.length) {
      this.getMakeList(-1);
    }    
  }
  
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.close();
  }

}