import { Component, Input, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  @Input() dataLabels : string[] = [];
  @Input() dataValues : number[] = [];

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

  ngOnChanges() {

    if (this.dataValuesPredict)
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
      this.data = {
        labels: this.dataLabels.map(d => formatDate(d, 'dd/MM/yyyy', 'en-EN')),
        datasets: [
          {
            borderColor: 'blue', //line color
            pointRadius:1,
            pointBorderColor: 'red',
            pointBackgroundColor:'white',
            label: "New Cases",
            fill:false,
            borderWidth: 2,
            data: this.dataValues
          }
        ]
      };
    }
    
  }

  ngOnInit(): void {

    // while (!this.dataValues || this.dataValues.length < 1)
    // {
      
    // }

    
    
  }

}
