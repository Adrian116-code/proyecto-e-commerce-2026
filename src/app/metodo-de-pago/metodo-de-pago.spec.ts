import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodoDePago } from './metodo-de-pago';

describe('MetodoDePago', () => {
  let component: MetodoDePago;
  let fixture: ComponentFixture<MetodoDePago>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetodoDePago]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetodoDePago);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
