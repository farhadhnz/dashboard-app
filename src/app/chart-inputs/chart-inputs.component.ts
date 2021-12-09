import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-chart-inputs',
  templateUrl: './chart-inputs.component.html',
  styleUrls: ['./chart-inputs.component.css']
})
export class ChartInputsComponent implements OnInit {

  verticalOptions = ['New Cases per Million', 'New Cases', 'New Deaths', 'New Deaths per Million'];
  selectedVerticalOption = 'New Cases per Million';
  pickerFrom = Date();
  pickerTo = Date();
  endDate: any;

  campaignOne: FormGroup;

  constructor() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month - 5, 1)),
      end: new FormControl(new Date(year, month, 15)),
    });
  }


  ngOnInit(): void {
    this.endDate = new Date(2021, 10, 15);
  }

}
