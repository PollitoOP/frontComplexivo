import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../pages/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private urlEndPoint: string = `${environment.apiUrl}/assets/upload-object`;

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<any>(this.urlEndPoint, formData);
  }

  getImage(key: string): Observable<Blob> {
    return this.http.get(`${this.urlEndPoint}/get-object`, { 
      params: { key },
      responseType: 'blob'
    });
  }
}
