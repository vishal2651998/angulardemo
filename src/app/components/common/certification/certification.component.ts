import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterService } from '../../../services/filter/filter.service';
import { ProfileService } from '../../../services/profile/profile.service';
import * as moment from 'moment';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.scss']
})
export class CertificationComponent implements OnInit {

  @Input() apiKey: any;
  @Input() domainId: any;
  @Input() userId: any;
  @Input() loginUserId: any;
  @Input() filteredItems: any;
  @Input() type: any;
  @Input() catId: any;
  @Input() typeNew: any;
  @Output() updateDataResponce: EventEmitter<any> = new EventEmitter();

  public bodyElem;
  public bodyClass:string = "manage-list";
  public bodyClass1:string = "profile-certificate";
  public title: string = "";
  public manageList = [];
  public listItems = [];
  public selectionList = [];
  public saveSelectionList:any;
  public listLength: number = 0;

  public loading: boolean = true;
  public searchVal: string = '';
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public empty: boolean = false;
  public actionFlag: boolean = false;

  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public emptyIndex: any = '-1';
  public successMsg: string = "";

  public offset: number = 0;
  public DisableText: string = 'Disable';
  public limit: number = 30;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number;

  public bodyHeight: number; 
  public innerHeight: number;
  public findLength: number = 0;

  public datePlaceholder: string = "MMM DD, YYYY";
  public today: string = '';

  public cError: boolean = false;
  public cErrorMsg: string ='';
  public optionChanged: boolean = false;
  public countryId;

