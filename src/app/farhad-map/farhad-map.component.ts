
import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import * as Highcharts from 'highcharts/highmaps';
import * as  worldMap from "@highcharts/map-collection/custom/world.geo.json";
import { OutputData } from '../tabbed-view/tabbed-view.component';
import { CovidcountryService } from '../covidcountry.service';



@Component({
  selector: 'app-farhad-map',
  templateUrl: './farhad-map.component.html',
  styleUrls: ['./farhad-map.component.css']
})
export class FarhadMapComponent {
  @Input() populationMax : number = 0;
  @Input() gdpMin : number = 0;
  @Input() metric : string;
  @Input() endDate: any;
  
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor = "mapChart";
  // chartData = [{ code3: "ABW", z: 105 }, { code3: "AFG", z: 35530 }];

  chartData : any[] = [];
  updateFlag = false;

  mapData : ([string, number])[] = [];
  loading: boolean = false;
  updatedData: any[] = [];
  covidData: any[] = [];
  loading2: boolean = false;
  chartOptions: Highcharts.Options;

  getCountryData(populationMax: number, gdpMin: number): void {
    this.loading = true;
    this.covidcountryService.getCovidDataLatestFiltered(populationMax, gdpMin)
      .subscribe( response => {
        this.updatedData = response; 
    },
    (error) => {                              //error() callback
      // this.loading = false;
    },
    () => {                                   //complete() callback
      // this.loading = false; 
    });
  }

  getCountryDataLatest(): void {
    this.loading = true;
    this.covidcountryService.getCovidDataLatest((this.endDate as Date).toISOString())
      .subscribe(response => {
        this.chartData = response;  
    },
    (error) => {    
      this.loading = false; 
    },
    () => {  
      this.chartData = this.chartData.filter(n => n !== null);
      this.updateData();
      this.loading = false;

    });
  }

