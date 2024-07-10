import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private keycloakServices: KeycloakService ) { }

  getRoles() {
    return this.keycloakServices.getUserRoles();
  }

  isAdmin(){
    let roles = this.keycloakServices.getUserRoles().filter((role: any) => role === 'admin');

    if(roles.length > 0){
      return true;
    }
    else{
      return false;
    }
  }
}
