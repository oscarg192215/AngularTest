import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookingComponent } from './components/booking/booking.component';
import { PropertiesComponent } from './components/properties/properties.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CardPropertiesComponent } from './shared/card-properties/card-properties.component'
import { CustomInputDirective } from './directives/custom-input.directive';
import { TextMaskModule } from 'angular2-text-mask';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { EditPropertyComponent } from './components/properties/edit-property/edit-property.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ListPropertiesComponent } from './components/properties/list-properties/list-properties.component';
import { DataService } from 'src/app/services/data.service'; 

@NgModule({
  declarations: [
    AppComponent,
    BookingComponent,
    PropertiesComponent,
    HomeComponent,
    CardPropertiesComponent,
    CustomInputDirective,
    EditPropertyComponent,
    ListPropertiesComponent
  ],
  imports: [
    BrowserModule,
    ContextMenuModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule ,
    TextMaskModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule,
    TableModule,
    ConfirmDialogModule,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    ToastModule,
    CardModule,
    DividerModule,
    FieldsetModule,
    FileUploadModule
  ],
  providers: [MessageService, ConfirmationService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
