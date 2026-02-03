import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from '../services/supabase';

export const adminGuard: CanActivateFn = async (route, state) => {
 
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const { data: { user }, error } = await supabase.supabase.auth.getUser();

  if (error || !user) {
    router.navigate(['/login']);
    return false;
  }

  const isAdmin = user?.user_metadata?.['role'] === 'admin';

  if (isAdmin) {
    return true;
  } else {
    alert('Acceso denegado. Se requieren permisos de administrador.');
    router.navigate(['/home']);
    return false;
  }
};
