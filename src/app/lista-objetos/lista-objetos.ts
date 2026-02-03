import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-lista-objetos',
  imports: [RouterLink, CommonModule],
  templateUrl: './lista-objetos.html',
  styleUrl: './lista-objetos.css',
})
export class ListaObjetos {

  userEmail: string | undefined = '';
  productos: any[] = [];
  carritoItems: any[] = [];

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private router: Router
  ) { }

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
      alert('Debes iniciar sesión para comprar');
      return;
    }

    const { error } = await this.supabase.supabase
      .from('carrito')
      .insert([
        {
          user_id: user.id,
          producto_id: producto.id,
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

  irAModificar(producto: any) {
    this.supabase.setProducto(producto);
    this.router.navigate(['/modificar-objetos']);
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

  async eliminarProducto(producto_id: string) {


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
      const { data: enCarrito } = await this.supabase.supabase
        .from('carrito')
        .select('id')
        .eq('producto_id', producto_id)
        .limit(1);
      Swal.fire({
        title: "Producto Eliminado",
        icon: "success"
      });

      if (enCarrito && enCarrito.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "No puedes borrar este producto porque alguien lo tiene en su carrito.",
        });
        return;
      }

      const { error } = await this.supabase.supabase
        .from('productos')
        .delete()
        .eq('id', producto_id);

      if (error) {
        console.error('Error al eliminar:', error);
      } else {
        await this.cargarProductos();
      }
    }
  }
}