  updateData() {
    let countriesData: ([string, number])[] = [];
    let code2 = ''; 
    let cd;
    for (let i = 0; i < this.updatedData.length; i++) {
      const element = this.updatedData[i];
      let vv = this.chartData.filter(x => x.location == element.name)[0];
      code2 = this.covidcountryService.getCountryCode2(element.name).toLowerCase();

      if (code2 === "" || vv == undefined || vv.newDeaths < 0)
      {
        continue;
      }
      let par = this.getParameter();
      cd = vv[par];
      countriesData.push([code2 , cd])
    }
    
    for (let i = 0; i < this.listCountry.length; i++) {
      const element = this.listCountry[i];
      if (!countriesData.some(x => x[0] == element[0]))
      {
        countriesData.push([element[0].toString(), null])
      }
      
    }
    
    this.mapData = countriesData;

    this.chartOptions = {
      chart: {
        map: worldMap
      },
      title: {
        text: "Covid World Data"
      },
      plotOptions: {
        area: {
          color: '#beb697',
        },
      },
      subtitle: {
        text:
          'Source map: <a href="http://code.highcharts.com/mapdata/custom/world.js">World, Miller projection, medium resolution</a>'
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          alignTo: "spacingBox"
        }
      },
      legend: {
        enabled: true
      },
      colorAxis: {
        // maxColor: 'red',
        // minColor: 'yellow',
      },
      series: [
        {
          // point: {
          //   events: {
          //       select: function() {
                  
          //       }.bind(this.select())
          //     },
          //   },
          type: "map",
          name: this.metric,
          nullColor: 'gray',
          states: {
            select: {
              
            },
            hover: {
              color: "#BADA55"
            }
          },
          dataLabels: {
            enabled: true,
            format: ""
          },
          allAreas: false,
          data: this.mapData
        }
      ]
    };
      console.log(this.mapData);
    // this.chartOptions.series[0].mapData = this.mapData;
  }

  listCountry =[
    ["fo", 0],
    ["um", 1],
    ["us", 2],
    ["jp", 3],
    ["sc", 4],
    ["in", 5],
    ["fr", 6],
    ["fm", 7],
    ["cn", 8],
    ["pt", 9],
    ["sw", 10],
    ["sh", 11],
    ["br", 12],
    ["ki", 13],
    ["ph", 14],
    ["mx", 15],
    ["es", 16],
    ["bu", 17],
    ["mv", 18],
    ["sp", 19],
    ["gb", 20],
    ["gr", 21],
    ["as", 22],
    ["dk", 23],
    ["gl", 24],
    ["gu", 25],
    ["mp", 26],
    ["pr", 27],
    ["vi", 28],
    ["ca", 29],
    ["st", 30],
    ["cv", 31],
    ["dm", 32],
    ["nl", 33],
    ["jm", 34],
    ["ws", 35],
    ["om", 36],
    ["vc", 37],
    ["tr", 38],
    ["bd", 39],
    ["lc", 40],
    ["nr", 41],
    ["no", 42],
    ["kn", 43],
    ["bh", 44],
    ["to", 45],
    ["fi", 46],
    ["id", 47],
    ["mu", 48],
    ["se", 49],
    ["tt", 50],
    ["my", 51],
    ["pa", 52],
    ["pw", 53],
    ["tv", 54],
    ["mh", 55],
    ["cl", 56],
    ["th", 57],
    ["gd", 58],
    ["ee", 59],
    ["ag", 60],
    ["tw", 61],
    ["bb", 62],
    ["it", 63],
    ["mt", 64],
    ["vu", 65],
    ["sg", 66],
    ["cy", 67],
    ["lk", 68],
    ["km", 69],
    ["fj", 70],
    ["ru", 71],
    ["va", 72],
    ["sm", 73],
    ["kz", 74],
    ["az", 75],
    ["tj", 76],
    ["ls", 77],
    ["uz", 78],
    ["ma", 79],
    ["co", 80],
    ["tl", 81],
    ["tz", 82],
    ["ar", 83],
    ["sa", 84],
    ["pk", 85],
    ["ye", 86],
    ["ae", 87],
    ["ke", 88],
    ["pe", 89],
    ["do", 90],
    ["ht", 91],
    ["pg", 92],
    ["ao", 93],
    ["kh", 94],
    ["vn", 95],
    ["mz", 96],
    ["cr", 97],
    ["bj", 98],
    ["ng", 99],
    ["ir", 100],
    ["sv", 101],
    ["sl", 102],
    ["gw", 103],
    ["hr", 104],
    ["bz", 105],
    ["za", 106],
    ["cf", 107],
    ["sd", 108],
    ["cd", 109],
    ["kw", 110],
    ["de", 111],
    ["be", 112],
    ["ie", 113],
    ["kp", 114],
    ["kr", 115],
    ["gy", 116],
    ["hn", 117],
    ["mm", 118],
    ["ga", 119],
    ["gq", 120],
    ["ni", 121],
    ["lv", 122],
    ["ug", 123],
    ["mw", 124],
    ["am", 125],
    ["sx", 126],
    ["tm", 127],
    ["zm", 128],
    ["nc", 129],
    ["mr", 130],
    ["dz", 131],
    ["lt", 132],
    ["et", 133],
    ["er", 134],
    ["gh", 135],
    ["si", 136],
    ["gt", 137],
    ["ba", 138],
    ["jo", 139],
    ["sy", 140],
    ["mc", 141],
    ["al", 142],
    ["uy", 143],
    ["cnm", 144],
    ["mn", 145],
    ["rw", 146],
    ["so", 147],
    ["bo", 148],
    ["cm", 149],
    ["cg", 150],
    ["eh", 151],
    ["rs", 152],
    ["me", 153],
    ["tg", 154],
    ["la", 155],
    ["af", 156],
    ["ua", 157],
    ["sk", 158],
    ["jk", 159],
    ["bg", 160],
    ["qa", 161],
    ["li", 162],
    ["at", 163],
    ["sz", 164],
    ["hu", 165],
    ["ro", 166],
    ["ne", 167],
    ["lu", 168],
    ["ad", 169],
    ["ci", 170],
    ["lr", 171],
    ["bn", 172],
    ["iq", 173],
    ["ge", 174],
    ["gm", 175],
    ["ch", 176],
    ["td", 177],
    ["kv", 178],
    ["lb", 179],
    ["dj", 180],
    ["bi", 181],
    ["sr", 182],
    ["il", 183],
    ["ml", 184],
    ["sn", 185],
    ["gn", 186],
    ["zw", 187],
    ["pl", 188],
    ["mk", 189],
    ["py", 190],
    ["by", 191],
    ["cz", 192],
    ["bf", 193],
    ["na", 194],
    ["ly", 195],
    ["tn", 196],
    ["bt", 197],
    ["md", 198],
    ["ss", 199],
    ["bw", 200],
    ["bs", 201],
    ["nz", 202],
    ["cu", 203],
    ["ec", 204],
    ["au", 205],
    ["ve", 206],
    ["sb", 207],
    ["mg", 208],
    ["is", 209],
    ["eg", 210],
    ["kg", 211],
    ["np", 212]
  ];

  getParameter(){
    switch (this.metric) {
      case "New Cases per Million":
        return 'newCasesPerMilion';
      case "New Cases":
        return 'newCasesPerMilion';
      case "New Deaths":
        return 'newDeaths';
      case "New Deaths per Million":
        return 'newDeathsPerMilion';
      default:
        return 'newCasesPerMilion';
    }
  }

  select(value: string){
    console.log(value);
    let code3 = this.covidcountryService.getCountryCode3ByCode2(value);
    this.getCountryDataEach(code3);
  }

  getCountryDataEach(value: string): void {
    this.loading2 = true;
    this.covidcountryService.getCovidData(value)
      .subscribe(response => {
        console.log('response received');
        this.covidData = response; 
    },
    (error) => {                              //error() callback
      console.error('Request failed with error')
      this.loading2 = false;
    },
    () => {                                   //complete() callback
      console.log('Request completed')      //This is actually not needed 
      this.covidcountryService.logger(this.covidData);
      let newData = this.covidData.filter(x => x.date > "2021-08-01T00:00:00");

      let listOutputData : OutputData[] = [];
      listOutputData.push(new OutputData(
        newData.map(c => c.date), newData.map(c => c.newCasesPerMilion), 1, newData[0].location
      ));
      
      this.changeTabPV(listOutputData);
      this.loading2 = false; 
    });
  }

  @Output() changeTabEvent = new EventEmitter<OutputData[]>();

  changeTabPV(value: OutputData[]) {
    this.changeTabEvent.emit(value);
    
  }

  constructor(private covidcountryService: CovidcountryService) { }

  ngOnChanges(): void {
    this.getCountryData(this.populationMax, this.gdpMin);
    this.getCountryDataLatest();
    // this.updateData();
  }

  ngOnInit(): void {
    this.getCountryData(this.populationMax, this.gdpMin);
    this.getCountryDataLatest();
    // this.updateData();
  }
  
  
  
 
}