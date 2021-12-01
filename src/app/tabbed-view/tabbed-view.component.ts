import { Component, OnInit } from '@angular/core';

export class OutputData{
  labels: string[];
  values: number[];
  tabNumber: number;

  constructor(l: string[], v: number[], tN: number){
    this.labels = l;
    this.values = v;
    this.tabNumber = tN;
  }
}

@Component({
  selector: 'app-tabbed-view',
  templateUrl: './tabbed-view.component.html',
  styleUrls: ['./tabbed-view.component.css']
})
export class TabbedViewComponent implements OnInit {

  countryDataLabels : string[] = [];
  countryDataValues : number[] = [];
  displayIndex = 0;
  constructor() { }

  ngOnInit(): void {
  }

  changeTab(item: OutputData){
    this.countryDataLabels = item.labels;
    this.countryDataValues = item.values;
    this.displayIndex = item.tabNumber;
    console.log(item);
  }

  mapClick(){
    this.displayIndex = 0;
  }

}
