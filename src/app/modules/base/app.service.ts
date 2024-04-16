import { Injectable } from "@angular/core";
import { pageInfo, Constant,PlatFormType } from 'src/app/common/constant/constant';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public appData: any = {};
    constructor(){
        this.init();
    }

    init(){
        let platformId = localStorage.getItem('platformId');
        if(platformId==PlatFormType.Collabtic)
        {
         this.appData.api = Constant.CollabticApiUrl+'/';
        }
        else if(platformId==PlatFormType.MahleForum)
        {
         this.appData.api = Constant.TechproMahleApi+'/';
        }
        else if(platformId==PlatFormType.CbaForum)
        {
         this.appData.api = Constant.CbaApiUri+'/';
        }
        else if(platformId==PlatFormType.KiaForum)
        {
         this.appData.api = Constant.KiaApiUri+'/';
        }
        else
        {
         this.appData.api = Constant.CollabticApiUrl+'/';
        }
     
     // this.appData.api = "https://mobile-api.collabtic.com/";
      this.appData.apiKey = "dG9wZml4MTIz";
    }

    setAppData(data: any){
        this.appData = data;
    }

    getAppData(){
     if(this.appData){
         return this.appData;
     } else {
         return {};
     }
    } 
}

