import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Property } from 'src/app/models/property.model';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-card-properties',
  templateUrl: './card-properties.component.html',
  styleUrls: ['./card-properties.component.css']
})
export class CardPropertiesComponent {
  @Input() propertyData: any;

  @Output() sendData = new EventEmitter<any>();


  loggedUser: any;
  propertiesList: any[] = [];
  property: Property = new Property();
  options = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' }
  ];

  displayAddEditModal = false;
  selectedProperty: any = null;
  subscriptions: Subscription[] = [];
  pdtSubscription: Subscription = new Subscription();
  id: number;
  usuario: User = new User();
  modalData: any | null = null;
  base64Image: string = '';

  constructor(private apiSrv: ApiService, private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
    const local = localStorage.getItem('userData');
    
    if (local != null) {
      this.loggedUser = JSON.parse(local);
    }        
  }
  
  getBase64Image(strImage: string) {
    this.base64Image = 'data:image/png;base64,' + strImage;
  }

  editProperty(id: number) {   
   this.getPropertiesById(id);
  }
  getProperties() {
    this.apiSrv.listPropertiesByOwner(this.loggedUser.idOwner).subscribe((res: any) => {
      this.propertiesList = res.data.properties;
      this.usuario = res.data;
      this.subscriptions.push(this.pdtSubscription)
    })
    
  }  

  getPropertiesById(id: number) {
    this.apiSrv.getProperty(id).subscribe((res: any) => {
      this.propertiesList = res.data.properties;
      localStorage.setItem('propertyData', JSON.stringify(res.data));
      this.subscriptions.push(this.pdtSubscription)
      debugger;
      this.router.navigate(['/editproperty', id]);
      this.getBase64Image('');
    })
    
  }

}
