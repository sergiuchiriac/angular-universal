import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  data = {
    name: 'Michael Jordan',
    bio: 'Former baseball player',
    image: 'https://firebasestorage.googleapis.com/v0/b/projectai-prod.appspot.com/o/project%2Fthumbnail%2Fpoweredbyai2.png?alt=media&token=2f13563f-aad3-4230-9108-0d3f36bddee3'
  };
  constructor(private title: Title, private meta: Meta) { }

  ngOnInit() {
    this.title.setTitle(this.data.name);
    this.meta.addTags([
      { name: 'twitter:card', content: 'summary' },
      { name: 'og:url', content: '/about' },
      { name: 'og:title', content: this.data.name },
      { name: 'og:description', content: this.data.bio },
      { name: 'og:image', content: this.data.image }
    ]);
  }

}
