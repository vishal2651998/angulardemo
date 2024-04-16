import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from '../../../services/profile/profile.service';

@Component({
  selector: 'app-profile-metrics',
  templateUrl: './profile-metrics.component.html',
  styleUrls: ['./profile-metrics.component.scss']
})
export class ProfileMetricsComponent implements OnInit {

  @Input() metricsPageData;
  public loadingrs:boolean=true;
  public profileError;
  public profileErrorMsg;
  public profileNoMetrics;
  public viewslikespinsData;
  public metricsData;
  public fixesData;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {

    this.profileNoMetrics =  false;
    this.loadingrs = true;         
    this.profileErrorMsg = '';  
    this.profileError = false;

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.metricsPageData.apiKey);
    apiFormData.append('domainId', this.metricsPageData.domainId);
    apiFormData.append('countryId', this.metricsPageData.countryId);
    apiFormData.append('userId', this.metricsPageData.userId);
    apiFormData.append('technicianId', this.metricsPageData.technicianId);

    this.profileService.getProfileMetrics(apiFormData).subscribe(res => {
        
      if(res.status=='Success'){                       
        let profileData = res.metricsData;
               
        if(profileData != ''){ 
          this.loadingrs = false;  
          this.metricsData = res.metricsData.metrics;
          this.viewslikespinsData = res.metricsData.viewslikespins;
          this.fixesData = res.metricsData.fixes;                 
        }
        else{
          this.profileNoMetrics =  true;
          this.loadingrs = false;         
          this.profileErrorMsg = res.result;  
          this.profileError = true;
        }
      }
      else{
        this.loadingrs = false;
        this.profileErrorMsg = res.result;  
        this.profileError = true;   
      }
                
    },
    (error => {
      this.loadingrs = false;
      this.profileErrorMsg = error;
      this.profileError = '';       
    })
    );
  }
}

