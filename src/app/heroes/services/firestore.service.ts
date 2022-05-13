import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Heroe } from '../interfaces/heroes.interface';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private angularFirestore: AngularFirestore) {}

  getHeroes(){
    return this.angularFirestore.collection('heroes').snapshotChanges();
  }

  getHeroeById( id: string ) {
    return this.angularFirestore.doc<Heroe>('heroes/' + id).valueChanges();
  }

  getSugerencias(termino: string){
    return this.angularFirestore.collection('heroes', ref => ref.where('superhero', '==', termino)).snapshotChanges();
  }

  addHeroe(heroe: Heroe){
    return new Promise<any>((resolve, reject) => {
      this.angularFirestore
      .collection('heroes')
      .add(heroe)
      .then(document => {
        heroe.id = document.id;
        this.updateHero(heroe);
      }, err => reject(err));
    });
  }

  updateHero(heroe: Heroe){
    return this.angularFirestore.doc('heroes/' + heroe.id).update(heroe);
  }

  deleteHero(id: string){
    return this.angularFirestore.doc('heroes/' + id).delete();
  }

}