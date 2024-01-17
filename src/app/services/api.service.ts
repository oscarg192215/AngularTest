import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiEndPoint: string = 'https://localhost:7291/api/';

  constructor(private http: HttpClient) {

  }
  registerOwner(obj: any) {
    return this.http.post(this.apiEndPoint + 'Owner', obj);
  }

  loginOwner(email: string, password: string): Observable<any> {
    return this.http.get(this.apiEndPoint + 'Owner/Login', {
      params: { email: email, password: password, }
    })
  }

  listProperties(): Observable<any> {
    return this.http.get(this.apiEndPoint + 'Property');
  }

  listPropertiesByOwner(id: number): Observable<any> {
    return this.http.get(this.apiEndPoint + 'PropertyDetails/GetDetailsById', {
      params: { id: id, }
    })
  }

  registerProperty(obj: any) {
    return this.http.post(this.apiEndPoint + 'Property', obj);
  }

 editProperty(postData: any) {
    return this.http.put(`${this.apiEndPoint}Property/`, postData);
  }

  getProperty(id: number): Observable<any> {
    console.log(this.apiEndPoint + 'Property/' + id);
    return this.http.get(this.apiEndPoint + 'Property/' + id, {
      params: { id: id, }
    })
  }

  searchProperties(criteria: any): Observable<any> {
    return this.http.post<any[]>(`${this.apiEndPoint}Property/Search`, criteria);    
  }

}
