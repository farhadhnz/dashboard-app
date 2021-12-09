import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { formatDate } from '@angular/common';
import { OutputData } from '../tabbed-view/tabbed-view.component';
import { CovidcountryService } from '../covidcountry.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, OnChanges {

  @Input() dataLabels : string[] = [];
  @Input() dataValues : number[] = [];
  @Input() dataValuesCountry : OutputData[] = [];
  
  @Input() metric : string;
  @Input() countryList: any;
  @Input() endDate: any;


  @Input() dataLabelsPredict : string[] = [];
  @Input() dataValuesPredict : number[] = [];
  type = 'line';
  data : any;

options = {
  legend: {
    display: true
},
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [{ display: true,
                gridLines: {
                    display:true
                }
            }],
    yAxes: [{
                display: true,
                gridLines: {
                    display:true
                }   
            }]
}
}
  covidData: any[];
  countryData: any;
  datasets: any = [];

  constructor(private covidService: CovidcountryService) { }

  initializeCharts(){
    if (this.countryList === undefined)
      return;
    
    for (let i = 0; i < this.countryList.length; i++) {
      const element = this.countryList[i];
      this.getCountryDataEach(element.name, i, this.countryList.length);
    }

    // if (this.countryList.length > 0)
    // {
    //   this.data = {
    //     labels: this.countryData[0].labels.map((d: string | number | Date) => formatDate(d, 'dd/MM/yyyy', 'en-EN')),
    //     datasets: this.getDataSets()
    //   }
    // };
  }

  getCountryDataEach(value: string, i: number, length: number): void {
    this.covidService.getCovidData(this.covidService.getCountryCode3(value))
      .subscribe({
        next: (response) => this.covidData = response,
        error: (e) => console.error(e),
        complete: () => {
          // let dateStart = (dateRange.controls['start'].value as Date).toISOString();                                //complete() callback
          let dateEnd = this.endDate.toISOString();
          let newData = this.covidData.filter(x => x.date > '08-08-2021T00:00:00' && x.date < dateEnd);
          let values = this.getValues(this.metric, newData);

          this.datasets.push(
            {
              borderColor: this.getRandomColor(), //line color
              pointRadius:0,
              label: newData.map(c => c.location)[0],
              fill:false,
              borderWidth: 2,
              data: values
            }
          )
          if (length = i - 1)
          {
            this.data = {
              labels: newData.map(x => x.date).map((d: string | number | Date) => formatDate(d, 'dd/MM/yyyy', 'en-EN')),
              datasets: this.datasets
            }
          }
          // this.countryData.push(new OutputData(newData.map(c => c.date), 
          //                                  values, 1, 
          //                                  newData.map(c => c.location)[0]));
          // this.countryData = this.countryData.slice();
        } 
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

  ngOnChanges(changes: SimpleChanges) {
    this.countryData = [];
    this.initializeCharts();
    // if (this.dataValuesPredict.length > 0)
    // {
    //   let alllabels = this.dataLabels.concat(this.dataLabelsPredict);
    //   this.data = {
    //     labels: alllabels.map(d => formatDate(d, 'dd/MM/yyyy', 'en-EN')),
    //     datasets: [
    //       {
    //         borderColor: 'blue', //line color
    //         pointRadius:1,
    //         pointBorderColor: 'red',
    //         pointBackgroundColor:'white',
    //         label: "New Cases",
    //         fill:false,
    //         borderWidth: 2,
    //         data: this.dataValues.concat(this.dataValuesPredict)
    //       }
    //       // ,
    //       // {
    //       //   borderColor: 'red', //line color
    //       //   pointRadius:1,
    //       //   pointBorderColor: 'blue',
    //       //   pointBackgroundColor:'white',
    //       //   label: "New Cases Predicted",
    //       //   fill:false,
    //       //   borderWidth: 2,
    //       //   data: this.dataValuesPredict
    //       // }
    //     ]
    //   };
    // }
    // else
    // {
    //   if (this.countryList.length > 0)
    //   {
    //     this.data = {
    //       labels: this.countryData[0].labels.map((d: string | number | Date) => formatDate(d, 'dd/MM/yyyy', 'en-EN')),
    //       datasets: this.getDataSets()
    //     }
    //   };
    // }
    
  }

  getDataSets(){
    let datasets = [];
    for (let i = 0; i < this.countryData.length; i++) {
      const element = this.countryData[i];
      datasets.push(
        {
          borderColor: this.getRandomColor(), //line color
          pointRadius:0,
          label: element.country,
          fill:false,
          borderWidth: 2,
          data: element.values
        }
      )
    }
    return datasets;
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  ngOnInit(): void {
    this.initializeCharts();
  }

}
