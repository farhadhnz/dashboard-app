import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartInputsComponent } from './chart-inputs.component';

describe('ChartInputsComponent', () => {
  let component: ChartInputsComponent;
  let fixture: ComponentFixture<ChartInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
