import { Component, OnInit } from '@angular/core';

import { HeroesService } from '../../services/heroes.service';

import { Heroe } from '../../interfaces/heroes.interface';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styles: [`
    
  `
  ]
})
export class ListadoComponent implements OnInit {

  heroes: Heroe[] = [];

  constructor( private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.firestoreService.getHeroes().subscribe( resp => {
      this.heroes = resp.map( (e) => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as Heroe)
        }
      });
    });   
  }
}
