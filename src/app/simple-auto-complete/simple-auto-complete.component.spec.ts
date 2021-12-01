import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleAutoCompleteComponent } from './simple-auto-complete.component';

describe('SimpleAutoCompleteComponent', () => {
  let component: SimpleAutoCompleteComponent;
  let fixture: ComponentFixture<SimpleAutoCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleAutoCompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
