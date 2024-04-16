import { Component, Input, Output, EventEmitter, ElementRef, ViewChild , OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-country-phonenumber',
  templateUrl: './country-phonenumber.component.html',
  styleUrls: ['./country-phonenumber.component.scss']
})
export class CountryPhonenumberComponent implements OnInit {

  @Input() phoneNumberData;
  @Output() public isPhoneData=new EventEmitter(true);

  public ngxInputControl: string = 'phone';
  public selectedCountryISO;
  public setCountry;
  public myModel = '';
  public mask ='';
  public phoneForm;
  public businessForm;
  public landlineForm; 
  public access = '';
  public custom = '';
  public loading: boolean = false;
  public oldPlaceHolderValue;

	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Australia, CountryISO.India];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {   

    // console.log(this.phoneNumberData);    
    // console.log(this.phoneNumberData.phoneNumber);
    // console.log(this.phoneNumberData.countryCode);
    // console.log(this.phoneNumberData.dialCode);
    // console.log(this.phoneNumberData.access);

    this.access = this.phoneNumberData.access != '' ? this.phoneNumberData.access : 'phone';
    this.custom =  this.access;
    this.ngxInputControl = this.access;

    setTimeout(() => { 
      
      if(this.access == 'business'){       
        this.businessForm = this.fb.group({
          business: [''],      
        });         
      }
      if(this.access == 'landline'){       
        this.landlineForm = this.fb.group({
          landline: [''],      
        });         
      }
      if(this.access == 'phone'){      
        this.phoneForm = this.fb.group({
          phone: [''],      
        });         
      }

      this.loading = true;

      let sc = 'us';
      let phone = '';
      let dial = '+1'
      setTimeout(() => {      
        if(this.phoneNumberData != undefined && this.phoneNumberData !=''){
          
          dial = this.phoneNumberData.dialCode !='' ? this.phoneNumberData.dialCode : '+1';  
          phone = this.phoneNumberData.phoneNumber !='' ? this.phoneNumberData.phoneNumber : '';         
          sc = this.phoneNumberData.countryCode != '' ?  this.phoneNumberData.countryCode: 'us'; 
          
          this.selectedCountryISO = sc.toLowerCase(); 
          var inputElementParent = document.getElementsByClassName(this.ngxInputControl);       
          let inputElement = inputElementParent[0].getElementsByTagName("input");
          inputElement[0].value = phone.replace(/[^\w]/g, "");        
        }            
        setTimeout(() => {  
                      
          var inputElementParent = document.getElementsByClassName(this.ngxInputControl);       
          let inputElement = inputElementParent[0].getElementsByTagName("input");
          let placeHolderValue = inputElement[0].placeholder;
          this.oldPlaceHolderValue = placeHolderValue;
          // console.log(placeHolderValue)           
          let placeHolderValueTrim = '';
          let placeHolderValueLen = 0 ;
          placeHolderValueTrim = placeHolderValue.replace(/[^\w]/g, "");
          placeHolderValueTrim = placeHolderValueTrim.replace(/^0+/, '');
          placeHolderValueLen = placeHolderValueTrim.length;  
          //inputElement[0].setAttribute('maxlength' , ""+placeHolderValueLen+"");          
          if(inputElement[0].value.length == 0){
            inputElement[0].value = "";
            if(this.access == 'business'){ 
              inputElement[0].setAttribute('placeholder' , "Mobile Number"); 
            }
            else if(this.access == 'landline'){ 
              inputElement[0].setAttribute('placeholder' , "Landline Number"); 
            }
            else{ 
              inputElement[0].setAttribute('placeholder' , "Phone Number"); 
            }            
          }
          
          let phoneVal = {
            countryCode: sc.toUpperCase(),
            dialCode: dial,
            e164Number: "",
            internationalNumber: "",
            nationalNumber: "",
            number: phone
          }
          this.isPhoneData.emit({ 'phoneVal': phoneVal, 'placeholderVal': placeHolderValue, 'errorVal': true, 'access':this.access }); 
          
        }, 450);
        
        if(this.ngxInputControl == 'business'){  
          this.businessForm.valueChanges.subscribe(value => { 
            // console.log(value);           
            let inputElement;
            let placeHolderValue = '';
            var inputElementParent = document.getElementsByClassName(this.ngxInputControl); 
            var type = inputElementParent[0].getElementsByTagName("input")[0].getAttribute("type") == "tel";
            inputElement = inputElementParent[0].getElementsByTagName("input");
            if(type == true){  
              placeHolderValue = inputElement[0].placeholder;
              placeHolderValue = placeHolderValue == 'Mobile Number' ? this.oldPlaceHolderValue : placeHolderValue;
            }
            else{              
              placeHolderValue = inputElement[1].placeholder; 
              placeHolderValue = placeHolderValue == 'Mobile Number' ? this.oldPlaceHolderValue : placeHolderValue; 
            }
            //console.log(placeHolderValue);
            //inputElement.mask(placeHolderValue); 
                  
            let placeHolderValueTrim = '';
            let placeHolderValueLen = 0 ;
            placeHolderValueTrim = placeHolderValue.replace(/[^\w]/g, "");
            placeHolderValueTrim = placeHolderValueTrim.replace(/^0+/, '');
            placeHolderValueLen = placeHolderValueTrim.length;  
            
            let currPhValueTrim = '';
            let currPhValueLen = 0 ;
            if(value.business != null){
              if(value.business['number'] != ''){
                currPhValueTrim = value.business['number'].replace(/[^\w]/g, "");
                currPhValueTrim = currPhValueTrim.replace(/^0+/, '');
                currPhValueLen = currPhValueTrim.length;   
              }
              else{                
                let phoneVal = {
                  countryCode: "",
                  dialCode: "",
                  e164Number: "",
                  internationalNumber: "",
                  nationalNumber: "",
                  number: ""
                }
                this.isPhoneData.emit({ 'phoneVal': phoneVal, 'placeholderVal': placeHolderValue, 'errorVal': true, 'access':this.access }); 
              }  
            }          
            else{ 
              setTimeout(() => {
                if(type == true){                 
                  inputElement[0].setAttribute('placeholder' , "Mobile Number");
                  inputElement[0].setAttribute('style' , "visibility:visible");
                }
                else{                           
                  inputElement[1].setAttribute('placeholder' , "Mobile Number");
                  inputElement[1].setAttribute('style' , "visibility:visible"); 
                }
              }, 700);    
            }
            if(currPhValueLen == placeHolderValueLen){            
              this.isPhoneData.emit({ 'phoneVal': value.business, 'placeholderVal': placeHolderValue, 'errorVal': true, 'access':this.access });   
            }
            else if(currPhValueLen > placeHolderValueLen){            
              this.isPhoneData.emit({ 'phoneVal': value.business, 'placeholderVal': placeHolderValue, 'errorVal': false, 'access':this.access });   
            }
            else{
              this.isPhoneData.emit({ 'phoneVal': value.business, 'placeholderVal': placeHolderValue, 'errorVal': true, 'access':this.access }); 
            }

          });
        }
        if(this.ngxInputControl == 'landline'){  
          this.landlineForm.valueChanges.subscribe(value => { 
            // console.log(value);           
            let inputElement;
            let placeHolderValue = '';
            var inputElementParent = document.getElementsByClassName(this.ngxInputControl); 
            var type = inputElementParent[0].getElementsByTagName("input")[0].getAttribute("type") == "tel";
            inputElement = inputElementParent[0].getElementsByTagName("input");
            if(type == true){  
              placeHolderValue = inputElement[0].placeholder;
              placeHolderValue = placeHolderValue == 'Landline Number' ? this.oldPlaceHolderValue : placeHolderValue;
            }
            else{              
              placeHolderValue = inputElement[1].placeholder; 
              placeHolderValue = placeHolderValue == 'Landline Number' ? this.oldPlaceHolderValue : placeHolderValue; 
            }
            // console.log(placeHolderValue);
            // inputElement.mask(placeHolderValue); 
                  
            let placeHolderValueTrim = '';
            let placeHolderValueLen = 0 ;
            placeHolderValueTrim = placeHolderValue.replace(/[^\w]/g, "");
            placeHolderValueTrim = placeHolderValueTrim.replace(/^0+/, '');
            placeHolderValueLen = placeHolderValueTrim.length;  
            
            let currPhValueTrim = '';
            let currPhValueLen = 0 ;
            if(value.landline != null){
              if(value.landline['number'] != ''){
                currPhValueTrim = value.landline['number'].replace(/[^\w]/g, "");
                currPhValueTrim = currPhValueTrim.replace(/^0+/, '');
                currPhValueLen = currPhValueTrim.length;   
              }
              else{
                let phoneVal = {
                  countryCode: "",
                  dialCode: "",
                  e164Number: "",
                  internationalNumber: "",
                  nationalNumber: "",
                  number: ""
                }
                this.isPhoneData.emit({ 'phoneVal': phoneVal, 'placeholderVal': placeHolderValue, 'errorVal': true, 'access':this.access }); 
              }  
            }          
            else{ 
              setTimeout(() => {
                if(type == true){                 
                  inputElement[0].setAttribute('placeholder' , "Landline Number");
                  inputElement[0].setAttribute('style' , "visibility:visible");
                }
                else{                           
                  inputElement[1].setAttribute('placeholder' , "Landline Number");
                  inputElement[1].setAttribute('style' , "visibility:visible"); 
                }
              }, 700);    
            }
            if(currPhValueLen == placeHolderValueLen){            
              this.isPhoneData.emit({ 'phoneVal': value.landline, 'placeholderVal': placeHolderValue, 'errorVal': true, 'access':this.access });   
            }
            else if(currPhValueLen > placeHolderValueLen){            
              this.isPhoneData.emit({ 'phoneVal': value.landline, 'placeholderVal': placeHolderValue, 'errorVal': false, 'access':this.access });   
            }
            else{
              this.isPhoneData.emit({ 'phoneVal': value.landline, 'placeholderVal': placeHolderValue, 'errorVal': true, 'access':this.access }); 
            }

          });
        }
        if(this.ngxInputControl == 'phone'){  
          this.phoneForm.valueChanges.subscribe(value => { 
             console.log(value);       
            let inputElement;
            let placeHolderValue = '';
            var inputElementParent = document.getElementsByClassName(this.ngxInputControl); 
            var type = inputElementParent[0].getElementsByTagName("input")[0].getAttribute("type") == "tel";
            inputElement = inputElementParent[0].getElementsByTagName("input");
            if(type == true){  
              placeHolderValue = inputElement[0].placeholder;
              placeHolderValue = placeHolderValue == 'Phone Number' ? this.oldPlaceHolderValue : placeHolderValue;
            }
            else{              
              placeHolderValue = inputElement[1].placeholder; 
              placeHolderValue = placeHolderValue == 'Phone Number' ? this.oldPlaceHolderValue : placeHolderValue; 
            }
            // console.log(placeHolderValue);
            // inputElement.mask(placeHolderValue); 
                  
            let placeHolderValueTrim = '';
            let placeHolderValueLen = 0 ;
            placeHolderValueTrim = placeHolderValue.replace(/[^\w]/g, "");
            placeHolderValueTrim = placeHolderValueTrim.replace(/^0+/, '');
            placeHolderValueLen = placeHolderValueTrim.length;  
            
            let currPhValueTrim = '';
            let currPhValueLen = 0 ;
            if(value.phone != null){
              if(value.phone['number'] != ''){
                currPhValueTrim = value.phone['number'].replace(/[^\w]/g, "");
                currPhValueTrim = currPhValueTrim.replace(/^0+/, '');
                currPhValueLen = currPhValueTrim.length;   
              }
              else{
                let phoneVal = {
                  countryCode: "",
                  dialCode: "",
                  e164Number: "",
                  internationalNumber: "",
                  nationalNumber: "",
                  number: ""
                }
                this.isPhoneData.emit({ 'phoneVal': phoneVal, 'placeholderVal': placeHolderValue, 'errorVal': true, 'access':this.access }); 
              }  
            }          
            else{ 
              setTimeout(() => {
                if(type == true){                 
                  inputElement[0].setAttribute('placeholder' , "Phone Number");
                  inputElement[0].setAttribute('style' , "visibility:visible");
                }
                else{                           
                  inputElement[1].setAttribute('placeholder' , "Phone Number");
                  inputElement[1].setAttribute('style' , "visibility:visible"); 
                }
              }, 700);    
            }
            if(currPhValueLen == placeHolderValueLen){            
              this.isPhoneData.emit({ 'phoneVal': value.phone, 'placeholderVal': placeHolderValue, 'errorVal': true, 'access':this.access });   
            }
            else if(currPhValueLen > placeHolderValueLen){            
              this.isPhoneData.emit({ 'phoneVal': value.phone, 'placeholderVal': placeHolderValue, 'errorVal': false, 'access':this.access });   
            }
            else{
              this.isPhoneData.emit({ 'phoneVal': value.phone, 'placeholderVal': placeHolderValue, 'errorVal': true, 'access':this.access }); 
            }

          });
        }
      }, 100);
    }, 0);
  }

  onCountryChange(event){   
    // console.log(event);    
    var inputElementParent = document.getElementsByClassName(this.ngxInputControl);       
    var type = inputElementParent[0].getElementsByTagName("input")[0].getAttribute("type") == "tel";
    var inputElement = inputElementParent[0].getElementsByTagName("input");
    if(type == true){ 
      //inputElement[0].setAttribute('style' , "visibility:hidden");  
    }
    else{  
      //inputElement[1].setAttribute('style' , "visibility:hidden");  
    }  

    setTimeout(() => { 
      //this.phoneForm.phone.value = '';
      let placeHolderValue = event.placeHolder;  
      this.oldPlaceHolderValue = placeHolderValue; 
      let placeHolderValueTrim = '';
      let placeHolderValueLen = 0 ;
      placeHolderValueTrim = placeHolderValue.replace(/[^\w]/g, "");
      placeHolderValueTrim = placeHolderValueTrim.replace(/^0+/, '');
      placeHolderValueLen = placeHolderValueTrim.length; 
      let phone = ''; 
      var inputElementParent = document.getElementsByClassName(this.ngxInputControl);       
      var type = inputElementParent[0].getElementsByTagName("input")[0].getAttribute("type") == "tel";
      var inputElement = inputElementParent[0].getElementsByTagName("input");
      if(type == true){  
        inputElement[0].value = phone; 
        //inputElement[0].setAttribute('maxlength' , ""+placeHolderValueLen+"");           
      }
      else{              
        inputElement[1].value = phone; 
        //inputElement[1].setAttribute('maxlength' , ""+placeHolderValueLen+"");          
      }  
      let phoneVal = {
        countryCode: "",
        dialCode: "",
        e164Number: "",
        internationalNumber: "",
        nationalNumber: "",
        number: ""
      }
      this.isPhoneData.emit({ 'phoneVal': phoneVal, 'placeholderVal': event.placeHolder, 'errorVal': true, 'access':this.access });    
    },600);
  }
  
}

