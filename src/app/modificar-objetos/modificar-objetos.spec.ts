import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarObjetos } from './modificar-objetos';

describe('ModificarObjetos', () => {
  let component: ModificarObjetos;
  let fixture: ComponentFixture<ModificarObjetos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarObjetos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarObjetos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
