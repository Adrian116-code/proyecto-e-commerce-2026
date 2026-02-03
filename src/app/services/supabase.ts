import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  public supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    )
  }


  async agregarProducto(producto: any) {
    return await this.supabase
      .from('productos')
      .insert([producto]);
  }

  async getProductos() {
    return await this.supabase
      .from('productos')
      .select('*');
  }

  private productoParaEditar: any = null;

  setProducto(producto: any) {
    this.productoParaEditar = producto;
  }

  getProducto() {
    return this.productoParaEditar;
  }

  clearProductoEdicion() {
  this.productoParaEditar = null;
}
}