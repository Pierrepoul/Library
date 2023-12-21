import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, DialogBox } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BookService } from './services/book.service';
import { MatDialogModule } from '@angular/material/dialog';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    TableModule,
    FormsModule,
    ButtonModule,
    BrowserAnimationsModule,
  ],
  providers: [provideClientHydration(), BookService],
  bootstrap: [AppComponent],
})
export class AppModule {}
