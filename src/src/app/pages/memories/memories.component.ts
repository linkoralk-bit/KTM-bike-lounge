import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute
} from '@angular/router';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  MemoryService
} from '../../services/memory.service';

import {
  ApiService
} from '../../services/api.service';

@Component({
  selector: 'app-memories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './memories.component.html',
  styleUrls: ['./memories.component.css']
})
export class MemoriesComponent
implements OnInit, OnDestroy {

  slug: string = '';

  memories: any[] = [];

  selectedFiles: File[] = [];

  uploaderName: string = '';

  uploadMessage: string = '';

  slideshowOpen = false;

  currentSlideIndex = 0;

  slideInterval: any;

  refreshInterval: any;

  loading = false;

  showAlbum = false;

  eventData: any;

  coverImage = '';

  audio = new Audio('/music/memory-music.mp3');

  constructor(
    private route: ActivatedRoute,
    private memoryService: MemoryService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {

    this.slug =
      this.route.snapshot.paramMap.get('slug') || '';

    this.loadEvent();

  }

 ngOnDestroy(): void {

  clearInterval(this.refreshInterval);

  clearInterval(this.slideInterval);

  this.audio.pause();

  this.audio.currentTime = 0;

}

  // =========================================
  // LOAD EVENT
  // =========================================

  loadEvent() {

    this.apiService.getEvent(this.slug)
      .subscribe({

        next: (res: any) => {

          this.eventData = res;

          if (
            res.gallery &&
            res.gallery.length
          ) {

            this.coverImage =
              res.gallery[0];

          }

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  // =========================================
  // VIEW ALBUM
  // =========================================

  viewAlbum() {

    this.showAlbum = true;

    this.loadApprovedMemories();

    this.refreshInterval =
      setInterval(() => {

        this.loadApprovedMemories();

      }, 15000);

  }

  // =========================================
  // LOAD MEMORIES
  // =========================================

  loadApprovedMemories() {

    this.loading = true;
    this.memoryService
      .getMemoriesBySlug(this.slug)
      .subscribe({

        next: (res: any) => {

          this.memories = res;

          this.loading = false;

        },

        error: (err) => {

          console.error(err);

          this.loading = false;

        }

      });

  }

  // =========================================
  // FILE SELECT
  // =========================================

  onFileSelect(event: any) {

    this.selectedFiles =
      Array.from(event.target.files);

  }

  // =========================================
  // UPLOAD MEMORIES
  // =========================================

  uploadMemories() {

    if (!this.selectedFiles.length) {

      alert('Please select images');

      return;

    }

    this.selectedFiles.forEach((file: File) => {

      const formData = new FormData();

      formData.append(
        'eventId',
        this.eventData._id
      );

      formData.append(
        'guestName',
        this.uploaderName || 'Guest'
      );

      formData.append(
        'message',
        ''
      );

      formData.append(
        'image',
        file
      );

      this.memoryService
        .uploadMemory(formData)
        .subscribe({

          next: () => {

            this.uploadMessage =
              'Images uploaded successfully ❤️';

            this.loadApprovedMemories();

          },

          error: (err) => {

            console.error(err);

            alert('Upload failed');

          }

        });

    });

    this.selectedFiles = [];

    this.uploaderName = '';

  }

  // =========================================
  // SLIDESHOW
  // =========================================

 openSlideshow(index: number = 0) {

  if (!this.memories.length) return;

  this.currentSlideIndex = index;

  this.slideshowOpen = true;

  // MUSIC START
  this.audio.pause();

  this.audio.currentTime = 0;

  this.audio.loop = true;

  this.audio.volume = 0.6;

  this.audio.play();

  this.startSlideshow();

}

  closeSlideshow() {

  this.slideshowOpen = false;

  clearInterval(this.slideInterval);

  // MUSIC STOP
  this.audio.pause();

  this.audio.currentTime = 0;

}

  startSlideshow() {

    clearInterval(this.slideInterval);

    this.slideInterval = setInterval(() => {

      this.nextSlide();

    }, 3000);

  }

  nextSlide() {

    if (!this.memories.length) return;

    this.currentSlideIndex++;

    if (
      this.currentSlideIndex >=
      this.memories.length
    ) {

      this.currentSlideIndex = 0;

    }

  }

  previousSlide() {

    if (!this.memories.length) return;

    this.currentSlideIndex--;

    if (this.currentSlideIndex < 0) {

      this.currentSlideIndex =
        this.memories.length - 1;

    }

  }

}