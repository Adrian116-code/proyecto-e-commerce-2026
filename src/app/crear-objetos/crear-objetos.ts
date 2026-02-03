import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-objetos',
  imports: [RouterOutlet, RouterLink, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './crear-objetos.html',
  styleUrl: './crear-objetos.css',
})
export class CrearObjetos {

  productoForm: FormGroup;
  categorias: any[] = [];

  constructor(private fb: FormBuilder, private supabase: SupabaseService, private router: Router) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required],
      imagen_url: ['']
    });
  }

  async ngOnInit() {
    const { data } = await this.supabase.supabase.from('categorias').select('*');
    if (data) this.categorias = data;
  }

  async probarConexion() {
    const { data, error } = await this.supabase.getProductos();
    if (error) console.error('Error de conexión:', error);
    else console.log('Productos actuales en DB:', data);
  }

  async guardarProducto() {
    if (this.productoForm.valid) {
      const { error } = await this.supabase.supabase
        .from('productos')
        .insert([this.productoForm.value]);

      if (error) alert('Error al guardar: ' + error.message);
      else {
        Swal.fire({
          title: "¡Producto creado!",
          icon: "success",
          draggable: true
        });
        this.productoForm.reset();
        this.router.navigate(['/admin']);
      }
    }
  }

}
