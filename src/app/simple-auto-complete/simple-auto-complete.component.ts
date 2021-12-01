import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-simple-auto-complete',
  templateUrl: './simple-auto-complete.component.html',
  styleUrls: ['./simple-auto-complete.component.css']
})
export class SimpleAutoCompleteComponent {

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
}
