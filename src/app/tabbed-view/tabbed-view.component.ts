import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Country } from '../auto-complete/auto-complete.component';
import { CovidcountryService, CovidData } from '../covidcountry.service';

export class OutputData{
  labels: string[];
  values: number[];
  tabNumber: number;
  country: string;

  constructor(l: string[], v: number[], tN: number, c: string = ''){
    this.labels = l;
    this.values = v;
    this.tabNumber = tN;
    this.country = c;
  }
}

@Component({
  selector: 'app-tabbed-view',
  templateUrl: './tabbed-view.component.html',
  styleUrls: ['./tabbed-view.component.css']
})
export class TabbedViewComponent implements OnInit, OnChanges {

  @Input() countryDataInput: Country[] = [];
  @Input() metric: string = '';
  @Input() dateRange: FormGroup;
  countryData: OutputData[] = [];
  countryDataLabels: string[] = [];
  displayIndex = 0;
  covidData: any[] = [];
  generalChanges!: SimpleChanges;
  constructor(private covidService: CovidcountryService) { 
    this.dateRange = new FormGroup({
      start : new FormControl(new Date(2021, 12 - 11, 1)),
      end : new FormControl(new Date(2021, 11, 15))
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.generalChanges = changes;
    this.lineChartClick();
  }

  ngOnInit(): void {
  }

  changeTab(data: OutputData[]){

    this.countryDataInput = [];
    this.countryDataInput.push(this.covidService.getCountryList().filter(f => f.name == data[0].country)[0]);
    // this.countryData = [];
    // this.countryData.push(new OutputData(data[0].labels, data[0].values, data[0].tabNumber));
    // this.lineChartClick();
    // for (let i = 0; i < data.length; i++) {
    //   const element = data[i];
    //   this.countryData[i] = 
    //   new OutputData(element.labels, element.values, element.tabNumber);
    //   // this.countryDataLabels = element.labels;

    // }
    // // this.countryDataValues = item.values;
    this.displayIndex = data[0].tabNumber;
    
  }

  selectedTabChanged(){
    if (this.displayIndex == 1)
    {
      this.lineChartClick();
    }
    else if (this.displayIndex == 0)
      this.mapClick();
  }

  mapClick(){
    this.displayIndex = 0;
  }

  lineChartClick(){
    
    if (this.generalChanges['dateRange'] !== undefined &&
        this.generalChanges['dateRange'].currentValue !== 
        this.generalChanges['dateRange'].previousValue)
      {
          this.countryData = [];
          for (let i = 0; i < this.countryDataInput.length; i++) {
            const element = this.countryDataInput[i];
            // if (this.countryData.some(f => f.country === element))
            // {
            //   continue;
            // }
    
            this.getCountryDataEach(element.name, this.metric, this.dateRange);
        }
      }

    if (this.generalChanges['metric'] !== undefined &&
        this.generalChanges['metric'].currentValue !== 
        this.generalChanges['metric'].previousValue)
    {
      this.countryData = [];
      for (let i = 0; i < this.countryDataInput.length; i++) {
        const element = this.countryDataInput[i];
        // if (this.countryData.some(f => f.country === element))
        // {
        //   continue;
        // }

        this.getCountryDataEach(element.name, this.metric, this.dateRange);
      }
    }
    else
    {
      // this.countryData = [];
      this.displayIndex = 1;
      // get selected list from autocomplete
      let arr1 = this.countryData.map(x => x.country);
      let arr2 = this.countryDataInput.map(x => x.name);
      let difference = arr1.filter(x => !arr2.includes(x));
      if (difference.length > 0)
      {
        for (let i = 0; i < difference.length; i++) {
          const element = difference[i];
          let xx = this.countryData.filter(x => x.country == element)[0];
          this.countryData.splice(this.countryData.indexOf(xx));
        }
      }
      // const toFindDuplicates = (arr: any[]) => arr.filter((item, index) => arr.indexOf(item) !== index);
      // let duplicates = toFindDuplicates(this.countryDataInput);

      // for (let i = 0; i < duplicates.length; i++) {
      //   const element = duplicates[i];
      //   this.countryDataInput.splice(element, 1);
      // }

      for (let i = 0; i < this.countryDataInput.length; i++) {
        const element = this.countryDataInput[i];

        if (this.countryData.some(f => f.country === element.name))
        {
          continue;
        }

        this.getCountryDataEach(element.name, this.metric, this.dateRange);
      }
    }
    
  }

  getCountryDataEach(value: string, vertData: string, dateRange: FormGroup): void {
    console.log(value);
    this.covidService.getCovidData(this.covidService.getCountryCode3(value))
      .subscribe(response => {
        console.log('response received');
        this.covidData = response; 
        console.log(response);
    },
    (error) => {                              //error() callback
      console.error('Request failed with error')
      // this.errorMessage = error;
    },
    () => {   
      let dateStart = (dateRange.controls['start'].value as Date).toISOString();                                //complete() callback
      let dateEnd = (dateRange.controls['end'].value as Date).toISOString();
      let newData = this.covidData.filter(x => x.date > dateStart && x.date < dateEnd);
      console.log(dateStart);
      console.log(dateEnd);

      let values = this.getValues(vertData, newData);
      this.countryData.push(new OutputData(newData.map(c => c.date), 
                                           values, 1, 
                                           newData.map(c => c.location)[0]));
      this.countryData = this.countryData.slice();
      // this.changeTab(new OutputData(
      //   newData.map(c => c.date), newData.map(c => c.newCasesPerMilion), 1
      // ));
    });
  }
  getValues(vertData: string, newData: any[]) : number[] {
    switch (vertData) {
      case 'New Cases per Million':
        return newData.map(x => x.newCasesPerMilion);
      case 'New Cases':
          return newData.map(x => x.newCases);
      case 'New Deaths per Million':
        return newData.map(x => x.newDeathsPerMilion);
      case 'New Deaths':
        return newData.map(x => x.newDeaths);
      default:
        return newData.map(x => x.newCasesPerMilion);
    }
  }

}
