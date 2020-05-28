import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailEntregaComponent } from './dialog-detail-entrega.component';

describe('DialogDetailEntregaComponent', () => {
  let component: DialogDetailEntregaComponent;
  let fixture: ComponentFixture<DialogDetailEntregaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDetailEntregaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetailEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
