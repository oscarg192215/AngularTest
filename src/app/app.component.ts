import { Component, OnInit } from '@angular/core';
import { User } from './models/user.model';
import { ApiService } from './services/api.service';
import { Router } from '@angular/router';
import {  MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AngularTest';

  selectedImage: File | undefined;
  previewImageUrl: string = '';
  imageDefault: string = "https://cdn.iconscout.com/icon/free/png-512/free-avatar-366-456318.png?f=webp&w=256";
  user: User = new User();
  dropdownVisible: boolean = false;
  loggedUser: any;
  activeCategory: string;


  constructor(private apiSrv: ApiService, private router: Router, private messageService: MessageService) {
    this.activeCategory = 'Home';
    const local = localStorage.getItem('userData');
    if (local != null) {
      this.loggedUser = JSON.parse(local);
    }
  }

  ngOnInit() {
    this.previewImageUrl = this.imageDefault;
    this.dropdownVisible = true;
    const storedActiveCategory = localStorage.getItem('activeCategory');
    if (storedActiveCategory) {
      this.activeCategory = storedActiveCategory;
    }
  }

  onActiveCategories(category: string) {
    this.activeCategory = category;
    localStorage.setItem('activeCategory', this.activeCategory);
  }

  toggleDropdown() {
    this.dropdownVisible = true;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = (e: any) => {
        if (typeof reader.result === 'string') {
          this.user.photo = reader.result.split(',')[1];
          this.previewImageUrl = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }


  onSubmit() {
    this.apiSrv.registerOwner(this.user).subscribe((res: any) => {
      if (res.result) {
        this.showMessage('user created');
        this.loggedUser = res.data;
        this.resetForm();
      }
      else { 
        this.showMessage(res.message);
      }
    })
    this.dropdownVisible = true;
  }

  onLogin() {
    this.apiSrv.loginOwner(this.user.email, this.user.password).subscribe((res: any) => {
      if (res.result) {
        localStorage.setItem('userData', JSON.stringify(res.data));
        console.log(this.activeCategory);
        localStorage.setItem('activeCategory', this.activeCategory);
        this.loggedUser = res.data;
        this.showMessage('Welcome ' + this.loggedUser.name);
        this.resetForm();
      }
      else { alert(res.message) }
    })
    this.dropdownVisible = true;
  }

  resetForm() {
    this.user = new User();
  }

  onLogOut() {
    localStorage.removeItem('userData');
    localStorage.removeItem('activeCategory');
    localStorage.removeItem('categoriaActiva');
    localStorage.removeItem('propertyData');
    this.loggedUser = undefined;
    this.activeCategory = 'Home';
    this.router.navigate(['/home']);
  }
  

  showMessage(msg: string) {
  this.messageService.add({
      key: 'tc',
      severity: 'success',
      summary: 'success',
      detail: msg
  });
}

}