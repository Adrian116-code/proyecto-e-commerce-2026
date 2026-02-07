import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ɵInternalFormsSharedModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, ɵInternalFormsSharedModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  userEmail: string | undefined = '';
  username: string | undefined = '';
  userapellido: string | undefined = '';
  productos: any[] = [];
  carritoItems: any[] = [];

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private router: Router
  ) { }

  async ngOnInit() {
    const { data: { user } } = await this.supabase.supabase.auth.getUser();


    await this.cargarProductos();
    await this.cargarCarrito();

    if (!user) {
      Swal.fire({
        text: "Bienvenido a la Aplicación",
      });
    } else {
      this.userEmail = user.email;
    }
  }

  async cargarCarrito() {
    const { data: { user } } = await this.supabase.supabase.auth.getUser();

    if (!user) {
      this.carritoItems = [];
      return;
    }

    const { data, error } = await this.supabase.supabase
      .from('carrito')
      .select(`
      id,
      cantidad,
      imagen_id,
      productos (nombre, precio)
    `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error al cargar carrito:', error);
    } else {
      this.carritoItems = data || [];
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

  async signOut() {
    const { error } = await this.supabase.supabase.auth.signOut();
    if (!error) {
      this.router.navigate(['/login']);
    }
  }

  async agregarAlCarrito(producto: any) {

    const { data: { user } } = await this.supabase.supabase.auth.getUser();

    if (!user) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Debes iniciar sesión para comprar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Iniciar Sesión'
      });

      if (result.isConfirmed) {
        this.router.navigate(['/login']);

      }

      return;
    }

    const { error } = await this.supabase.supabase
      .from('carrito')
      .insert([
        {
          user_id: user.id,
          producto_id: producto.id,
          imagen_id: producto.imagen_url,
          cantidad: 1
        }

      ]);
    await this.cargarCarrito();

    if (error) {
      console.error('Error al agregar:', error);
      alert('No se pudo agregar al carrito');
    } else {
      Swal.fire({
        title: `${producto.nombre} añadido al carrito`,
        icon: "success",
        draggable: true
      });
    }
  }

  verDetalle(producto: any) {
    Swal.fire(
      `Nombre: ${producto.nombre || 'Sin nombre'}
      Precio: ${producto.precio || 'Sin precio'}
      Descripción: ${producto.descripcion || 'Sin descripción'}
      Stock: ${producto.stock || 'Sin stock'}
      Categoria: ${producto.categoria || 'Sin categoria'}`
    );
  }

  async eliminarDelCarrito(itemId: string) {

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
      const { error } = await this.supabase.supabase
        .from('carrito')
        .delete()
        .eq('id', itemId);
      Swal.fire({
        title: "Producto eliminado del carrito de compras",
        icon: "success"
      });

      if (error) {
        console.error('Error al eliminar:', error);
        alert('No se pudo eliminar el producto');
      } else {
        await this.cargarCarrito();
      }
    }
  }
}
