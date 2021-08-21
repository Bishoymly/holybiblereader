import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Injectable({
  providedIn: 'root'
})

export class CanonicalService {

  constructor(@Inject(DOCUMENT) private dom:any) { }

  createCanonicalLink(url?: string) {
    let canURL = url == undefined ? this.dom.URL : url;

    canURL = canURL.split('#')[0];
    canURL = canURL.replace('http://','https://');
    canURL = canURL.replace('//www.','//');

    let link: HTMLLinkElement = this.dom.querySelector("link[rel='canonical']");
    if(link == undefined){
      link = this.dom.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.dom.head.appendChild(link);
    }

    link.setAttribute('href', canURL);
  }

}
