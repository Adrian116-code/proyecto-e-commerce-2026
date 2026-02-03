import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearObjetos } from './crear-objetos';

describe('CrearObjetos', () => {
  let component: CrearObjetos;
  let fixture: ComponentFixture<CrearObjetos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearObjetos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearObjetos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
