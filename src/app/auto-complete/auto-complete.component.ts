import { CovidcountryService, CovidData } from './../covidcountry.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatSelectionList } from '@angular/material/list';
import { OutputData } from '../tabbed-view/tabbed-view.component';

export interface Country {
  code: string;
  code3: string;
  name: string;
  number: string;
}

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit {
  @Input() populationMax : number = 0;
  @Input() gdpMin : number = 0;

  countryCtrl = new FormControl();
  filteredCountries: Observable<any[]>;
  covidData : any[];
  countryListSelected : Country[] = [];
  countryList : any[];
  

  loading: boolean = false;
  errorMessage: string;
  @ViewChild('countrySelectionList', { static: true }) countrySelectionList: MatSelectionList | undefined;
  

  constructor(private covidcountryService: CovidcountryService) { 
    this.covidData = [];
    this.errorMessage = "";
   
    
  }

  private _filterStates(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.countryList.filter(c => c.toLowerCase().includes(filterValue));
  }

  // checkCountryInList(value: Country): void {
  //   this.countryListSelected.push(value);
  //   let xx = this.countryList.filter(x => x.name == value.name)[0];
  //   this.countryList.splice(this.countryList.indexOf(xx), 1);

  //   this.countryListSelected = this.countryListSelected.slice();
  //   // for (let i = 0; i < this.countryList.length; i++) {
  //   //   const country = this.countryList[i];
  //   //   if (value == country.name)
  //   //   {
  //   //     this._checkCountry(value);
  //   //     break;
  //   //   }
  //   // }
  // }

  countryListSelectedChange(value: Country): void {
    this.countryList.push(value);
    let xx = this.countryListSelected.filter(x => x.name == value.name)[0];
    this.countryListSelected.splice(this.countryListSelected.indexOf(xx), 1);

    this.countryListSelected = this.countryListSelected.slice();
  }

  countryListChange(value: Country): void {
    this.countryListSelected.push(value);
    let xx = this.countryList.filter(x => x.name == value.name)[0];
    this.countryList.splice(this.countryList.indexOf(xx), 1);

    this.countryListSelected = this.countryListSelected.slice();
  }

  private _checkCountry(value: string): void {
    let opts = (this.countrySelectionList)?.options;
    let found = opts?.find(x => x.value ==  value);
    if (found !== null)
      found?._setSelected(true);
  }

  getCountryData(value: string): void {
    this.loading = true;
    this.covidcountryService.getCovidData(this.getCountryCode3(value))
      .subscribe(response => {
        this.covidData = response; 
    },
    (error) => {                              //error() callback
      this.loading = false;
    },
    () => {                                   //complete() callback
      this.loading = false; 
      this.filteredCountries = this.countryCtrl.valueChanges.pipe(
        startWith(''),
        map(country => (country ? this._filterStates(country) : this.countryList.slice())),
      );
    });
  }

  getCountryCode3(countryName: string): string {
    const countryCode3 = this.countryList.filter(c => c.name == countryName)[0].code3;
    return countryCode3;
  }

  private _logger(object: any): void {
    console.log('====================================');
    console.log(object);
    console.log('====================================');
  }

  ngOnInit(): void {
    this.getCountriesFiltered();
  }

  ngOnChanges(): void{
    this.getCountriesFiltered();
  }

  getCountriesFiltered(){
    this.covidcountryService.getCovidDataLatestFiltered(this.populationMax, this.gdpMin).subscribe({
      next: (v) => {
        this.loading = true;
        this.countryList = v},
      error: (e) => console.error(e),
      complete: () => this.loading = false 
  });

  }

  getCountryDataEach(value: string): void {
    this.covidcountryService.getCovidData(value)
      .subscribe(response => {
        console.log('response received');
        this.covidData = response; 
    },
    (error) => {                              //error() callback
      console.error('Request failed with error')
      // this.errorMessage = error;
    },
    () => {                                   //complete() callback
      console.log('Request completed')      //This is actually not needed 
      this.covidcountryService.logger(this.covidData);
      let newData = this.covidData.filter(x => x.date > "2021-08-01T00:00:00");
      // this.changeTab(new OutputData(
      //   newData.map(c => c.date), newData.map(c => c.newCasesPerMilion), 1
      // ));
    });
  }

  @Output() changeTabEvent = new EventEmitter<OutputData[]>();

  changeTab(value: OutputData[]) {
    this.changeTabEvent.emit(value);
    
  }

  

}


