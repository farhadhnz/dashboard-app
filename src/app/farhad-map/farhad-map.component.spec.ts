import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarhadMapComponent } from './farhad-map.component';

describe('FarhadMapComponent', () => {
  let component: FarhadMapComponent;
  let fixture: ComponentFixture<FarhadMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarhadMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarhadMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
