import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Property } from 'src/app/models/property.model';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {
  propertyForm: FormGroup;
  loggedUser: any;
  propertiesList: any[] = [];
  usuario: User = new User();

  selectedImage: File | undefined;
  previewImageUrl: string = '';
  imageDefault: string = "https://w7.pngwing.com/pngs/400/293/png-transparent-add-add-photo-upload-plus-instagram-ui-icon.png";
  property: Property = new Property();
  id: number;
  operation: string = 'Added';

  options = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' }
  ];
 
  
  displayAddEditModal = false;
  selectedProperty: any = null;
  subscriptions: Subscription[] = [];
  pdtSubscription: Subscription = new Subscription();

  propertyData: any = {};

  constructor(private apiSrv: ApiService, private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) {
      this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
 
      const storedData = localStorage.getItem('propertyData');
    if (storedData) {
      this.propertyData = JSON.parse(storedData);
      this.propertyForm = this.propertyData;
      console.log(this.propertyData.value);
    }

    const local = localStorage.getItem('userData');
    if (local != null) {
      this.loggedUser = JSON.parse(local);
    }

    this.propertyForm = this.fb.group({
      idProperty: [0],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      price: ['', [Validators.required]],
      codeInternal: ['', [Validators.required]],
      year: ['', [Validators.required]],
      idOwner: [this.loggedUser.idOwner],
      propertyImage: this.fb.group({
        idPropertyImage: [0],
        files: ['', [Validators.required]],
        enabled: ['', [Validators.required]],
      }),
      propertyTrace: this.fb.group({
        idPropertyTrace: [0],
        dateSale: ['', [Validators.required]],
        name: ['Register property'],
        value: ['', [Validators.required]],
        tax: ['', [Validators.required]],
      })
    });

    this.propertyForm = new FormGroup({
      idProperty: new FormControl(0),
      name: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      codeInternal: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required]),
      idOwner: new FormControl(this.loggedUser.idOwner),
      propertyImage: new FormGroup({
        idPropertyImage: new FormControl(0),
        idProperty: new FormControl(this.id),
        files: new FormControl('', [Validators.required]),
        enabled: new FormControl('', [Validators.required]),
      }),
      propertyTrace: new FormGroup({
        idPropertyTrace: new FormControl(0),
        idProperty: new FormControl(this.id),
        dateSale: new FormControl('', [Validators.required]),
        name: new FormControl('Register property'),
        value: new FormControl('', [Validators.required]),
        tax: new FormControl('', [Validators.required]),
      })
    });

  }


  saveOrUpdateProperty(newData: any) {
    if (this.selectedProperty && newData.id === this.selectedProperty.idProperty) {
      const propertyIndex = this.propertiesList.findIndex(data => data.id === newData.id);
      this.propertiesList[propertyIndex] = newData;
    } else {
      this.propertiesList.unshift(newData);
    }
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.previewImageUrl = this.imageDefault;
    this.getProperties();
    if(this.id != 0) {
      this.operation = 'Modify';
    }
    
  }
  getProperties() {
    this.apiSrv.listPropertiesByOwner(this.loggedUser.idOwner).subscribe((res: any) => {
      this.propertiesList = res.data.properties;
      this.usuario = res.data;
    })    
    this.subscriptions.push(this.pdtSubscription)
    }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (e: any) => {
        if (typeof reader.result === 'string') {
          this.previewImageUrl = e.target.result;
          this.propertyForm?.get('propertyImage')?.get('files')?.setValue(reader.result.split(',')[1]);
          console.log(this.propertyForm.value);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    debugger;
    if (this.propertyForm.valid) {
      const formData = this.propertyForm.value;
      this.apiSrv.registerProperty(formData).subscribe((res: any) => {
        debugger;
        if (res.result) {
          this.onCloseModal();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Property added.' });
        this.router.navigate(['/properties']);
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
        }
      })
    }
  }


  onEditSubmit() {
    debugger;
    if (this.propertyForm.valid) {
      const formData = this.propertyForm.value;
      this.apiSrv.registerProperty(formData).subscribe((res: any) => {
        debugger;
        if (res.result) {
          this.onCloseModal();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Property modified.' });
        this.router.navigate(['/properties']);
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
        }
      })
    }
  }

  onSelectedChange(event: any) {
    this.property.propertiesImage.enabled = event.target.value;
  }

  onDateChange(event: any) {
    this.property.propertiesTrace.dateSale = event.target.value;
  }

  convertToNumber(event: any) {
    if (this.propertyForm?.get(event.target.name)) {
      this.propertyForm?.get(event.target.name)?.setValue(parseInt(event.target.value, 10));
    }
    else {
      this.propertyForm?.get('propertyTrace')?.get(event.target.name)?.setValue(parseInt(event.target.value, 10));
    }
  }

  showValidation(event: any) {
    const element = document.getElementById(event.target.name);
    if (event.target.value != null && event.target.value.trim() != '') {
      if (element != null) {
        element.style.border = '1px solid #26bb84';
      }
    }
    else {
      if (element && element instanceof HTMLInputElement) {
        element.value = '';
        element.style.border = '1px solid rgb(255, 54, 54)';
      }
    }
  }

  onCloseModal() {
    const elementosEnModal = document.querySelectorAll('#modal_property .inputsForm');
    elementosEnModal.forEach((elemento: Element) => {
      const inputElemento = elemento as HTMLInputElement;
      inputElemento.style.border = '1px solid #dfe3e8';
      inputElemento.value = '';
    });
    this.previewImageUrl = this.imageDefault;
    this.propertyForm.reset();
    this.getProperties();
    $("#modal_property .close")?.click();
    this.property = new Property();
  }



}


