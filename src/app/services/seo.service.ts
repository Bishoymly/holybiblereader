import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})

export class SEOService {

  constructor(
    @Inject(DOCUMENT) private dom:any,
    private titleService: Title,
    private meta: Meta) { }

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

  setTitle(title: string){
    this.titleService.setTitle(title);
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('name="twitter:title"');
    this.meta.addTag({ property: 'og:title', content: title});
    this.meta.addTag({ name: 'twitter:title', content: title});
  }

  setDescription(desc: string){
    this.meta.removeTag('name="description"');
    this.meta.removeTag('property="og:description"');
    this.meta.removeTag('name="twitter:description"');
    this.meta.addTag({ name: 'description', content: desc});
    this.meta.addTag({ property: 'og:description', content: desc});
    this.meta.addTag({ name: 'twitter:description', content: desc});
  }

}
