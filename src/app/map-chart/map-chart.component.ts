import { CovidcountryService, CovidData } from './../covidcountry.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CountriesData, ChartSelectEvent, ChartErrorEvent, CountryData } from 'countries-map';
import { OutputData } from '../tabbed-view/tabbed-view.component';

@Component({
  selector: 'app-map-chart',
  templateUrl: './map-chart.component.html',
  styleUrls: ['./map-chart.component.css']
})
export class MapChartComponent implements OnInit {

  @Input() populationMax : number = 0;
  @Input() gdpMin : number = 0;
  @Input() metric : string;
  @Input() endDate: any;

  chartConstructor = "mapChart";
  chartData : any[] = [];
  updateFlag = false;

  public mapData : CountriesData = {};
  loading: boolean = false;
  updatedData: any[] = [];
  covidData: any[] = [];
  loading2: boolean = false;

  getCountryData(populationMax: number, gdpMin: number): void {
    this.loading = true;
    this.covidcountryService.getCovidDataLatestFiltered(populationMax, gdpMin)
      .subscribe(response => {
        this.updatedData = response; 
    },
    (error) => {                              //error() callback
      // this.loading = false;
    },
    () => {                                   //complete() callback
      // this.loading = false; 
      console.log(this.updatedData);
    });
  }

  getCountryDataLatest(): void {
    this.loading = true;
    this.covidcountryService.getCovidDataLatest((this.endDate as Date).toISOString())
      .subscribe(response => {
        this.chartData = response;  
    },
    (error) => {    
      this.loading = false; 
    },
    () => {  
      this.chartData = this.chartData.filter(n => n !== null);
      this.updateData();
      this.loading = false;

    });
  }

  updateData() {
    let countriesData: CountriesData = {};
    let code2 = ''; 
    let cd: CountryData;
    for (let i = 0; i < this.updatedData.length; i++) {
      const element = this.updatedData[i];
      let vv = this.chartData.filter(x => x.location == element.name)[0];
      code2 = this.covidcountryService.getCountryCode2(element.name);

      if (code2 === "" || vv == undefined || vv.newDeaths < 0)
      {
        continue;
      }
      let par = this.getParameter();
      cd = { value: vv[par] };
      countriesData[code2] = cd;
    }

    this.mapData = countriesData;
  }

  getParameter(){
    switch (this.metric) {
      case "New Cases per Million":
        return 'newCasesPerMilion';
      case "New Cases":
        return 'newCasesPerMilion';
      case "New Deaths":
        return 'newDeaths';
      case "New Deaths per Million":
        return 'newDeathsPerMilion';
      default:
        return 'newCasesPerMilion';
    }
  }

  errorLoading: any = null;
  mapError(error: ChartErrorEvent): void {
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

  ngOnChanges(): void {
    this.getCountryData(this.populationMax, this.gdpMin);
    this.getCountryDataLatest();
    // this.updateData();
  }

  ngOnInit(): void {
    this.getCountryData(this.populationMax, this.gdpMin);
    this.getCountryDataLatest();
    // this.updateData();
  }

}


// class CountryData implements CountriesData{
//   [countryCode: string]: import("countries-map").CountryData;

// }
