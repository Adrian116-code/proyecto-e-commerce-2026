import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesDelPedido } from './detalles-del-pedido';

describe('DetallesDelPedido', () => {
  let component: DetallesDelPedido;
  let fixture: ComponentFixture<DetallesDelPedido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesDelPedido]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesDelPedido);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
