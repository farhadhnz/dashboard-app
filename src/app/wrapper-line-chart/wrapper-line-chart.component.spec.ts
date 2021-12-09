import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperLineChartComponent } from './wrapper-line-chart.component';

describe('WrapperLineChartComponent', () => {
  let component: WrapperLineChartComponent;
  let fixture: ComponentFixture<WrapperLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperLineChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
