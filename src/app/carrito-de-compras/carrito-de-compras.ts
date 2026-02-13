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
  pedidoItems: any[] = [];
  detalleItems: any[] = [];
  carrito: any[] = [];
  total: any;

  constructor(private supabase: SupabaseService, private router: Router) { }

  async ngOnInit() {
    const { data: { user } } = await this.supabase.supabase.auth.getUser();


    if (!user) {
      this.router.navigate(['/login']);
    } else {
      this.userEmail = user.email;

      await this.cargarProductos();
      await this.cargarCarrito();
      await this.cargarPedidos();
      await this.actualizarTotal();
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

  async cargarPedidos() {
    const { data: { user } } = await this.supabase.supabase.auth.getUser();

    if (!user) {
      this.pedidoItems = [];
      return;
    }

    const { data, error } = await this.supabase.supabase
      .from('pedidos')
      .select(`
      id,
      total,
      estado,
      productos (nombre, precio)
    `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error al cargar carrito:', error);
    } else {
      this.pedidoItems = data || [];
    }
  }

    async cargarDetallesPedidos() {
    const { data: { user } } = await this.supabase.supabase.auth.getUser();

    if (!user) {
      this.detalleItems = [];
      return;
    }

    const { data, error } = await this.supabase.supabase
      .from('detalles_pedido')
      .select(`
      id,
      cantidad,
      precio_unitario,
      productos (nombre, precio),
    `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error al cargar detalles:', error);
    } else {
      this.detalleItems = data || [];
    }
  }

    actualizarTotal() {
    this.total = this.carritoItems.reduce((acc, item) => {
      return acc + (item.productos.precio * item.cantidad);
    }, 0);
  }

  async signOut() {
    const { error } = await this.supabase.supabase.auth.signOut();
    if (!error) {
      this.router.navigate(['/login']);
    }
  }

  verDetalle(producto: any) {
    alert(`Descripción: ${producto.descripcion || 'Sin descripción'}`);
  }

  async agregarAlPedido(producto: any) {

    const { data: { user } } = await this.supabase.supabase.auth.getUser();

    if (!user) {
      alert('Debes iniciar sesión para comprar');
      return;
    }

    const { error } = await this.supabase.supabase
      .from('pedidos')
      .insert([
        {
          user_id: user.id,
          total: this.actualizarTotal(),
          estado: "En preparación"
        }
      ]);
    await this.cargarPedidos();

    if (error) {
      console.error('Error al agregar:', error);
      alert('No se pudo agregar al carrito');
    } else {
      Swal.fire({
        title: `Pedido registrado`,
        icon: "success",
        draggable: true
      });
    }
  }

      async agregarDetallesPedido(producto: any, pedidoItems: any) {
  
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
        .from('detalles_pedido')
        .insert([
          {
            producto_id: producto.id,
            pedido_id: pedidoItems.id,
            canidad: producto.cantidad,
            precio_unitario: this.actualizarTotal()
          }
  
        ]);
      await this.cargarDetallesPedidos();
  
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
