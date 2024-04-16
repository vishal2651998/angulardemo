import { Component, OnInit, Input, Output, EventEmitter, HostListener,  ViewChild, ElementRef} from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Constant } from '../../../../common/constant/constant';
import { Title } from "@angular/platform-browser";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import * as moment from 'moment';
import { GoogleMap } from '@angular/google-maps';
import * as ClassicEditor from "src/build/ckeditor";
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../services/common/common.service';
import { ApiService } from '../../../../services/api/api.service';
import { LandingpageService } from '../../../../services/landingpage/landingpage.service';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  @ViewChild('mapRef', { static: false }) mapElement: ElementRef;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public domainId;
  public userId;
  public countryId; 
  public user: any;
  public innerHeight: number;
  public bodyHeight: number;
  public emptyFlag: boolean = false;
  public loading: boolean = true;
  public sectionLoading: boolean = false;
  public pageAccess: string = "shops-view";
  public platformId;
  public shopId;
  public catgId:any = 0;
  public parentCatgId: any = 0;
  public headTitle;
  public storeDetail:any = [];
  public taskItems: any = [];
  public taskFields: any = [];
  public shopName:string = "";
  public tab1:boolean = false;
  public tab2: boolean = false;
  public tab3: boolean = false;
  public mapId = '';
  public landingpageWidgets=[];
  public menuItems: any = [];
  public annLanding: boolean = true;
  public secRmHeight: any = 0;
  public requiredTxt: string = "Required";
  public viewTxt: string = "view";
  formValid: boolean = false;
  taskForm: FormGroup;
  public dateFormat:string = "MM-DD-YYYY";
  public minDate: any = '';
  public datePickerConfig: any = {
    format: this.dateFormat,
    min: this.minDate,
    disabled: true
  }
  // classicEditor
  public Editor = ClassicEditor;
  public textColorValues = [
    {color: "rgb(0, 0, 0)"},
    {color: "rgb(230, 0, 0)"},
    {color: "rgb(255, 153, 0)"},
    {color: "rgb(255, 255, 0)"},
    {color: "rgb(0, 138, 0)"},
    {color: "rgb(0, 102, 204)"},
    {color: "rgb(153, 51, 255)"},
    {color: "rgb(255, 255, 255)"},
    {color: "rgb(250, 204, 204)"},
    {color: "rgb(255, 235, 204)"},
    {color: "rgb(255, 255, 204)"},
    {color: "rgb(204, 232, 204)"},
    {color: "rgb(204, 224, 245)"},
    {color: "rgb(235, 214, 255)"},
    {color: "rgb(187, 187, 187)"},
    {color: "rgb(240, 102, 102)"},
    {color: "rgb(255, 194, 102)"},
    {color: "rgb(255, 255, 102)"},
    {color: "rgb(102, 185, 102)"},
    {color: "rgb(102, 163, 224)"},
    {color: "rgb(194, 133, 255)"},
    {color: "rgb(136, 136, 136)"},
    {color: "rgb(161, 0, 0)"},
    {color: "rgb(178, 107, 0)"},
    {color: "rgb(178, 178, 0)"},
    {color: "rgb(0, 97, 0)"},
    {color: "rgb(0, 71, 178)"},
    {color: "rgb(107, 36, 178)"},
    {color: "rgb(68, 68, 68)"},
    {color: "rgb(92, 0, 0)"},
    {color: "rgb(102, 61, 0)"},
    {color: "rgb(102, 102, 0)"},
    {color: "rgb(0, 55, 0)"},
    {color: "rgb(0, 41, 102)"},
    {color: "rgb(61, 20, 102)"}
  ];
  configCke: any = {
    toolbar: {
      items: [
        "bold",
         "Emoji",
         "italic",
         "link",
        "strikethrough",
         "|",
         "fontSize",
         "fontFamily",
         "fontColor",
         "fontBackgroundColor",
         "|",
         "bulletedList",
         "numberedList",
         "todoList",
         "|",
         "uploadImage",
         "pageBreak",
         "blockQuote",
         "insertTable",
         "mediaEmbed",
         "undo",
         "redo",

       ],
    },
    link: {
      // Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
      addTargetToExternalLinks: true,
    },
    simpleUpload: {
      // The URL that the images are uploaded to.
      //uploadUrl: Constant.CollabticApiUrl+""+Constant.uploadUrl,
      //uploadUrl:"https://collabtic-v2api.collabtic.com/accounts/UploadAttachtoSvr",
      uploadUrl: this.api.uploadURL,
    },
    image: {
      resizeOptions: [
        {
          name: "resizeImage:original",
          value: null,
          icon: "original",
        },
        {
          name: "resizeImage:50",
          value: "50",
          icon: "medium",
        },
        {
          name: "resizeImage:75",
          value: "75",
          icon: "large",
        },
      ],
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "resizeImage:50",
        "resizeImage:75",
        "resizeImage:original",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: "en",
  };

  public center: google.maps.LatLngLiteral;
  public options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
  };
  mapData: any;
  mapValueData: any;
  files: TreeNode[];
  selectedFile: TreeNode;
  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }
  constructor(
    private commonApi: CommonService,
    public api: ApiService,
    private authenticationService: AuthenticationService,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, 
    private LandingpagewidgetsAPI: LandingpageService,
  ) { 
    
  }
  ngOnInit(): void {
    console.log(this.route.params)
    this.route.params.subscribe( params => {
      this.shopId = params.id;
      console.log(Object.keys(params).length)
    }); 

    let today = moment().add(1, 'd');
    this.minDate = moment(today).format('MM-DD-YYYY');
    
    this.tab1 = (this.catgId == 0) ? true : false;
    this.taskForm = this.formBuilder.group({});
    this.secRmHeight = (this.catgId > 0) ? 0 : 50;
    this.headTitle = "Shop Details - ID# "+this.shopId;
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
    this.bodyHeight = window.innerHeight;      
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    let platformId = localStorage.getItem('platformId');
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);      
   
    this.loadScript();
    this.setScreenHeight();
    this.getShopDetails();
    if(this.catgId > 0) {
      this.sectionLoading = true;
      this.getShopDetails('task');
    }    
  }
  
  public loadScript() {
    const node = document.createElement('script');
    node.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';
    node.type = 'text/javascript';
    console.log(node);
    document.getElementsByTagName('head')[0].appendChild(node);
  }
  selectTap(type){
    switch(type){
      case 'tab1':
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = false;
        this.getShopDetails();
        break;
      case 'tab2':
        this.tab1 = false;
        this.tab2 = true;
        this.tab3 = false;
        break;
      case 'tab3':
        this.tab1 = false;
        this.tab2 = false;
        this.tab3 = true;
        break;
    }
  }
  getShopDetails(access=''){
    let action = (access == 'task') ? 'auditTask' : 'view';
    let view:any = (access == 'task') ? 3 : 4; 
    let formData = new FormData();
    formData.append('apikey', Constant.ApiKey);
    formData.append('domainId', this.domainId);
    formData.append('userId', this.userId);
    formData.append('auditId', this.shopId);
    formData.append('action', action);
    formData.append('view', view);
    if(access == 'task') {
      formData.append('catgId', this.catgId);
      formData.append('parentId', this.parentCatgId);
    }
    this.commonApi.getAuditList(formData).subscribe((response) => {
      console.log(response.data.items);
      let responseItems = response.data.items;
      if(access == 'task') {
        this.setupAuditData(response.data);
      } else {
        this.setupAuditDetails(responseItems[0]);
      }
      setTimeout(() => {
        this.loading = false;
      }, 500);      
    });
  }

  renderMap() {
    console.log('in render amp')
    window['initMap'] = () => {
      console.log(1)
      this.loadMap();
    };
    this.loadMap();
  }

  loadMap = () => {
    console.log('in load map')
    let index = 1;
    const bounds = new google.maps.LatLngBounds();
    const map = new window['google'].maps.Map(this.mapElement.nativeElement, {
      zoom: 8
    }); 
    //let infowindow = null;  
    console.log(this.mapValueData);
    const address = this.mapValueData.address1 + this.mapValueData.address2 + ',' + this.mapValueData.city + ',' + this.mapValueData.state + ',' + this.mapValueData.zip;  
    const lat: any = parseFloat(this.mapValueData.lat);
    const lng: any = parseFloat(this.mapValueData.lng);
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode( {address}, (results, status) => {
        console.log(address)
        console.log(results)
        console.log(status)
        if (status == google.maps.GeocoderStatus.OK) { 
          const marker: any = new window['google'].maps.Marker({
            position: {lat, lng},
            map,
            title: this.mapValueData.shopName,
            draggable: false,
            animation: window['google'].maps.Animation.DROP,
            label: {color: '#fff', fontSize: '14px', fontWeight: 'normal', text: (index).toString()}
          });
          bounds.extend(new window['google'].maps.LatLng(marker.position));
          map.fitBounds(bounds);
          map.setZoom(12);
          /*marker.addListener('click', () => {
            if (infowindow) {
              infowindow.close();
            }
            infowindow = new window['google'].maps.InfoWindow({
              content: ''
            });
          });  */               
          
        }
      }); 
  }

  // Set Screen Height
  setScreenHeight() {
    let rmHeight = (this.catgId > 0) ? 110 : 150;
    this.innerHeight = this.bodyHeight-rmHeight;
  }
  
  close(){   
    setTimeout(() => {
      var data  = {
        action : 'close'
      }
      this.commonApi.emitShopDetailDataClose(data);
    }, 0);
    let navUrl = 'audit';  
    this.router.navigate([navUrl]);
    
  }

  // Setup Audit Details
  setupAuditDetails(items) {
    this.storeDetail = items;
    this.menuItems = this.storeDetail.catgInfo;
    this.files = this.storeDetail.catgInfo;
    console.log(this.storeDetail.catgInfo);    
    this.shopName = this.storeDetail.shopName;
    if(this.storeDetail.auditDate !='' && this.storeDetail.auditDate != null){
      let createdOnDate = moment.utc(this.storeDetail.auditDate).toDate(); 
      this.storeDetail.auditDate = moment(createdOnDate).local().format('DD MMM, YYYY');
    }
    this.storeDetail.address1 = this.storeDetail.address1 != '' ? this.storeDetail.address1+", " : "";       
    this.storeDetail.address2 = this.storeDetail.address2 != '' ? this.storeDetail.address2+", " : "";       
    this.storeDetail.storeCity = this.storeDetail.city != '' ? this.storeDetail.city+", " : "";       
    this.storeDetail.storeState = this.storeDetail.state != '' ? this.storeDetail.state+", " : "";       
    this.storeDetail.storeZone = this.storeDetail.zip != '' ? this.storeDetail.zip: "";
    this.storeDetail.address = this.storeDetail.address1+this.storeDetail.storeCity+this.storeDetail.storeState+this.storeDetail.storeZone;
    this.mapId = "";
    this.mapValueData='';
    this.mapValueData=this.storeDetail;  
    console.log(this.mapValueData) ;
    if(this.mapValueData.mapFlag){
      setTimeout(() => {       
        this.renderMap();
      }, 1000);
    }
  }

   nodeExpand(event) {
    console.log(event.node.label);
  }

  nodeCollapse(event) {
    console.log(event.node.label);
  }

  nodeSelect(event) {
    console.log(event.node);
    let parentCatgId = parseInt(event.node.parentId);
    let childCount = (event.node.childCount) ? event.node.childCount : 0;
    this.catgId = parseInt(event.node.id); 
    this.parentCatgId = (parentCatgId == 0 && childCount == 0) ? this.catgId : parentCatgId;
    if((parentCatgId == 0 && childCount == 0) || parentCatgId > 0) {
      this.tab1 = false;
      this.tab2 = true;
      this.secRmHeight = 0;
      this.sectionLoading = true;
      this.getShopDetails('task');
    } else {
      this.secRmHeight = 50;
    }
  }

  nodeUnselect(event) {
    console.log(event.node.label);
  }

  // Setup Audi Data
  setupAuditData(response) {
    this.taskItems = [];
    this.taskFields = [];
    let auditDetail = response.auditDetail;
    this.taskFields = response.formFields;
    console.log(auditDetail[0].shopName)
    this.shopName = auditDetail[0].shopName;
    
    let taskData = response.items;
    taskData.forEach((item, index) => {
      let auditTaskData = item.auditTaskData;
      auditTaskData.forEach(ditem => {
        let fieldType = ditem.fieldType;
        let fieldValue = ditem.fieldValue;
        if(fieldType == 'inputDatePicker') {
          if(fieldValue !='' && fieldValue != null){
            let date = moment.utc(fieldValue).toDate(); 
            fieldValue = moment(date).local().format('DD MMM, YYYY h:mm A');
            ditem.fieldValue = fieldValue;
          }
        }
      });
      this.taskItems.push(item);
    });

    let taskLevelFields: any = [];
    // Initialize Task Form
    this.taskFields.forEach((tfItem, tfIndex) => {
      let required = tfItem.isRequired;
      let fieldId = tfItem.fieldId;
      let fieldName = tfItem.fieldName;
      let fieldOptions:any = tfItem.selectionItems;
      console.log(tfItem)
      let val = '';
      if(fieldName == 'taskLevel') {
        val = fieldOptions[0].name;
        tfItem.selectedValue = val;
        taskLevelFields = JSON.parse(fieldOptions[0].childFields);   
      }
      if(tfItem.isParent == 0 && taskLevelFields.length > 0) {
        console.log(fieldName, taskLevelFields.includes(fieldId))
        tfItem.isVisible = (taskLevelFields.includes(fieldId)) ? true : tfItem.isVisible;
      }
      console.log(taskLevelFields, taskLevelFields.length);
      this.taskForm.addControl(fieldName, new FormControl(val));
      this.setFormValidation(required, fieldName);
    });
    setTimeout(() => {
      this.sectionLoading = false;
    }, 250);
  }

  onChange(field, item, value) {
    console.log(field, item, value)
    item.selectedValue = value;
    item.valid = (value?.length > 0 || !item.isRequired) ? true : false;
    let taskLevelRelatedFields: any = [];
    let taskLevelRemoveFields: any = [];
    if(field == 'taskLevel') {
      let fieldOptions:any = item.selectionItems;
      let tlrlIndex =  (value == 'New') ? 0 : 1;
      let tlrmIndex =  (value == 'New') ? 1 : 0;
      taskLevelRelatedFields = JSON.parse(fieldOptions[tlrlIndex].childFields);
      console.log(taskLevelRelatedFields)
      taskLevelRelatedFields.forEach(item => {
        let taskFieldIndex = this.taskFields.findIndex(option => option.fieldId == item);
        if(taskFieldIndex >= 0) {
          this.taskFields[taskFieldIndex].isVisible = true;
        }
      });
      taskLevelRemoveFields = JSON.parse(fieldOptions[tlrmIndex].childFields);
      taskLevelRemoveFields.forEach(item => {
        let taskFieldIndex = this.taskFields.findIndex(option => option.fieldId == item);
        if(taskFieldIndex >= 0) {
          this.taskFields[taskFieldIndex].isVisible = false;
        }
      });
    }
  }

  // Set Form Validation
  setFormValidation(flag, field) {
    if(flag) {
      this.taskForm.controls[field].setValidators([Validators.required]);
    }
  }

  saveData(item) {
    if(this.formValid) {
      return false;
    }
    console.log(item, this.taskForm)
    console.log(this.taskFields)
    this.taskFields.forEach(taskField => {
      taskField.valid = (taskField.selectedValue.length > 0) ? true : taskField.valid;
      if(taskField.isRequired && !taskField.valid) {
        return false;
      }      
    });

    let taskFieldData: any = [];
    this.taskFields.forEach(tfItem => {
      if(tfItem.isVisible) {
        let fieldValue:any = tfItem.selectedValue;
        switch(tfItem.fieldType) {
          case 'inputDatePicker':
            fieldValue = moment(fieldValue).format('YYYY-MM-DD');
            break;
          case 'upload':
            fieldValue = JSON.stringify([]);
            break;
        }
        taskFieldData.push({catgFieldId: tfItem.fieldId,fieldValue})
      }      
    });
    console.log(taskFieldData)
    let actionView: any = 4;
    let platform:any = 3;
    let formData = new FormData();
    formData.append('apikey', Constant.ApiKey);
    formData.append('domainId', this.domainId);
    formData.append('userId', this.userId);
    formData.append('platform', platform);
    formData.append('auditId', this.shopId);
    formData.append('catgId', this.catgId);
    formData.append('taskId', item.id);
    formData.append('action', 'new');
    formData.append('view', actionView);
    formData.append('auditDataValues', JSON.stringify(taskFieldData));
    formData.forEach((value,key) => {
      console.log(key+" "+value)
      return false
    }); 
    this.commonApi.manageAudit(formData).subscribe((response) => {
      console.log(response)
      item.auditTaskData = response.data;
      item.formFlag = false;
    });
  }

  cancelForm(item, index) {
    this.formValid = false;
    item.formFlag = false;
    item.submitted = false;
    item.isSelected = false;
    this.taskForm.reset();
  }

  onTabClose($event,data) {
    console.log(data);
    /*this.formValid = false;
    data.formFlag = false;
    data.submitted = false;
    data.isSelected = false;*/
    this.taskForm.reset();
  }

  onTabOpen($event,data) {
    console.log(data);
    this.taskItems.forEach(item => {
      item.isSelected = false;
    });
    this.taskItems = this.taskItems;
    this.taskForm.reset();
    data.isSelected = true;
  }


}
