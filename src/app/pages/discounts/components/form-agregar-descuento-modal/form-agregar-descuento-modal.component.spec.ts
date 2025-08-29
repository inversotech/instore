import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAgregarDescuentoModalComponent } from './form-agregar-descuento-modal.component';

describe('FormAgregarDescuentoModalComponent', () => {
  let component: FormAgregarDescuentoModalComponent;
  let fixture: ComponentFixture<FormAgregarDescuentoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAgregarDescuentoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAgregarDescuentoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
