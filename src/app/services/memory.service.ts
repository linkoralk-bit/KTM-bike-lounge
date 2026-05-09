import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {

  apiUrl = 'http://127.0.0.1:5000/api/memories';
//   apiUrl = 'https://weddingplatformbackend.onrender.com/api/memories';

  constructor(private http: HttpClient) {}

  uploadMemory(formData: FormData) {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getMemories(eventId: string) {
    return this.http.get(`${this.apiUrl}/${eventId}`);
  }

  getAdminMemories(eventId: string) {
    return this.http.get(`${this.apiUrl}/admin/${eventId}`);
  }

  approveMemory(id: string) {
    return this.http.put(`${this.apiUrl}/approve/${id}`, {});
  }
}