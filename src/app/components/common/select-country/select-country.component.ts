import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-country',
  templateUrl: './select-country.component.html',
  styleUrls: ['./select-country.component.scss']
})
export class SelectCountryComponent implements OnInit {

  @Input() countryInfo;   
  @Output() selectResponce: EventEmitter<any> = new EventEmitter();
    
  public submitted :boolean = false;
  public loading: boolean = false;
  public countries;
  public selectedCountry: string ='';
  public countryId = '';
  public countryName = '';
  public continueButtonEnable: boolean = false;

  constructor(   
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {      
      this.loading = true;  
      this.selectedCountry = '';
      this.countries = this.countryInfo;
      console.log( this.countries);
      localStorage.setItem('countryId', this.countryId);
      localStorage.setItem('countryName', this.countryName);
  }

  onSelectedCountry(event){
    this.continueButtonEnable = (event) ? true : false;
    console.log(event.value.name);
    console.log(event.value.id);
    console.log(this.selectedCountry);
    this.countryId  = event.value.id;
    this.countryName  = event.value.name;
  }

  continueButton(){  
    if(this.continueButtonEnable){      
      localStorage.setItem('countryId', this.countryId);
      localStorage.setItem('countryName', this.countryName);
      let data = {
        'countryId' : this.countryId,
        'countryName' : this.countryName
      }
      this.selectResponce.emit(data); 
    }
  }

}



