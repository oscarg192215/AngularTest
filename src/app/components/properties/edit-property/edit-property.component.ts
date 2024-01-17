import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Property } from 'src/app/models/property.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent implements OnInit, OnChanges {
  @Input() displayAddEditModal: boolean = true;
  @Input() selectedProperty: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddEdit: EventEmitter<any> = new EventEmitter<any>();
  modalType = "Add";

  loggedUser: any = [];
  propertyData: any = {};
  id: number = 0;
  selectedImage: File | undefined;
  previewImageUrl: string = '';
  imageDefault: string = "https://w7.pngwing.com/pngs/400/293/png-transparent-add-add-photo-upload-plus-instagram-ui-icon.png";
  
  property: Property = new Property();
  visible: boolean = false;

  options = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' }
  ];
  items: MenuItem[] | undefined;
  propertiesList: any[] = [];
  subscriptions: Subscription[] = [];
  pdtSubscription: Subscription = new Subscription();

  propertyForm = this.fb.group({
    idProperty: [0],
    name: ['', [Validators.required]],
    address: ['', [Validators.required]],
    price: ['', [Validators.required]],
    codeInternal: ['', [Validators.required]],
    year: ['', [Validators.required]],
    idOwner: [this.loggedUser.idOwner],
    propertyImage: this.fb.group({
      idPropertyImage: [0],
      idProperty: [0],
      files: ['', [Validators.required]],
      enabled: ['', [Validators.required]],
    }),
    propertyTrace: this.fb.group({
      idPropertyTrace: [0],
      idProperty: [0],
      dateSale: ['', [Validators.required]],
      name: ['Modify property'],
      value: ['', [Validators.required]],
      tax: ['', [Validators.required]],
    })
  });

  constructor(private fb: FormBuilder, private apiSrv: ApiService,private route: ActivatedRoute, private router: Router,
    private messageService: MessageService) {
      this.route.params.subscribe(params => {
        this.id = +params['id'];
        this.propertyData = params;
      });
      const local = localStorage.getItem('userData');
      if (local != null) {
        this.loggedUser = JSON.parse(local);
      }
      this.onLoadData();

      

     }
    

     showDialog() {
         this.visible = true;
     }

onLoadData(){
  this.getPropertiesById(this.id);
  const storedData = localStorage.getItem('propertyData');
      debugger;
    if (storedData) {
      this.propertyData = JSON.parse(storedData);
      this.propertyForm.patchValue(this.propertyData);

      
      const propertyImageGroup = this.propertyForm.get('propertyImage');
      if (propertyImageGroup) {
        propertyImageGroup.patchValue(this.propertyData.propertyImage[0]);
      }

      const propertyTraceGroup = this.propertyForm.get('propertyTrace');
      if (propertyTraceGroup) {
        propertyTraceGroup.patchValue(this.propertyData.propertyTrace[0]);
      }
      
      console.log(this.propertyForm);
      console.log(this.propertyData.value);
    }
}

  ngOnInit(): void {

    this.onLoadData();
    this.previewImageUrl = 'data:image/jpeg;base64,'  + this.propertyData.propertyImage[0].files;// this.imageDefault;
   

    this.items = [
      { label: 'View', icon: 'pi pi-fw pi-search' },
      { label: 'Delete', icon: 'pi pi-fw pi-trash' }
  ];
  }

  ngOnChanges(): void {
    if (this.selectedProperty) {
      this.modalType = 'Edit';
      this.propertyForm.patchValue(this.selectedProperty);
    } else {
      this.propertyForm.reset();
      this.modalType = 'Add';
    }
  }
  
  getPropertiesById(id: number) {
    this.apiSrv.getProperty(id).subscribe((res: any) => {
      this.propertiesList = res.data.properties;
      localStorage.setItem('propertyData', JSON.stringify(res.data));
    })
    this.subscriptions.push(this.pdtSubscription)
  }

  addEditProperty() {
    this.apiSrv.editProperty(this.propertyForm.value).subscribe(
      response => {
        this.clickAddEdit.emit(response);
        const msg = this.modalType === 'Add' ? 'Property added' : 'Property updated';
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        console.log('Error occured');
      }
    )
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




  onEditSubmit() {
    debugger;
    if (this.propertyForm.valid) {
      const formData = this.propertyForm.value;
      this.apiSrv.editProperty(formData).subscribe((res: any) => {
        debugger;
        if (res.result) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Property modified.' });
        this.router.navigate(['/properties']);
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
        }
      })
    }
  }

  onBack(){
    localStorage.removeItem('propertyData');
    this.router.navigate(['/properties']);
  }

  onSelectedChange(event: any) {
    this.property.propertiesImage.enabled = event.target.value;
  }

  onDateChange(event: any) {
    this.property.propertiesTrace.dateSale = event.target.value;
  }

  convertToNumber(event: any) {
    if(isNaN(parseInt(event.target.value, 10))){
      this.propertyForm?.get('propertyTrace')?.get(event.target.name)?.setValue('');
    }
    else{
      if (this.propertyForm?.get(event.target.name)) {
        this.propertyForm?.get(event.target.name)?.setValue(parseInt(event.target.value, 10));
      }
      else {
        this.propertyForm?.get('propertyTrace')?.get(event.target.name)?.setValue(parseInt(event.target.value, 10));
      }
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
  

}