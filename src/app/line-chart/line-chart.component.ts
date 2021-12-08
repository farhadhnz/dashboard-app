import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { formatDate } from '@angular/common';
import { OutputData } from '../tabbed-view/tabbed-view.component';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, OnChanges {

  @Input() dataLabels : string[] = [];
  @Input() dataValues : number[] = [];
  @Input() dataValuesCountry : OutputData[] = [];

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

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (this.dataValuesPredict.length > 0)
    {
      let alllabels = this.dataLabels.concat(this.dataLabelsPredict);
      this.data = {
        labels: alllabels.map(d => formatDate(d, 'dd/MM/yyyy', 'en-EN')),
        datasets: [
          {
            borderColor: 'blue', //line color
            pointRadius:1,
            pointBorderColor: 'red',
            pointBackgroundColor:'white',
            label: "New Cases",
            fill:false,
            borderWidth: 2,
            data: this.dataValues.concat(this.dataValuesPredict)
          }
          // ,
          // {
          //   borderColor: 'red', //line color
          //   pointRadius:1,
          //   pointBorderColor: 'blue',
          //   pointBackgroundColor:'white',
          //   label: "New Cases Predicted",
          //   fill:false,
          //   borderWidth: 2,
          //   data: this.dataValuesPredict
          // }
        ]
      };
    }
    else
    {
      if (this.dataValuesCountry .length > 0)
      {
        this.data = {
          labels: this.dataValuesCountry[0].labels.map(d => formatDate(d, 'dd/MM/yyyy', 'en-EN')),
          datasets: this.getDataSets()
        }
      };
    }
    
  }

  getDataSets(){
    let datasets = [];
    for (let i = 0; i < this.dataValuesCountry.length; i++) {
      const element = this.dataValuesCountry[i];
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

    // while (!this.dataValues || this.dataValues.length < 1)
    // {
      
    // }

    
    
  }

}
