import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaObjetos } from './lista-objetos';

describe('ListaObjetos', () => {
  let component: ListaObjetos;
  let fixture: ComponentFixture<ListaObjetos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaObjetos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaObjetos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
