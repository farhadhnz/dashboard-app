import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent {
  /** Based on the screen size, switch from standard to one column per row */
  private query = new BehaviorSubject({
    measures: ["Orders.count"],
    timeDimensions: [{ dimension: "Orders.createdAt", granularity: "month", dateRange: "This year" }],
    dimensions: ["Orders.status"],
    filters: [{ dimension: "Orders.status", operator: "notEquals", values: ["completed"] }]
  });

  cards = [] as any;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.query.subscribe(data => {
      this.cards[0] = {
        chart: "bar", cols: 2, rows: 1,
        query: data
      };
    });
  }
}
