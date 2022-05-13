import { Component, OnInit, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Publisher, Heroe } from '../../interfaces/heroes.interface';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';
import { FirestoreService } from '../../services/firestore.service';



@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    img {
      width: 100%;
      border-radius: 5px;
    }
  `]
})
export class AgregarComponent implements OnInit {
  isEdit: boolean = false;

  publishers = [
    {
      id: 'DC Comics',
      desc: "DC - Comics"
    },
    {
      id: 'Marvel Comics',
      desc: "Marvel - Comics"
    }
  ];

  heroe: Heroe = {
    id: '',
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.MarvelComics,
    alt_img: ''
  }

  constructor( private firestoreService: FirestoreService,
               private activatedRoute: ActivatedRoute,
               private router: Router,
               private snackBar: MatSnackBar,
               private dialog: MatDialog) { }

  ngOnInit(): void {
    if(!this.router.url.includes('editar')){
      return;
    }   

    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.firestoreService.getHeroeById(id))
      )
      .subscribe( heroe => {
        this.heroe = heroe
        this.isEdit = true;
      });
  }

  guardar(): void{
    //campos obligatorios
    if( this.heroe.superhero.trim().length === 0 ||
        this.heroe.alter_ego.trim().length === 0 ||
        this.heroe.first_appearance.trim().length === 0 ||
        this.heroe.characters.trim().length === 0 ||
        this.heroe.alt_img?.trim().length === 0 ) {
      return;
    }
    
    if( this.heroe.id?.trim().length != 0 ) {
      //Actualizar
      this.firestoreService.updateHero(this.heroe)
        .then( 
          () => this.mostrarSnackBar( 'Registro actualizdo' )
        );
    }else {
      //Agregar
      console.log("dentro de agregar");
      this.firestoreService.addHeroe(this.heroe);

      this.router.navigate(['heroes/listado']);
      this.mostrarSnackBar( 'Registro agregado' );
      
    }
  }

  borrarHeroe(){

    const dialog = this.dialog.open( ConfirmarComponent, {
      width: 'auto',
      data: { ...this.heroe }
    });

    dialog.afterClosed()
      .subscribe( (result) => {
      if( result ) {
        this.firestoreService.deleteHero(this.heroe.id!)
        .then( () => {
            this.mostrarSnackBar( 'Registro borrado' );
            this.router.navigate(['heroes/listado']);
          }
        )
      }
    })
  }

  mostrarSnackBar ( mensaje: string ): void {
    this.snackBar.open( mensaje, 'Ok!', {
      duration: 2500
    });
  }

}

