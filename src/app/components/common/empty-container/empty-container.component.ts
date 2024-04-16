import { Component, OnInit,Input  } from '@angular/core';
import { Router } from '@angular/router';
import { pageInfo, Constant, IsOpenNewTab, ChatType, LocalStorageItem, DefaultNewImages, DefaultNewCreationText } from "src/app/common/constant/constant"
@Component({
  selector: 'app-empty-container',
  templateUrl: './empty-container.component.html',
  styleUrls: ['./empty-container.component.scss']
})
export class EmptyContainerComponent implements OnInit {
  @Input() pageTitleText;
  @Input() redirectionPage;
  @Input() showType;
  @Input() newPartInformation;
  @Input() contentTypeDefaultNewImg;
  @Input() contentTypeValue;
  @Input() contentTypeDefaultNewTextDisabled;
  @Input() contentTypeDefaultNewText;
  @Input() actionUrl;
  @Input() accessCheck;
  public activeClass='';
  public workStreamPage: boolean = false;
  public verticalCenterFlag = false;
  public verticalCenterClass = "vertical-center";
 
  constructor(private router: Router) { }

  ngOnInit(): void {

    this.accessCheck = this.accessCheck == '1' ? '1' : '0';
    if(this.contentTypeDefaultNewTextDisabled)
    {
this.activeClass='no-active';
    }
    else
    {
      this.activeClass='active';
    }
    this.pageTitleText= this.pageTitleText;
    this.redirectionPage= this.redirectionPage;
    console.log(this.pageTitleText);
    console.log(this.redirectionPage);
    console.log(this.router.url);
    let retrunUrlval = this.router.url;
    retrunUrlval = retrunUrlval.substring(1);
    let wordView = "workstreams-page";              
    console.log(retrunUrlval);
    let integrationUrl = (retrunUrlval.indexOf(wordView) !== -1) ? true : false;
    console.log((retrunUrlval.indexOf(wordView) !== -1));
    this.workStreamPage = false;
    this.verticalCenterFlag = (retrunUrlval == 'parts' && this.showType == 1) ? true : false;
    if(integrationUrl){
      this.workStreamPage = true;      
      if(this.contentTypeValue == 4){
        let platformId = localStorage.getItem('platformId'); 
        if(platformId != '1'){
          this.pageTitleText = "Documents";
          this.redirectionPage = "documents";
        }
        else{
          this.pageTitleText = "Tech Info";
          this.redirectionPage = "documents";
        }
      }
    }
  }

  SetChatSessionforRedirect(chatgroupid: string, chatType: ChatType) {
    localStorage.setItem(LocalStorageItem.reloadChatGroupId, chatgroupid);
    localStorage.setItem(LocalStorageItem.reloadChatType, chatType);
  }
  actionChatRedirect(wid)
  {
    this.SetChatSessionforRedirect(wid, ChatType.Workstream);
    let aurl = "chat-page";
    window.open(aurl, "_blank" + aurl);
  }
  rediretToNew() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([this.pageTitleText == 'Market Place'?'/market-place/manage':'/market-place/manage-manual'])
    );
    window.open(url, '_blank');
  }
  pageNav(){
/*
    alert(this.contentTypeValue);
    switch(this.contentTypeValue){
      case '2':
        break;
      case '6':
        break;
      case '4':
        break;
      case '7':
        break; 
      case '28':
        break; 
      case '30':
        break;  
    }

    let workstreamId = localStorage.getItem("landing-page-workstream");
*/
    let url=this.redirectionPage;

    setTimeout(() => {
      let teamSystem=localStorage.getItem('teamSystem');
      if(teamSystem)
      {
       window.open(url, IsOpenNewTab.teamOpenNewTab);  
      }
      else
      {
       window.open(url, IsOpenNewTab.openNewTab);  
      }
      
     }, 50); 
  }
  actionItem(event)
  {
let url=this.actionUrl;
if(url && !event)
{


   setTimeout(() => {
     let teamSystem=localStorage.getItem('teamSystem');
     if(teamSystem)
     {
      window.open(url, IsOpenNewTab.teamOpenNewTab);  
     }
     else
     {
      window.open(url, IsOpenNewTab.openNewTab);  
     }
     
    }, 50);  
  }
}
}
