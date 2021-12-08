import { CovidcountryService, CovidData } from './../covidcountry.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CountriesData, ChartSelectEvent, ChartErrorEvent, CountryData } from 'countries-map';
import { OutputData } from '../tabbed-view/tabbed-view.component';



@Component({
  selector: 'app-map-chart',
  templateUrl: './map-chart.component.html',
  styleUrls: ['./map-chart.component.css']
})
export class MapChartComponent implements OnInit {

  chartConstructor = "mapChart";
  chartData = [{ code3: "ABW", z: 105 }, { code3: "AFG", z: 35530 }];
  updateFlag = false;

  public mapData : CountriesData = {};
  loading: boolean = false;
  updatedData: CovidData[] = [];
  covidData: any[] = [];
  loading2: boolean = false;

  getCountryData(): void {
    this.loading = true;
    this.covidcountryService.getCovidDataLatest()
      .subscribe(response => {
        console.log('map response received');
        this.updatedData = response; 
    },
    (error) => {                              //error() callback
      console.error('Request failed with error')
      // this.errorMessage = error;
      this.loading = false;
    },
    () => {                                   //complete() callback
      console.log('map request completed')      //This is actually not needed 
      // this._logger(this.covidData);
      this.loading = false; 
      // console.log(this.updatedData);
      this.updateData();
      console.log(this.mapData);
    });
  }

  updateData() {
    let countriesData: CountriesData = {};
    let code2 = ''; 
    let cd: CountryData;
    for (let i = 0; i < this.updatedData.length; i++) {
      const element = this.updatedData[i];
      // console.log(element.location);
      code2 = this.covidcountryService.getCountryCode2ByCode3(element.isoCode);
      // if (code2 === "" || element.newDeaths < 0 || element.newCases > 5000)
      if (code2 === "" || element.newDeaths < 0)
      {
        continue;
      }
      cd = { value: element.newCasesPerMilion };
      countriesData[code2] = cd;
    }

    this.mapData = countriesData;
  }

  errorLoading = null;
  mapError(error: ChartErrorEvent): void {
    // this.errorLoading = error;
  }
  mapReady(): void {
    console.log('Map ready');
  }

  select(event: ChartSelectEvent){
    console.log(event);
    let code3 = this.covidcountryService.getCountryCode3ByCode2(event.country);
    this.getCountryDataEach(code3);
  }

  getCountryDataEach(value: string): void {
    this.loading2 = true;
    this.covidcountryService.getCovidData(value)
      .subscribe(response => {
        console.log('response received');
        this.covidData = response; 
    },
    (error) => {                              //error() callback
      console.error('Request failed with error')
      // this.errorMessage = error;
      this.loading2 = false;
    },
    () => {                                   //complete() callback
      console.log('Request completed')      //This is actually not needed 
      this.covidcountryService.logger(this.covidData);
      let newData = this.covidData.filter(x => x.date > "2021-08-01T00:00:00");

      let listOutputData : OutputData[] = [];
      listOutputData.push(new OutputData(
        newData.map(c => c.date), newData.map(c => c.newCasesPerMilion), 1, newData[0].location
      ));
      
      this.changeTabPV(listOutputData);
      this.loading2 = false; 
    });
  }

  @Output() changeTabEvent = new EventEmitter<OutputData[]>();

  changeTabPV(value: OutputData[]) {
    this.changeTabEvent.emit(value);
    
  }

  constructor(private covidcountryService: CovidcountryService) { }

  ngOnInit(): void {
    this.getCountryData();
  }

}


// class CountryData implements CountriesData{
//   [countryCode: string]: import("countries-map").CountryData;

// }
