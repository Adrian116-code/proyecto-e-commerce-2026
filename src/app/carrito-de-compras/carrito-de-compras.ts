import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito-de-compras',
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito-de-compras.html',
  styleUrl: './carrito-de-compras.css',
})
export class CarritoDeCompras {
  userEmail: string | undefined = '';
  productos: any[] = [];
  carritoItems: any[] = [];

  constructor(private supabase: SupabaseService, private router: Router) { }

  async ngOnInit() {
    const { data: { user } } = await this.supabase.supabase.auth.getUser();


    if (!user) {
      this.router.navigate(['/login']);
    } else {
      this.userEmail = user.email;

      await this.cargarProductos();
      await this.cargarCarrito();
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
      descripcion,
      imagen_url,
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
      alert('Debes iniciar sesión para comprar');
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
    alert(`Descripción: ${producto.descripcion || 'Sin descripción'}`);
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
