import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HeadquarterService } from 'src/app/services/headquarter.service';

@Component({
  selector: 'app-updatename-popup',
  templateUrl: './updatename-popup.component.html',
  styleUrls: ['./updatename-popup.component.scss'],
  providers: [MessageService]

})
export class UpdatenamePopupComponent implements OnInit {

  inputText:string = "";
  @Input() nameValue:string;
  @Input() title:string;
  @Input() action:string;
  @Input() fieldTitle:string;  
  @Input() fieldName:string;  
  @Input() apiInfo:any;  
  @Output() emitService: EventEmitter<any> = new EventEmitter();
  isSaved:boolean = false;
  public serverError: boolean = false;
  public serverErrorMsg: string = '';
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  constructor(
    private messageService: MessageService,
    public activeModal:NgbActiveModal,
    private modalService: NgbModal,
    private headQuarterService: HeadquarterService,
  ) { }

  ngOnInit(): void {
  }

  dismiss(){
    this.activeModal.dismiss();
  }
  save(){        
    this.serverError = false;
    this.serverErrorMsg = '';
    if(this.nameValue !=='' && !this.isSaved){  
      this.isSaved = true   
      let apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiInfo['apiKey']);
      apiFormData.append("domainId", this.apiInfo['domainId']);
      apiFormData.append("userId", this.apiInfo['userId']);
      apiFormData.append("networkId", this.apiInfo['networkId']);
      apiFormData.append("name", this.nameValue);
      switch(this.fieldName){
        case 'certification-name':
          apiFormData.append("type", '29');
        break;
        case 'certification-provider':
          apiFormData.append("type", '30');
        break;
        case 'training-name':
          apiFormData.append("type", '32');
        break;
        case 'training-course':
          apiFormData.append("type", '33');       
        break;
        case 'training-track':
          apiFormData.append("type", '35');       
        break;
        case 'training-source':
          apiFormData.append("type", '34');
        break;
        case 'organization-name':
          apiFormData.append("type", '31');        
        break;
        case 'certification-type':
          apiFormData.append("type", '40');
        break;       
        case 'certification-list':
          apiFormData.append("type", '41'); 
        break;
        case 'technology-type':          
          apiFormData.append("type", '42');       
        break;
        case 'technology-solution':
          apiFormData.append("type", '37');    
        break;
        case 'policies-type':
          apiFormData.append("type", '38');   
        break;
        case 'policies-provider':
          apiFormData.append("type", '39');
        break;
        
      }
      this.headQuarterService.updateCommonValue(apiFormData).subscribe((res:any) => {
      this.isSaved = false;
      if(res.code == 200) {   
        let idNew = res.data['id'];
        let data = {
          id: idNew,
          name: this.nameValue,
        }
        setTimeout(() => {
          this.emitService.emit(data);
          this.activeModal.close();
        }, 0);        
      }
      else{        
        this.serverError = true;
        this.serverErrorMsg = res.message;
      }
    });      
    }
  }
}
