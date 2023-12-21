import { Component, Inject } from '@angular/core';
import { BookService } from './services/book.service';
import { Book } from './models/book';
import { DialogData } from './models/dialog';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
//import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  themeClass = 'ag-theme-quartz';
  title = 'zelin';
  books: Book[] = [];
  clonedBook: { [id: string]: Book } = {};
  constructor(private bookService: BookService, public dialog: MatDialog) {}

  ngOnInit() {
    this.bookService.getBooks().subscribe((books) => {
      this.books = books;
    });
  }
  rowEdit(book: Book) {
    console.log('start edit');
    this.clonedBook[book.id.toString()] = { ...book };
  }

  rowSave(book: Book) {
    if (book.grade > 0 && book.grade <= 5) {
      delete this.clonedBook[book.id.toString()];
      this.editBook(book);
    } else {
      console.log('failed');
    }
  }
  deleteRow(book: Book) {
    this.deleteBook(book.id);
  }

  rowEditCancel(book: Book, index: number) {
    this.books[index] = this.clonedBook[book.id.toString()];
    delete this.clonedBook[book.id.toString()];
  }
  Click() {
    const dialogWindow = this.dialog.open(DialogBox, {
      data: {
        title: '',
        author: '',
        grade: '',
      },
      height: '250px',
      width: '400px',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      position: { top: '10%' },
    });
    dialogWindow.afterClosed().subscribe((result) => {
      if (result.grade >= 0 && result.grade <= 5) {
        let new_book: Book = {
          id: this.books.length + 1,
          title: result.title,
          author: result.author,
          grade: result.grade,
          last_update: new Date().toISOString(),
        };
        this.addBook(new_book);
      }
    });
  }
  addBook(book: Book) {
    this.bookService.addBook(book).subscribe((book) => {
      this.books.push(book);
    });
  }

  editBook(book: Book) {
    this.bookService.editBook(book).subscribe((updatedBook) => {
      const index = this.books.findIndex((obj) => {
        return obj.id === updatedBook.id;
      });
      this.books[index].title = updatedBook.title;
      this.books[index].grade = updatedBook.grade;
      this.books[index].author = updatedBook.author;
      this.books[index].last_update = updatedBook.last_update;
    });
  }

  deleteBook(id: number) {
    this.bookService.deleteBook(id).subscribe((books) => {
      this.books = books;
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class DialogBox {
  constructor(
    public dialogRef: MatDialogRef<DialogBox>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
