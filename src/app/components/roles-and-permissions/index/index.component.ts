import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Constant } from 'src/app/common/constant/constant';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  public loading: boolean = true;
  public headerData: Object;
  public headerFlag: boolean = false;
  public pageAccess: string = "roles&Permissions";
  public apiKey: string = Constant.ApiKey;
  public apiData: Object;
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public tableHeader = null;
  public tableData = null;
  public roleName = "";
  public changedFlag: Boolean = false;
  public isEditMode: Boolean = false;
  public editRoleObject: any;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  invalidName : boolean = false;
  public divHeight = '450px';
  public pTableHeight = '450px';
  public pTableHeightVal = 450;
  public title = "Roles & Permissions";

// Resize Widow
@HostListener("window:resize", ["$event"])
onResize(event) {
  setTimeout(() => {
    this.setHeight();
  }, 200);
}
  constructor(private titleService: Title,private authenticationService: AuthenticationService, private dashboardService: DashboardService, private router: Router,private modalService: NgbModal,
    ) {
      this.titleService.setTitle(
        localStorage.getItem("platformName") + " - " + this.title
      );
     }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;

    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    if (authFlag) {

      this.headerData = {
        'access': this.pageAccess,
        'profile': true,
        'welcomeProfile': true,
        'search': false,
        'searchVal': '',
      };

      this.apiData = {
        'apiKey': this.apiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'roleId': this.roleId
      };

      this.loadRolesandPermissions();
      setTimeout(() => {        
        this.setHeight();
      }, 1000);
      

    } else {
      console.log("forbidden");
      this.router.navigate(['/forbidden']);
    }
  }

  loadRolesandPermissions(){
    this.dashboardService.getRolesAndPermissions(this.apiData).subscribe(roles => {
      localStorage.setItem('param',JSON.stringify(roles));
      console.log("roles", roles);
      this.tableHeader = roles.header;
      this.tableData = roles.items;
      let data = [];
      this.tableData.forEach(element => {
        data.push({ contentTypeId: element.contentTypeId, name: element.name, imageName: element.imageName, title: true });
        element.pageAccess.forEach(pa => {
          pa.roles = pa.roles.sort((a, b) => { return a.id > b.id ? -1 : 1 });
          pa.roles.map(role => { role['backup_access'] = role.access });
          pa.accessId = pa.id;
          delete pa.id;
          data.push({ ...pa, contentTypeId: element.contentTypeId, title: false })
        })
      });
      console.log("data", data)
      this.tableData = JSON.parse(JSON.stringify(data));
      console.log(this.tableHeader);
      console.log(this.tableData[0]);
      this.loading = false;
    })
  }

  setHeight(){
    let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;     
    let heigtVal1 = (window.innerHeight - 152) - (headerHeight);
    let heigtVal2 = (window.innerHeight - 217 ) - (headerHeight) + 123;
    this.pTableHeight = heigtVal1+'px';
    this.divHeight = heigtVal2+'px';   
  }

  onToggleBoxChange(role, roleId, contentTypeId, accessId, access) {
    this.changedFlag = true;
    role.is_changed = true;
    console.log(roleId, contentTypeId, accessId, access);
  }

  OpenNewRolePopup(data: any = null) {
    if (data) {
      this.isEditMode = true;
      this.editRoleObject = data;
    }
    this.roleName = data?.name ?? "";
    let model_group = document.getElementById("newRolePopup");
    model_group.classList.add("modal-fade");
  }
  CloseNewRolePopup() {
    this.roleName = "";
    this.isEditMode = false;
    this.editRoleObject = null;
    let model_group = document.getElementById("newRolePopup");
    model_group.classList.remove("modal-fade");
    this.invalidName = false;
  }

  saveNewRole() {
    // console.log(this.roleName);
    this.checkInput();
    if (this.isEditMode == true) {
      // call update api here
      this.tableHeader.map(item => { if (item.name == this.editRoleObject.name) item.name = this.roleName })
      this.CloseNewRolePopup();
    } else {
      if (this.roleName) {
        console.log(this.tableData);
        this.tableHeader.push({
          is_custom_role: true,
          id: this.tableHeader.length + 1,
          name: this.roleName
        });
        this.tableData.forEach((tableEl: any) => {
          tableEl?.roles?.push({
            id: tableEl.roles.length + 1,
            name: this.roleName,
            access: 0
          });
        });
        this.CloseNewRolePopup();
      }
    }
  }

  resetChanges() {
    this.tableData.map(row => {
      if (row?.roles) {
        row?.roles.map(role => {
          if (role.is_changed) {
            role.is_changed = false;
            role.access = role.backup_access;
          }
        })
      }
    })
  }

  saveChanges() {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Save';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click'); 
      if(!receivedService) {
          // this.resetChanges();
          // this.changedFlag = false;
        return;
      } else {
         var arr = []
      this.tableData.map(row => {
        console.log(this.tableData);
        if (row?.roles) {
          row?.roles.map(role => {
            if (role.is_changed) {
              arr.push({
                roleId: role.id,
                contentTypeId: row.contentTypeId,
                access: { [row.accessId]: role.access ? '1' : '0' }
              })
            }
          })
        }
      })
      const apiData = {
        'apiKey': this.apiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'accessUpdate': JSON.stringify(arr)
      };
      this.dashboardService.updateRolesAndPermissions(apiData).subscribe(result => {
        if (result.status == "Success") {
          console.log(result);
          this.changedFlag = false;
          this.refreshBackupAccess();
          this.loadRolesandPermissions();
        }
      });
      }
    });
  }

  refreshBackupAccess() {
    this.tableData.map(row => {
      if (row?.roles) {
        row?.roles.map(role => {
          if (role.is_changed) {
            role.backup_access = role.access;
            role.is_changed = false;
          }
        })
      }
    })
  }

  deleteRole(){
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Delete';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      console.log('receivedService: ', receivedService);
      modalRef.dismiss('Cross click'); 
      if(!receivedService) {
        return;
      } else {
        console.log('API here');
      }
  })
}

checkInput(){
  this.invalidName = this.roleName?.length > 0 ? false : true;
}

applySearch(event){
//
}

ngOnDestroy() {
  localStorage.removeItem('param');
}

}
