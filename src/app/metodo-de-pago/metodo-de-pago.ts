import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-metodo-de-pago',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './metodo-de-pago.html',
  styleUrl: './metodo-de-pago.css',
})
export class MetodoDePago {

  userEmail: string | undefined = '';
  productos: any[] = [];
  carritoItems: any[] = [];
  categorias: any[] = [];
  pedidoItems: any[] = [];
  detalleItems: any[] = [];
  carrito: any[] = [];
  total: any;
  estado: any;
  nombres: any;
  apellidos: any;
  telefono: number | any;
  profileItems: any[] = [];

  constructor(private supabase: SupabaseService, private router: Router) {

  }

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
      await this.cargarDetallesPedidos();
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
      estado
    `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error al cargar pedidos:', error);
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
      precio_unitario
    `);

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
    this.estado = "En preparación";
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
      .from('pedidos')
      .insert([
        {
          user_id: user.id,
          total: producto.total,
          estado: producto.estado,
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

  async agregarAlPedido() {
    const { data: { user } } = await this.supabase.supabase.auth.getUser();

    if (!user) return;

    const { data: nuevoPedido, error } = await this.supabase.supabase
      .from('pedidos')
      .insert([{
        user_id: user.id,
        total: this.total,
        estado: "En preparación"
      }])
      .select()
      .single();

    if (error || !nuevoPedido) {
      console.error('Error de Supabase (RLS):', error);
      return;
    }

    if (nuevoPedido) {

      const itemsParaInsertar = this.carritoItems.map(item => ({
        pedido_id: nuevoPedido.id,
        producto_id: item.productos_id,
        cantidad: item.cantidad,
        precio_unitario: item.productos.precio
      }));

      const { error: errorDetalles } = await this.supabase.supabase
        .from('detalles_pedido')
        .insert(itemsParaInsertar);

      if (errorDetalles) {
        console.error('Error en detalles:', errorDetalles.message);
      }
    }
    this.agregarDetallesPedido(nuevoPedido.id);
  }

  async agregarDetallesPedido(producto: any) {

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
          cantidad: 1,
          precio_unitario: this.total,
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

  async cargarProfile(){

    const { data: { user } } = await this.supabase.supabase.auth.getUser();

    if (!user) {
      this.profileItems = [];
      return;
    }

    const { data, error } = await this.supabase.supabase
      .from('profiles')
      .select(`
      id,
      nombre,
      apellido
    `);

    if (error) {
      console.error('Error al cargar pedidos:', error);
    } else {
      this.profileItems = data || [];
    }
  }

  async agregarProfile(){

        const { data: { user } } = await this.supabase.supabase.auth.getUser();

    if (!user) {
      this.profileItems = [];
      return;
    }
    const { error } = await this.supabase.supabase
      .from('profiles')
      .update([
        {
          nombre: this.nombres,
          apellido: this.apellidos
        }
      ])
      .eq('id', user.id);;
          if (error) {
      console.error('Error al agregar:', error);
      alert('No se pudo agregar');
    } else {
      Swal.fire({
        title: `${this.profileItems} añadido`,
        icon: "success",
        draggable: true
      });
    }
    await this.cargarProfile();
    
  }

}
