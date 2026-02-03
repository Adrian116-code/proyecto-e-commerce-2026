import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-objetos',
  imports: [RouterOutlet, RouterLink, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './modificar-objetos.html',
  styleUrl: './modificar-objetos.css',
})
export class ModificarObjetos implements OnInit {


  productoForm: FormGroup;
  productoId: string = '';
  categorias: any[] = [];
  productos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.productoForm = this.fb.group({
      id: this.productoId,
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0],
      categoria: ['', Validators.required],
      imagen_url: ['']
    });
  }

  async ngOnInit() {

    const { data } = await this.supabase.supabase.from('categorias').select('*');
    if (data) this.categorias = data;

    const productoData = this.supabase.getProducto();

    if (productoData) {
      this.productoId = productoData.id;

      this.productoForm.patchValue({
        id: productoData.id,
        nombre: productoData.nombre,
        descripcion: productoData.descripcion,
        precio: productoData.precio,
        stock: productoData.stock,
        categoria: productoData.categoria,
        imagen_url: productoData.imagen_url
      });
    }
  }

  async cargarProductos() {
    const { data, error } = await this.supabase.supabase
      .from('productos')
      .select(`
        id,
      nombre,
      precio,
      stock,
      imagen_url,
      descripcion,
      categoria
    `);

    if (error) console.error(error);
    else this.productos = data;
  }

  async modificarProducto() {
    if (this.productoForm.invalid) return;

    Swal.fire({ title: 'Actualizando...', didOpen: () => Swal.showLoading() });

    const { error } = await this.supabase.supabase
      .from('productos')
      .update(this.productoForm.value)
      .eq('id', this.productoId);

    Swal.close();
    this.cargarProductos();

    if (error) {
      Swal.fire('Error', error.message, 'error');
    } else {
      await Swal.fire('¡Actualizado!', 'El producto se modificó correctamente', 'success');
      this.supabase.clearProductoEdicion();
      this.router.navigate(['/lista-objetos']);
    }
  }


}