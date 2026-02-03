import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet, RouterLink, ReactiveFormsModule ,FormsModule, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {

  productoForm: FormGroup;
  categorias: any[] = [];

  constructor(private fb: FormBuilder, private supabase: SupabaseService) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoria_id: ['', Validators.required],
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
        alert('¡Producto creado!');
        this.productoForm.reset();
      }
    }
  }
}