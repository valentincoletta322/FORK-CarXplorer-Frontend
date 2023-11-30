import { Component } from '@angular/core';
import { PublicacionesService } from '../services/publicaciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  
  newListing: any = {
    title: '',
    description: '',
    price: '',
    currency: '',
    state: ''
  }

  statusPublish!: string;
  previewListing: any = {};

  selectedFile: File | null = null; // Para almacenar la imagen seleccionada

  constructor(private pubService: PublicacionesService, private router: Router) {}

  onSubmit() {
    const cuerpo = new FormData();
    cuerpo.append('title', this.newListing.title);
    cuerpo.append('description', this.newListing.description);
    cuerpo.append('price', this.newListing.price);
    cuerpo.append('currency', this.newListing.currency);
    cuerpo.append('state', this.newListing.state);

    if (this.selectedFile) {
      const extension = this.selectedFile.name.split('.').pop();
      const type = 'image/${extension}';
      const blob = new Blob([this.selectedFile], { type });
      cuerpo.append('listingPhoto',blob, this.selectedFile.name);
      console.log(cuerpo);
    }

    this.pubService.subirPublicacion(cuerpo).subscribe(
      (response:any) => {
        console.log(response);
        this.statusPublish = response.message;
        this.router.navigate(['/menu']);
      },
      error => {
        console.log(error);
        this.statusPublish = error.error;
      }
    );;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  closeError(){
    this.statusPublish = '';
  }

  updatePreview() {
    this.previewListing = { ...this.newListing };
  }

}
