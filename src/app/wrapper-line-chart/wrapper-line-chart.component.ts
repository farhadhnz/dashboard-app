import { formatDate } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CovidcountryService } from '../covidcountry.service';
import { OutputData } from '../tabbed-view/tabbed-view.component';

@Component({
  selector: 'app-wrapper-line-chart',
  templateUrl: './wrapper-line-chart.component.html',
  styleUrls: ['./wrapper-line-chart.component.css']
})
export class WrapperLineChartComponent implements OnInit {

  @Input() metric : string;
  @Input() countryList: any;
  @Input() endDate: any;

  type = 'line';
  data : any;

  covidData: any[];
  countryData: any;
  datasets: any = [];
  chartOption: any;
  series: any = [];
  legendData: any = [];

  constructor(private covidService: CovidcountryService) { }

  initializeCharts(){
    if (this.countryList === undefined)
      return;
    
    for (let i = 0; i < this.countryList.length; i++) {
      const element = this.countryList[i];
      this.getCountryDataEach(element.name, i, this.countryList.length);
    }

    
  }

  getCountryDataEach(value: string, i: number, length: number): void {
    this.covidService.getCovidData(this.covidService.getCountryCode3(value))
      .subscribe({
        next: (response) => this.covidData = response,
        error: (e) => console.error(e),
        complete: () => {
          // let dateStart = (dateRange.controls['start'].value as Date).toISOString();                                //complete() callback
          let dateEnd = this.endDate.toISOString();
          let newData = this.covidData.sort(f => f.date).filter(x => x.date < dateEnd);
          let values = this.getValues(this.metric, newData);
          this.countryData.push(
            new OutputData(
              newData.map(x=> x.date),
              values, 
              1,
              newData.map(c => c.location)[0]
            )
          )
          this.series.push({
            data: values,
            type: 'line',
            name: newData.map(c => c.location)[0]
          });

          this.legendData.push(newData.map(c => c.location)[0])
              // this.chartOption.series.push()
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
            this.chartOption = {
              xAxis: {
                // type: 'category',
                boundaryGap: false,
                data: this.getLabels().map((d: string | number | Date) => (formatDate(d, 'dd/MM/yyyy', 'en-EN'))),
              },
              yAxis: {
                type: 'value',
              },
              legend: {
                data : this.legendData
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
              series: this.series,
            };

            this.data = {
              labels: this.getLabels().map((d: string | number | Date) => formatDate(d, 'dd/MM/yyyy', 'en-EN')),
              datasets: this.datasets
            }
            console.log(this.series);
            // console.log(this.countryList);
            // console.log(this.data);
          }
        } 
    }); 
  }

  getLabels(){
    let minLength = 5000;
    let labels = [];
    for (let i = 0; i < this.countryData.length; i++) {
      const element = this.countryData[i];
      if (element.labels.length < minLength)
      {
        minLength = element.labels.length;
        labels = element.labels;
      }
    }

    return labels;
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
    this.datasets = [];
    this.series = [];
    this.legendData = [];
    this.initializeCharts();
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
