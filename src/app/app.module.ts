import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HighchartsChartModule } from "highcharts-angular";
import { CountriesMapModule } from 'countries-map';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { ChartModule } from 'angular2-chartjs';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapChartComponent } from './map-chart/map-chart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { TabbedViewComponent } from './tabbed-view/tabbed-view.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PredictionComponent } from './prediction/prediction.component';
import { SimpleAutoCompleteComponent } from './simple-auto-complete/simple-auto-complete.component';

@NgModule({
  declarations: [
    AppComponent,
    MapChartComponent,
    AutoCompleteComponent,
    TabbedViewComponent,
    LineChartComponent,
    PredictionComponent,
    SimpleAutoCompleteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HighchartsChartModule,
    CountriesMapModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
    ChartModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
