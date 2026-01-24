import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarProductoDialogoComponent } from './editar-producto-dialogo.component';

describe('EditarProductoDialogoComponent', () => {
  let component: EditarProductoDialogoComponent;
  let fixture: ComponentFixture<EditarProductoDialogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarProductoDialogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarProductoDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
