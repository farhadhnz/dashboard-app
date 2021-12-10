import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CovidcountryService } from '../covidcountry.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {

  countryDataLabels : string[] = [];
  countryDataValues : number[] = [];
  countryDataValuesPrediction : number[] = [];
  countryDataLabelsPrediction : string[] = [];
  strIndex: number = 50;
  populationDensity: number = 1;
  gdpPerCapita: number = 1;
  diabetesPrevalence: number = 1;
  lifeExpectancy: number = 1;
  smokers: number = 1;
  hospitalBedsPerThousand: number = 1;
  airPollutionIndex: number = 1;
  country: string = '';
  variableList : number[] = [];
  predictionData: any;
  covidData: any[] = [];
  listItems: any = [];
  variables = [ ["population", "Population"], ["population_density", "Population Density"], ["gdp_per_capita", "GDP per Capita"], 
                ["cardiovasc_death_rate", "Cardiovascular Death Rate"], ["diabetes_prevalence", "Diabetes Prevalence"], 
                ["life_expectancy", "Life Expectancy"], ["human_development_index", "Human Development Index"], ["smokers", "Smokers"], 
                ["AirPolutioIndex", "Air Polution Index"]
              ];
  chartOption: any = {};
  loading: boolean = true;
  constructor(private service: CovidcountryService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.chartOption = null;
    this.loading = true;
    let newVariables = [Number(this.populationDensity), Number(this.gdpPerCapita), Number(this.diabetesPrevalence), 
      Number(this.lifeExpectancy), Number(this.smokers), Number(this.hospitalBedsPerThousand), Number(this.airPollutionIndex)];
    this.service.getPrediction(this.strIndex, this.country, newVariables)
      .subscribe(response => {
        this.predictionData = response; 
    },
    (error) => {                              //error() callback
      console.error('Request failed with error')
      // this.errorMessage = error;
      // this.loading2 = false;
    },
    () => {                                   //complete() callback
      this.listItems = this.predictionData;
      this.countryDataValuesPrediction = this.predictionData;
    });

    this.service.getCovidData(this.service.getCountryCode3(this.country))
      .subscribe(response => {
        this.covidData = response; 
    },
    (error) => {                              //error() callback
      console.error('Request failed with error')
      // this.errorMessage = error;
      // this.loading2 = false;
    },
    () => {                                   //complete() callback
      let newData = this.covidData.filter(x => x.date > "2021-08-01T00:00:00");
      this.countryDataValues = newData.map(c => c.newCasesPerMilion);
      this.countryDataLabels = newData.map(c => c.date);
      this.countryDataLabelsPrediction = this.createNextDates();

      console.log(this.countryDataValues.concat(this.countryDataValuesPrediction));
      this.chartOption = {
        xAxis: {
          // type: 'category',
          boundaryGap: false,
          data: this.countryDataLabels.concat(this.countryDataLabelsPrediction).map((d: string | number | Date) => (formatDate(d, 'dd/MM/yyyy', 'en-EN'))),
        },
        yAxis: {
          type: 'value',
        },
        legend: {
          data : [this.country]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        series: [{
          data: this.countryDataValues.concat(this.countryDataValuesPrediction),
          type: 'line',
          name: this.country
        }],
      };
      // this.loading = false;
    });
  }

  createNextDates(): string[] {
    let lastDateStr = this.countryDataLabels[this.countryDataLabels.length - 1];
    let lastDate = new Date(lastDateStr);
    let dateList : string[] = [];
    for (let i = 0; i < this.countryDataValuesPrediction.length; i++) {
      let nextDateStr = this.getNextDate(lastDate).toDateString();
      dateList[i] = nextDateStr;
      lastDate = this.getNextDate(lastDate);
    }
    return dateList;
  }

  getNextDate(date: Date): Date {
    let nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate;
  }

  // ngOnChange(){
  //   this.listItems = this.predictionData;
  // }

}


