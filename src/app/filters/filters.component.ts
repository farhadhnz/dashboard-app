import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  formatLabel(value: number) {
    if (value >= 1000000) {
      return Math.round(value / 1000000) + 'M';
    }

    return value;
  }

  formatLabelGdp(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
