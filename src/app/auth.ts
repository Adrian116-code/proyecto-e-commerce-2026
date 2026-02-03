import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class Auth {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  signUp(email: string, pass: string) {
    return this.supabase.auth.signUp({ email, password: pass});
  }

  signIn(email: string, pass: string) {
    return this.supabase.auth.signInWithPassword({ email, password: pass });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  get user() {
    return this.supabase.auth.getUser();
  }
  
}