  // convenience getter for easy access to form fields
  get f() { return this.searchForm.controls; }

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();    
  }

  constructor(
    private profileService: ProfileService, 
    public activeModal: NgbActiveModal,
    private filterApi: FilterService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);
    this.searchForm = this.formBuilder.group({
      searchKey: [this.searchVal, [Validators.required]],
    });
    this.countryId = localStorage.getItem('countryId');
    localStorage.removeItem('searchVal');
    this.selectionList = [];
    this.saveSelectionList = [];
    
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();

    if(this.type == 'add'){
      this.getCertificationList();
    }
    else{
      this.userCertificationList();     
    }

  }

  // Set Screen Height
  setScreenHeight() {    
    this.innerHeight = (this.bodyHeight - 170 );  
  }

  // Get Filter Data
  getCertificationList() {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiKey);    
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);   
    apiFormData.append('catId', '1'); 

    this.profileService.getCertificationList(apiFormData).subscribe(response => {
          
      this.manageList = response.data;
      //console.log(this.manageList);
      this.listLength = this.manageList.length;
     
      if(this.listLength > 0) {
        this.empty = false;
        this.initList('get', this.manageList);
      } else {
        this.empty = true;
        this.successMsg = "No Result Found";
      }
    });
  }

  userCertificationList(){
    
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiKey);    
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);   
    apiFormData.append('catId', this.catId); 
  
    this.profileService.selectUserCertificationList(apiFormData).subscribe(response => {
      
     
      this.manageList = response.data;
     // console.log(this.manageList);
      this.listLength = this.manageList.length;
     
      if(this.listLength > 0) {
        this.empty = false;

        var key3 = "contents";
        var key1 = "parentId";
        var key2 = "name";
        var obj = {};
        var mlcontents = [];
        var savalue = [];

        for(let m in this.manageList) {
          if(this.manageList[m].selectedcontents.length>0){
            for(let mm in this.manageList[m].selectedcontents) {              
              savalue.push({
                contentId: this.manageList[m].selectedcontents[mm].contentId,
                contentInfo: this.manageList[m].selectedcontents[mm].contentInfo                      
              });  
            }            
          }
        }
        for(let m in this.manageList) { 
          if(this.manageList[m].unSelectedcontents.length>0){
            for(let mm in this.manageList[m].unSelectedcontents) {              
              savalue.push({
                contentId: this.manageList[m].unSelectedcontents[mm].contentId,
                contentInfo: this.manageList[m].unSelectedcontents[mm].contentInfo                      
              });  
            }            
          }
          obj[key1] = this.manageList[m].parentId;
          obj[key2] = this.manageList[m].name;
        }
       
        obj[key3] = savalue;
        mlcontents.push(obj);

        //console.log(mlcontents);

        this.manageList = mlcontents;
              
        this.initList('get', this.manageList);

        if(this.type=='edit'){
          this.filteredItems = [];
          for(let m in this.manageList) {
            for(let mm in this.manageList[m].selectedcontents) {           
              this.filteredItems.push(this.manageList[m].selectedcontents[mm]);
            }
          } 
        }

      } else {
        this.empty = true;
        this.successMsg = "No Result Found";
      }
    });
    
  }

  // Initiate Manage List
  initList(action, manageList) {

    this.listItems = [];
    this.listItems = manageList;  
    var firstArrLength = 0;  
    var SecArrContentLength = 0; 
    for(let m in this.listItems) {  
      this.listItems[m].displayFlag = true;
      this.listItems[m].itemShow = true;  
      this.findLength = 0;
      var secArrLength = 0;
      var checkArrLength = 0;
      firstArrLength = firstArrLength + 1;
      SecArrContentLength = SecArrContentLength + this.listItems[m].contents.length;
      for(let mm in this.listItems[m].contents) {
      this.listItems[m].displayFlag = true;
      this.listItems[m].itemShow = true;  
      this.findLength = this.findLength + 1;
      secArrLength = secArrLength + 1;
      this.listItems[m].contents[mm]['action'] = "";
      this.listItems[m].contents[mm]['displayFlag'] = true;
      this.listItems[m].contents[mm]['checkFlag'] = false;
      this.listItems[m].contents[mm]['itemExists'] = false;
      this.listItems[m].contents[mm]['activeMore'] = false;
      this.listItems[m].contents[mm]['actionFlag'] = false;  
      this.listItems[m].contents[mm]['cdate'] = '';
      this.listItems[m].contents[mm]['edate'] = '';
      this.listItems[m].contents[mm]['itemShow'] = true;  
      
      if(this.filteredItems.length > 0) {
        for(let t of this.filteredItems) {       
          if(t.contentId == this.listItems[m].contents[mm].contentId) { 
            this.listItems[m].contents[mm]['checkFlag'] = true;

            if(this.type == 'add'){
              checkArrLength = checkArrLength + 1;
              if(secArrLength == checkArrLength){               
                this.listItems[m].displayFlag = false;
                this.listItems[m].itemShow = false;
              }
              this.listItems[m].contents[mm]['displayFlag'] = false;
              this.listItems[m].contents[mm]['itemShow'] = false;  
            }
            else{
              this.selectionList.push({
                id: this.listItems[m].contents[mm].contentId,
                name: this.listItems[m].contents[mm].contentInfo                      
              });
            }            
                      
            this.listItems[m].contents[mm]['cdate'] = t.certificationDate;
            this.listItems[m].contents[mm]['edate'] = t.expiryDate;
            
          }
          else{
            //console.log(222);
          }        
        }
      }

      

      if(action == 'get') {
          for(let st of this.selectionList) {
            if(st.id == this.listItems[m].contents[mm].contentId) {
              this.listItems[m].contents[mm]['checkFlag'] = true;                
            }
          }  
        } 
      }

      /*if(SecArrContentLength == this.filteredItems.length){
        this.empty = true;
        this.successMsg = "No Certificate Found";
      }*/
    
      //console.log(this.selectionList);
  }

    setTimeout(() => {
      if(this.filteredItems.length > 0) {
        //this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
        //this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : 'checkbox-show';
      } 
      this.loading = false;
    }, 500);
  }

  // Item Selection
  itemSelection(type, index1, index2, id, flag) {
    this.cError = false;
    this.cErrorMsg = "";
    switch(type) {
      case 'single':
        
          this.listItems[index1].contents[index2].checkFlag = flag;           
                
        if(!flag) {
          let rmIndex = this.selectionList.findIndex(option => option.id == id);
          this.selectionList.splice(rmIndex, 1);
          setTimeout(() => {
            this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
            this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : this.headercheckDisplay;
            this.optionChanged = true;  
            this.headerCheck = (this.optionChanged) ? 'checked' : 'unchecked';          
          }, 100);         
        } else {          
                  
            this.selectionList.push({
              id: this.listItems[index1].contents[index2].contentId,
              name: this.listItems[index1].contents[index2].contentInfo
            });
         
         
          this.headercheckDisplay = "checkbox-show";
          this.headerCheck = (this.selectionList.length == (this.findLength)) ? 'all' : 'checked';
          this.headercheckDisplay = (this.selectionList.length > 0) ? 'checkbox-show' : 'checkbox-hide';          
        }
        break;
      case 'all':        
        this.selectionList = [];
        this.saveSelectionList = [];
        this.headercheckDisplay = 'checkbox-show';
        if(flag == 'checked') {
          if(this.findLength > 0) {
            this.headerCheck = 'all';            
            this.itemChangeSelection(this.headerCheck);
          }
        } else if(flag == 'all') {
          this.headerCheck = 'unchecked';
          this.headercheckDisplay = 'checkbox-hide';
          this.itemChangeSelection(this.headerCheck);
        } else {
          this.headerCheck = 'all';
          this.itemChangeSelection(this.headerCheck);
        }
        break;  
    }
  }

  // Item Selection (Empty, All)
  itemChangeSelection(action) {
    for(let m of this.listItems) {     
      for(let mm of this.listItems[m].contents) {
        if(action != 'empty' && action != 'unchecked') {
          this.selectionList.push({
            id: mm.contentId,
            name: mm.contentInfo
          });
        }      
        mm.checkFlag = (action == 'all') ? true : false;
      }
    }
    //console.log(this.selectionList);
  }


  selectChange(action, id, value, type) {
    //console.log(action + '::' + id + '::' + value + '::'+type);
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
    this.cError = false;
    this.cErrorMsg = "";  
    this.searchForm.value.searchKey = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
    if(searchValue.length == 0) {
      this.submitted = false;
    }

    let filteredList;

    for(let t in this.listItems) {
      this.listItems[t].displayFlag = false;
      for(let tt in this.listItems[t].contents) {
        this.listItems[t].contents[tt].displayFlag = false;        
      }
    }

      for(let m in this.manageList) { 
                
        filteredList = this.manageList[m].contents.filter(option => option.contentInfo.toLowerCase().indexOf(this.searchVal.toLowerCase()) !== -1);  
       
        for(let t in this.listItems) {          
          for(let tt in this.listItems[t].contents) {            
            for(let f in filteredList) {
              if(filteredList.length>0){
                this.empty = false; 
                
                if(this.listItems[t].contents[tt].contentInfo.toLowerCase() == filteredList[f].contentInfo.toLowerCase()) {
                  if(this.listItems[t].itemShow){ this.listItems[t].displayFlag = true; }
                  if(this.listItems[t].contents[tt].itemShow){ this.listItems[t].contents[tt].displayFlag = true; }                                
                }                    
              }
              else {        
                this.empty = true;
                this.successMsg = "No Result Found";
              } 
            }            
          }
        } 
      } 
    
  }

