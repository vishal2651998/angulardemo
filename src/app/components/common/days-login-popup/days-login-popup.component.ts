import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Constant, windowHeight, pageTitle } from '../../../common/constant/constant';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { countries } from 'country-data';
import { UserDashboardService } from '../../../services/user-dashboard/user-dashboard.service'; 
@Component({
  selector: 'app-days-login-popup',
  templateUrl: './days-login-popup.component.html',
  styleUrls: ['./days-login-popup.component.scss']
})
export class DaysLoginPOPUPComponent implements OnInit {

  @Input() data;
  @Output() daysLoginResponce: EventEmitter<any> = new EventEmitter();
  //public height = 100%;
  public loading: boolean = true;
  public signupForm1: FormGroup; 
  public phoneNumberData:any;
  public name: string = '';
  public email: string = '';
  public icountryName = '';
  public icountryCode = '';
  public idialCode = '';
  public iphoneNumber = '';
  public firstLastname = '';
  public phoneNumberValid:boolean = false;
  public placeholderZeroFlag: boolean = false;
  public placeholderLength: number = 0;
  public submitted1:boolean;
  public invalidNumber:boolean = false;
  public submitLoading1: boolean = false;
  public nameInputFlag: boolean = false;
  public emailInputFlag: boolean = false;
  public phonenoInputFlag:boolean = false;
  public buttonEnable:boolean = false;
  public serverError:boolean = false;
  public serverErrorMsg:string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userDashboardApi: UserDashboardService,
  ) { }

  get f1() { return this.signupForm1.controls; }
 

  ngOnInit(): void {

    console.log(this.data);
    //this.height = windowHeight.height - 100;  
    //console.log(this.height); 

    setTimeout(() => {      

      this.data['countryCode'] = this.data['countryCode'] != undefined ? this.data['countryCode'] : '';
      this.data['phone'] = this.data['phone'] != undefined ? this.data['phone'] : '';
      this.data['countryName'] = this.data['countryName'] != undefined ? this.data['countryName'] : '';
      this.data['dialCode'] = this.data['dialCode'] != undefined ? this.data['dialCode'] : '';
      this.data['firstLastname'] = this.data['firstLastname'] != undefined ? this.data['firstLastname'] : '';

      this.phoneNumberData = {  
        'countryCode': this.data['countryCode'], 
        'phoneNumber' : this.data['phone'],
        'country': this.data['countryName'],
        'dialCode' : this.data['dialCode'],
        'access': 'phone'
      } 
             
      this.name = this.data['nickName'];
      this.nameInputFlag = this.name != '' ? true: false;
      this.email = this.data['personalEmail'];
      this.emailInputFlag = this.email != '' ? true: false;
      this.firstLastname=this.data['firstLastname'];
      this.loading = false;

      this.signupForm1 = this.formBuilder.group({   
        name: [this.name, [Validators.required]] ,                  
        email: [this.email, [Validators.required, Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],                          
      });

    }, 1);         

  }

  signupButtonActive(){ 
    this.serverErrorMsg = '';
    this.serverError = false;
    if((this.signupForm1.value.name != null ) && (this.signupForm1.value.email != null ) && (this.iphoneNumber != '' && !this.phoneNumberValid) ) {       
      if((this.signupForm1.value.name.length>0) && (!this.signupForm1.value.name.invalid) && (this.signupForm1.value.email.length>0) && (!this.signupForm1.value.email.invalid) && (this.iphoneNumber != '' && !this.phoneNumberValid)) {
        this.buttonEnable = true;  
      }
      else{
        this.buttonEnable = false;          
      }    
    }
    else{
      this.buttonEnable = false;        
    }  
  }

  public onKeypress(fieldName,event: any) {        
    // Remove invalid chars from the input
    var inputVal = event.target.value.trim(); 
    var inputLength = inputVal.length; 
    switch(fieldName){
      case 1:
        this.nameInputFlag = (inputLength>0) ? true : false;             
        break;
      case 2:
        this.emailInputFlag = (inputLength>0) ? true : false;
        break;      
      default:            
      break;  
    } 
    this.signupButtonActive();    
  }

  // country & phone number update
  getPhoneNumberData(newValue){
    console.log(newValue); 
    
    if(newValue != null){
      if(newValue.access == 'phone'){
        if(newValue.phoneVal != null){      
          this.iphoneNumber = '';            
      let placeHolderValueTrim = '';       
      let placeHolderValueTrim1 = '';       
      let placeHolderValueLen = 0 ;        
      let placeHolderValueLen1 = 0 ;        
      let placeHolderValue = newValue.placeholderVal;
      placeHolderValueTrim = placeHolderValue.replace(/[^\w]/g, "");          
      placeHolderValueTrim1 = placeHolderValue.replace(/[^\w]/g, "");          
      placeHolderValueTrim = placeHolderValueTrim.replace(/^0+/, '');
      this.placeholderLength = placeHolderValueTrim.length; 
      placeHolderValueLen = placeHolderValueTrim.length; 
      placeHolderValueLen1 = placeHolderValueTrim1.length; 

      var digit = placeHolderValueTrim1.toString()[0];
      console.log(placeHolderValueTrim1);
      console.log(digit);
      if(digit == '0'){
        this.placeholderZeroFlag = true;
      }          
        
      let currPhValueTrim = '';        
      let currPhValueLen = 0 ;      
      let currPhValueLen1 = 0 ;      
      if(newValue.phoneVal['number'] != ''){                             
        if(this.placeholderZeroFlag){
          this.iphoneNumber = newValue.phoneVal.number; 
          console.log(this.iphoneNumber);
          currPhValueTrim = this.iphoneNumber.replace(/[^\w]/g, "");  
          currPhValueLen = currPhValueTrim.length;
          var digitFirst = currPhValueTrim.toString()[0];
          console.log(digitFirst);
          if(digitFirst == '0'){
            if(currPhValueLen > placeHolderValueLen){ 
              currPhValueTrim = currPhValueTrim.replace(/^0+/, ''); 
              currPhValueLen = currPhValueTrim.length; 
              this.placeholderZeroFlag = false;
              console.log(this.iphoneNumber);
            }
            else{
              this.placeholderZeroFlag = true;
              this.iphoneNumber = currPhValueTrim;
              currPhValueLen1 = this.iphoneNumber.length; 
              console.log(this.iphoneNumber);
            }              
          }            
          else{
            if(currPhValueLen != placeHolderValueLen){ 
              this.placeholderZeroFlag = true;
              this.iphoneNumber = "0"+currPhValueTrim;
              currPhValueLen1 = this.iphoneNumber.length; 
              console.log(this.iphoneNumber);
            }
            else{
              this.placeholderZeroFlag = false;                
            }
          } 
        }
        else{                     
          currPhValueTrim = newValue.phoneVal['number'].replace(/[^\w]/g, "");
          //currPhValueTrim = currPhValueTrim.replace(/^0+/, ''); 
          currPhValueLen = currPhValueTrim.length;
        }           
      }     
            
      if(newValue.phoneVal['number'].length>0){
        this.phonenoInputFlag = (newValue.phoneVal['number'].length>0) ? true : false; 
        this.invalidNumber = (newValue.errorVal) ? true : false; 
        
        this.phoneNumberValid = true;
        this.icountryName = '';
        this.icountryCode = '';          
        this.idialCode = '';
        this.iphoneNumber = !this.placeholderZeroFlag ? newValue.phoneVal.number : this.iphoneNumber;  

        console.log(placeHolderValue);
        console.log(this.iphoneNumber); 
        console.log(currPhValueLen1);
        console.log(currPhValueLen);
        console.log(placeHolderValueLen1);
        console.log(placeHolderValueLen);          

        if(this.placeholderZeroFlag){
          if(currPhValueLen1 == placeHolderValueLen || currPhValueLen1 == placeHolderValueLen1){ 
            this.phoneNumberValid = false;  
            let getCode = newValue.phoneVal.countryCode;        
            this.icountryName = countries[getCode].name;
            this.icountryCode = newValue.phoneVal.countryCode;            
            this.idialCode = newValue.phoneVal.dialCode;
            console.log(this.iphoneNumber);  
          }
        }
        else{
          if(currPhValueLen == placeHolderValueLen){ 
            this.phoneNumberValid = false;  
            let getCode = newValue.phoneVal.countryCode;        
            this.icountryName = countries[getCode].name;
            this.icountryCode = newValue.phoneVal.countryCode;            
            this.idialCode = newValue.phoneVal.dialCode;
            this.iphoneNumber = newValue.phoneVal.number;  
            console.log(this.iphoneNumber); 
          }
        }
        
      }
      else{
        this.phonenoInputFlag = (newValue.phoneVal['number'].length>0) ? true : false; 
        this.iphoneNumber = '';
      }       
        }
        else{
          //if(this.iphoneNumber == ''){           
            this.phonenoInputFlag = false; 
            this.invalidNumber  = false; 
            this.phoneNumberValid = true;
            this.icountryName = '';
            this.icountryCode = '';        
            this.idialCode = '';
            this.iphoneNumber = '';
          //}
        }
      }
    }
    else{
      if(this.iphoneNumber == ''){
        this.phonenoInputFlag = false; 
        this.invalidNumber = false; 
        this.phoneNumberValid = true;
        this.icountryName = '';
        this.icountryCode = '';      
        this.idialCode = '';
        this.iphoneNumber = '';
      }
    } 

    this.signupButtonActive(); 

  } 


  submitStep1(){
    this.submitted1 = true;
    console.log(this.signupForm1.value);
    // stop here if form is invalid
    if (this.signupForm1.invalid || this.iphoneNumber == ''){
      return;
    }
   
    this.submitted1 = false;
    this.submitLoading1 = true;    

    const signupData1 = new FormData();
    signupData1.append('apiKey', Constant.ApiKey);
    signupData1.append('nickName', this.signupForm1.value.name.trim());
    signupData1.append('persionalEmail', this.signupForm1.value.email.trim());
  
    if(this.iphoneNumber!=''){        
      this.iphoneNumber = (this.placeholderZeroFlag || (this.placeholderLength == this.iphoneNumber.length) ) ? this.iphoneNumber :this.iphoneNumber.replace(/^0+/, '');             
      console.log(this.iphoneNumber); 
    }
    let userId=localStorage.getItem('userId');
    if(userId)
    {

    
    signupData1.append('pnumber', this.iphoneNumber);
    signupData1.append('countryName', this.icountryName);  
    signupData1.append('countryCode', this.icountryCode);  
    signupData1.append('dialCode', this.idialCode);
    signupData1.append('userId', userId);
    signupData1.append('persionalUdate', '1');

    //new Response(signupData1).text().then(console.log);

    this.userDashboardApi.updateuserInfobyAdmin(signupData1).subscribe((response) => {
      console.log(response);
      this.daysLoginResponce.emit(true);

    });
    
  }
    
    
  
  }

}
