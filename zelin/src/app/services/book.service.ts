import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Book } from '../models/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  };
  constructor(private http: HttpClient) {}
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>('http://localhost:3000/refresh');
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(
      'http://localhost:3000/add',
      book,
      this.httpOptions
    );
  }

  editBook(book: Book): Observable<Book> {
    return this.http.post<Book>(
      'http://localhost:3000/edit',
      book,
      this.httpOptions
    );
  }

  deleteBook(id: number): Observable<Book[]> {
    return this.http.post<Book[]>(
      'http://localhost:3000/delete',
      { id: id },
      this.httpOptions
    );
  }
}