// Editor Onchange
onTextChange(event) {
  //this.today = moment(event).format('YYYY-MM-DD');
  console.log(moment(event).format('MMM DD, YYYY'));
  this.cError = false;
  this.cErrorMsg = "";
}

  // Submit Search
  submitSearch() {
        
  }

  // Clear Search
  clearSearch() {
    this.cError = false;
    this.cErrorMsg = "";
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.submitted = this.searchTick;
    this.empty = this.searchTick;
    
    for(let m in this.listItems) {
      if(this.listItems[m].itemShow){ this.listItems[m].displayFlag = true; }     
      for(let mm in this.listItems[m].contents) {
        if(this.listItems[m].contents[mm].itemShow){ this.listItems[m].contents[mm].displayFlag = true; }
      }
    }
  }

  // Apply Tag Selection
  applySelection() {
    let cdate = '';
    let edate = '';
    this.saveSelectionList=[];
    this.cError = false;
    this.cErrorMsg = "";

    var arr1 = '';
    var arr2 = '';	
    var obj = {};

    if(this.headerCheck == 'checked' || this.headerCheck == 'all') {  
      console.log(this.selectionList);
      for(let sl in this.selectionList) {        
        cdate = ((document.getElementById("touchui-cdate-"+this.selectionList[sl].id) as HTMLInputElement).value);
        edate = ((document.getElementById("touchui-edate-"+this.selectionList[sl].id) as HTMLInputElement).value);
        if(cdate == '' || edate == ''){  
          this.cError = true;
          this.cErrorMsg = "Please enter the valid Certification/Expiration Date for below selected certificates";
          return false;
        } 
        else{
          var c1date = new Date(cdate);
			    var e1date = new Date(edate);
          if (c1date.valueOf() > e1date.valueOf()) {
            this.cError = true;
            this.cErrorMsg = "Certification Date should be less than Expiration Date";
            return false;
          }
          else{
            arr1 = this.selectionList[sl].id;            
            arr2 = edate+"##"+cdate;           
            obj[arr1] = arr2;
            this.saveSelectionList = obj;           
          } 
        }       
      }
     
      var myJsonString = (JSON.stringify(this.saveSelectionList));      
      console.log(myJsonString);
     
      let flag = '';
      if(this.type == 'add'){
        flag = 'updatedelete';
        this.catId = '1';
      }
      else{
        flag = 'updatedelete';
        this.catId = this.catId;
      } 
      
      if(this.typeNew){
        flag = 'new';
        this.catId = '1';
      }

      this.loading = true;
      const apiFormData = new FormData();
      apiFormData.append('apiKey', this.apiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.loginUserId);      
      apiFormData.append('catId', this.catId);
      apiFormData.append('flag', flag);
      apiFormData.append('certificationsList', myJsonString);
   
      this.profileService.saveUserCertificationList(apiFormData).subscribe(res => {
        
        if(res.status=='Success'){
          this.loading = false;
          this.updateDataResponce.emit(true); 
        }
        else{  
          this.loading = false;          
          this.cError = false;
          this.cErrorMsg = res.result;
        }
                  
      },
      (error => {
        this.loading = false;
        this.cError = false;
        this.cErrorMsg = error; 
      })
      );

    }
    
  }
  
  // Clear Selection
  clearSelection() {
    this.headerCheck = 'unchecked';
    this.headercheckDisplay = 'checkbox-hide';
    this.selectionList = [];
    this.saveSelectionList = [];
    this.itemChangeSelection(this.headerCheck);
  }

  // Close
  close() {
    this.searchVal = '';
    this.bodyElem.classList.remove(this.bodyClass);
    this.filteredItems = [];
    this.activeModal.dismiss('Cross click'); 
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.remove(this.bodyClass);
    this.bodyElem.classList.remove(this.bodyClass1);

    /*if(this.filteredItems.length > 0 && this.selectionList.length == 0) {
      //this.selectedItems.emit(this.selectionList);      
    } else {
      this.filteredItems = [];
      this.activeModal.dismiss('Cross click');  
    }*/
  }
}

