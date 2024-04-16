import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Constant, forumPageAccess, PlatFormType, SolrContentTypeValues } from 'src/app/common/constant/constant';
import { AutoComplete } from 'primeng/autocomplete';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { LandingpageService } from 'src/app/services/landingpage/landingpage.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
  @Input() pageData: any = [];
  @Input() searchKeyValue: string = "";
  @Output() searchFilterComponentRef: EventEmitter<SearchFilterComponent> = new EventEmitter();
  @Output() searchFilterCallback: EventEmitter<any> = new EventEmitter();
  @Output() actionHeader: EventEmitter<any> = new EventEmitter();
  @ViewChild('autocomplete') autocomplete:AutoComplete;

  public initAction: boolean = true;
  public filterCall: boolean = false;
  public pinFlag: boolean = false;
  public clearFlag: boolean = false;
  public pinStatus: any = 0;
  public access = "search";
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public collabticDomain: boolean = false;
  public collabticFixes: boolean = false;
  public subscriberDomain = localStorage.getItem('subscriber');
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public searchBgFlag: boolean = false;
  public searchFromText: string = 'Search from';
  public searchFixesCount: number = 0;
  public fixesText: string = 'fixes';
  public searchPlacehoder: string = 'Search';
  public searchVal: string = '';
  public assetPath: string = "assets/images";
  public assetPathplatform: string = "assets/images/";
  public searchImg: string = `${this.assetPath}/search-white-icon.png`;
  public searchCloseImg: string = `${this.assetPath}/select-close-white.png`;
  public acResultsTotal: number;
  public acResultsData: string[];
  public acResults: string[];
  public autoSearchApiCall;
  public searchFilter: any = [{manufacturer: '', make: '', model: [], year: []}];
  public oemList: any = [];
  public oemVal: string = "";
  public oemDisable: boolean = true;
  public makeList: any = [];
  public makeVal: string = "";
  public makeDisable: boolean = true;
  public modelList: any = [];
  public modelVal: any = "";
  public modelDisable: boolean = true;
  public yearList: any = [];
  public yearVal: any = '';
  public yearDisable: boolean = true;
  public yearRangeList: any = [{id: 1, name: '+/- 1 Year'}, {id: 2, name: '+/- 2 Years'}, {id: 3, name: '+/- 3 Years'}];
  public yearRangeVal: string = "";
  public yearRangeDisable: boolean = true;
  public engineSizeList: any = [];
  public engineSizeVal: string = "";
  public engineSizeDisable: boolean = true;
  public fixesCount: number = 0;
  
  get f() { return this.searchForm.controls; }
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private landingpageAPI: LandingpageService,
    public commonApi: CommonService,
    public apiUrl: ApiService,
  ) { }

  ngOnInit(): void {
    this.access = this.pageData.access;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.roleId = this.user.role_id;
    this.userId = this.user.Userid;
    let platformId = localStorage.getItem("platformId");
    if (platformId == PlatFormType.Collabtic) {
      this.collabticDomain = true;
      this.collabticFixes = (this.domainId == 336) ? true : false;
    }
    let navFromWs = localStorage.getItem('wsNav');
    if(navFromWs) {
      let searchVal = localStorage.getItem('searchValue');
      if(searchVal) {
        this.searchVal = searchVal;
        this.setupSearch();
      }    
    }
    if(this.searchKeyValue && this.searchKeyValue != '') {
      this.searchVal = this.searchKeyValue;
      this.setupSearch();
    }
    this.searchForm = this.formBuilder.group({
      searchKey: [this.searchVal, [Validators.required]],
    });
    setTimeout(() => {
      this.searchFilterCallback.emit(this);  
      setTimeout(() => {
        this.initAction = false;
      }, 500);
    }, 750);
  }

  acSearch(event) {
    let typeId: any;
    let flag = true;
    let reportFlag = '';
    typeId = SolrContentTypeValues.Thread;
    if(flag) {
      let data = {
        'query': event.query,
        'domainId': this.domainId,
        'type': typeId

      }
      let userWorkstreams=localStorage.getItem('userWorkstreams');
      let platformId=localStorage.getItem('platformId');
      let approvalProcessArr;
      if(platformId=='1' && (typeId==1 || typeId==2 || typeId==4 || typeId==6 || typeId==''))
      {
      approvalProcessArr=["0","1"];
      }
      else
      {
        approvalProcessArr='';
      }


      data["approvalProcess"] = JSON.stringify(approvalProcessArr);
      if(userWorkstreams) {
        data["workstreamsIds"]=userWorkstreams;

      }
      let currentSearchVal = event.query;
      console.log(currentSearchVal);
      this.autoSearchApiCall = this.landingpageAPI.getSolrSuggDetail(reportFlag, data).subscribe((response) => {
        console.log(response);
        this.acResults = [];
        if(!this.submitted) {
          this.acResults = response;
        } else {
          this.autocomplete.hide();
        }
      });
    }
  }

  onSubmit() {
    this.searchForm.value.search_keyword = this.searchVal;
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    } else {
      this.submitSearch();      
    }
  }
  
  // Clear Search
  clearSearchValue(action = '') {
    this.acResults = [];
    this.autocomplete.hide();
    let emitFlag = (this.searchTick) ? true : false;
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.searchBgFlag = false;
    this.searchImg = `${this.assetPath}/search-icon.png`;
    this.searchCloseImg = `${this.assetPath}/select-close.png`;
    if(action == '') {
      this.searchFilterCallback.emit(this);
    }
  }

  // Clear Search
  clearSearch() {
    this.searchPlacehoder = "Search";
    let emitFlag = (this.searchTick) ? true : false;
    this.submitted = false;
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.searchBgFlag = false;
    this.searchImg = `${this.assetPath}/search-icon.png`;
    this.searchCloseImg = `${this.assetPath}/select-close.png`;
    /* this.oemDisable = true;
    this.makeDisable = true;
    this.modelDisable = true;
    this.yearDisable = true;
    this.yearRangeDisable = true;
    this.pinFlag = false;
    this.pinStatus = 0;
    this.clearFlag = false;
    this.oemList = [];
    this.makeList = [];
    this.modelList = [];
    this.yearList = [];
    this.oemVal = '';
    this.makeVal = '';
    this.modelVal = '';
    this.yearVal = '';
    this.yearRangeVal = '';
    this.searchFilter[0]['manufacturer'] = this.oemVal;
    this.searchFilter[0]['make'] = this.makeVal;
    this.searchFilter[0]['model'] = [];
    this.searchFilter[0]['year'] = []; */
    if(emitFlag) {
      this.searchFilterCallback.emit(this);
    }
  }

  onChange(field, val) {
    console.log(field, val)
    this.filterCall = true;
    let clearFilter = true;
    this.searchPlacehoder = 'Search';
    switch(field) {
      case 'oem':
        this.makeVal = '';
        this.modelVal = '';
        this.yearVal = '';
        this.yearRangeVal = '';
        this.searchFilter[0]['manufacturer'] = this.oemVal;
        this.oemVal = val;
        this.searchFilter[0]['manufacturer'] = this.oemVal;
        this.searchFilter[0]['make'] = this.makeVal;
        this.searchFilter[0]['model'] = [];
        this.searchFilter[0]['year'] = [];
        break;
      case 'make':
        this.modelVal = '';
        this.yearVal = '';
        this.yearRangeVal = '';
        this.makeVal = val;
        this.searchFilter[0]['make'] = this.makeVal;
        this.searchFilter[0]['model'] = [];
        this.searchFilter[0]['year'] = [];
        break;
      case 'model':
        this.yearVal = '';
        this.yearRangeVal = '';
        this.modelVal = val;
        this.searchFilter[0]['model'] = [this.modelVal];
        this.searchFilter[0]['year'] = [];
        break;
      case 'year':
        this.yearRangeDisable = false;
        this.yearVal = val;
        this.searchFilter[0]['year'] = [this.yearVal];
        break;
      case 'year-range':
        let yearVal = parseInt(this.yearVal);
        let yearList = [this.yearVal];
        for(let yi = 1; yi <= val; yi++) {
          let py = yearVal-yi;
          yearList.unshift(py.toString());
        }
        for(let yi = 1; yi <= val; yi++) {
          let py = yearVal+yi;
          yearList.push(py.toString());
        }
        this.searchFilter[0]['year'] = yearList;
        this.yearRangeVal = val;
        break;
      case 'pin':
        clearFilter = (this.clearFlag) ? this.clearFlag : false;
        this.pinFlag = !val;
        this.pinStatus = (this.pinFlag) ? 1 : 0;
        break;
      case 'clear':
        clearFilter = false;
        this.oemDisable = true;
        this.makeDisable = true;
        this.modelDisable = true;
        this.yearDisable = true;
        this.yearRangeDisable = true;
        this.oemVal = '';
        this.makeVal = '';
        this.modelVal = '';
        this.yearVal = '';
        this.yearRangeVal = '';
        this.searchFilter[0]['manufacturer'] = this.oemVal;
        this.searchFilter[0]['make'] = this.makeVal;
        this.searchFilter[0]['model'] = [];
        this.searchFilter[0]['year'] = [];
        break;  
    }
    this.clearFlag = clearFilter;
    this.searchFilterCallback.emit(this);
    setTimeout(() => {
      this.filterCall = false;  
    }, 1500);    
  }

  // Search Onchange
  onSearchChange(searchValue: string) {
    this.searchForm.value.search_keyword = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
    let searchLen = searchValue.length;
    if (searchLen == 0) {
      this.submitted = false;
      this.clearSearch();
    }
  }

  onSearchSubmit(event) {
    //event.query = current value in input field
    console.log(event);
    console.log(this.searchVal);
    this.submitSearch();
  }

  // Submit Search
  submitSearch(itemData = []) {
    this.searchBgFlag = true;
    this.acResults = [];
    this.autocomplete.hide();
    if(this.autoSearchApiCall) {
      this.autoSearchApiCall.unsubscribe();
    }
    this.updateSearchKeyword(this.searchVal);
    this.searchFilterCallback.emit(this);
  }

  goToDetailPage(item, id, type,domainId){
    switch(this.access) {
      case 'standard-report':
        this.onSearchChange(item.term);
        setTimeout(() => {
          this.submitSearch(item);
        }, 50);
        break;
      default:
        //this.clearSearchValue('clear');
        type = parseInt(type);
        let aurl = '', wsFlag: any, scrollTop:any = 0, navFlag = false;
        let navFrom = this.commonApi.splitCurrUrl(this.router.url);
        switch (type) {
          case 1:
            /* let newThreadView = localStorage.getItem('threadView') == '1' ? true : false;
            let viewPath = (this.collabticFixes) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
            let view = (newThreadView) ? viewPath : forumPageAccess.threadpageNew;
            if(this.subscriberDomain) {
              aurl = `${view}${id}/${domainId}`;
            } else {
              aurl = `${view}${id}`;
            }

            wsFlag = (navFrom == ' threads') ? false : true;
            this.commonApi.setListPageLocalStorage(wsFlag, navFrom, scrollTop); */
            let data = {
              action: 'load-thread',
              threadId: id
            }
            this.actionHeader.emit(data);
            break;
          case 2:
            this.authenticationService.openPOPUPDetailView(4,id);
            break;
          case 4:
            wsFlag = (navFrom == ' parts') ? false : true;
            this.commonApi.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
            aurl = forumPageAccess.partsViewPage + id;
            navFlag = true;
            setTimeout(() => {
              this.commonApi.emitRightPanelOpenCallData(true);
            }, 100);
            break;
          case 6:
            this.authenticationService.openPOPUPDetailView(7,id);
            break;
        }
        if(navFlag) {
          setTimeout(() => {
            this.router.navigate([aurl]);
          }, 1);
        }
    }
  }

  setupSearch() {
    this.searchBgFlag = true;
    this.searchClose = true;
    this.searchTick = true;
  }


  updateSearchKeyword(keyword) {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("keyword", keyword);
    apiFormData.append("userId", this.userId);
    this.landingpageAPI.apiUpdateSearchKeyword(apiFormData).subscribe((response) => {});
  }

}
