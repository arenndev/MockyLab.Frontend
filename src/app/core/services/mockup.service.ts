import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';  // .development eklendi
import { MockupRequest, MockupResponse, GenerateRequest } from '../models/mockup.model';

@Injectable({
  providedIn: 'root'
})
export class MockupService {
  private apiUrl = `${environment.apiUrl}/api/mockup`;

  constructor(private http: HttpClient) {}

  getAllMockups(): Observable<MockupResponse[]> {
    return this.http.get<MockupResponse[]>(this.apiUrl);
  }

  getMockupById(id: number): Observable<MockupResponse> {
    return this.http.get<MockupResponse>(`${this.apiUrl}/${id}`);
  }

  createMockup(mockup: MockupRequest): Observable<MockupResponse> {
    const formData = new FormData();
    
    // Type-safe versiyonu
    formData.append('name', mockup.name);
    formData.append('left', mockup.left.toString());
    formData.append('top', mockup.top.toString());
    formData.append('centerX', mockup.centerX.toString());
    formData.append('centerY', mockup.centerY.toString());
    formData.append('width', mockup.width.toString());
    formData.append('height', mockup.height.toString());
    formData.append('angle', mockup.angle.toString());
    formData.append('category', mockup.category);
    formData.append('genderCategory', mockup.genderCategory);
    formData.append('designColor', mockup.designColor);
    
    if (mockup.imageFile) {
      formData.append('imageFile', mockup.imageFile);
    }

    return this.http.post<MockupResponse>(this.apiUrl, formData);
  }

  updateMockup(id: number, mockup: MockupRequest): Observable<MockupResponse> {
    const formData = new FormData();
    
    // Type-safe versiyonu
    formData.append('name', mockup.name);
    formData.append('left', mockup.left.toString());
    formData.append('top', mockup.top.toString());
    formData.append('centerX', mockup.centerX.toString());
    formData.append('centerY', mockup.centerY.toString());
    formData.append('width', mockup.width.toString());
    formData.append('height', mockup.height.toString());
    formData.append('angle', mockup.angle.toString());
    formData.append('category', mockup.category);
    formData.append('genderCategory', mockup.genderCategory);
    formData.append('designColor', mockup.designColor);
    
    if (mockup.imageFile) {
      formData.append('imageFile', mockup.imageFile);
    }

    return this.http.put<MockupResponse>(`${this.apiUrl}/${id}`, formData);
  }

  deleteMockup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  generateMockups(request: GenerateRequest): Observable<Blob> {
    const formData = new FormData();
    formData.append('mockupIds', JSON.stringify(request.mockupIds));
    request.designFiles.forEach(file => {
      formData.append('designFiles', file);
    });

    return this.http.post(`${environment.apiUrl}/api/generate`, formData, {
      responseType: 'blob'
    });
  }
}