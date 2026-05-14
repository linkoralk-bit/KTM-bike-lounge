import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, OnDestroy {

  // ── Event Data ──────────────────────────────────────────
  eventName     = 'KTM BIKE LOUNGE';
  eventSubtitle = 'GRAND OPENING';
  eventTagline  = 'BIGGEST KTM SHOWROOM IN SRI LANKA';
  showroom      = 'KTM PALIYAGODA';
  poweredBy     = 'HV ENTERPRISES PVT LTD';

  // Private client invitation serial — generated/assigned per guest
  inviteSerial  = 'HV-2026-0001';

  event = {
    date     : 'MAY 18',
    year     : '2026',
    day      : 'MONDAY',
    time     : '10:00',
    timeSub  : 'A.M. SHARP',
    venue    : 'PALIYAGODA',
    address  : '389 NEGOMBO ROAD, PELIYAGODA',
    country  : 'SRI LANKA',
    dress    : 'SMART CASUAL',
    arrival  : 'FROM 09:30 A.M.',
    seating  : 'RESERVED',
    rsvpBy   : 'MAY 15, 2026',
  };

  contacts: { label: string; number: string; href: string }[] = [
    { label: 'Primary',   number: '075 900 9888', href: 'tel:0759009888' },
    { label: 'Secondary', number: '072 166 5461', href: 'tel:0721665461' },
  ];

  rsvpWhatsApp =
    'https://wa.me/94759009888?text=I%20will%20attend%20the%20KTM%20Bike%20Lounge%20Grand%20Opening';

  // Gallery — real client-supplied bike photography
  gallery: { src: string; alt: string; caption: string; modifier?: string }[] = [
    { src: 'assets/duke-front-1.jpeg', alt: 'KTM Duke front',   caption: 'DUKE · NIGHT BLACK',     modifier: 'g-tall' },
    { src: 'assets/duke-tank-1.jpeg',  alt: 'KTM Duke tank',    caption: 'ELECTRIC ORANGE' },
    { src: 'assets/duke-side.jpeg',    alt: 'KTM Duke side',    caption: 'SIDE PROFILE' },
    { src: 'assets/duke-tank-2.jpeg',  alt: 'KTM Duke 3/4',     caption: 'DUKE · 3/4' },
    { src: 'assets/duke-front-2.jpeg', alt: 'KTM Duke headlamp',caption: 'SIGNATURE LED · HV ENTERPRISES', modifier: 'g-wide' },
  ];

  heroImage = 'assets/duke-front-3.jpeg';
  audio!: HTMLAudioElement;
isMusicPlaying = false;
  // ── Countdown State ─────────────────────────────────────
  countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  private countdownInterval?: ReturnType<typeof setInterval>;

  // ── Lifecycle ────────────────────────────────────────────
  ngOnInit(): void {
    this.startCountdown();
    this.initAnimations();
    window.addEventListener('load', () => {
    this.initMusic();
  });
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

private initMusic(): void {
  this.audio = new Audio('/music/energy-sound.mp3');

  this.audio.loop = true;
  this.audio.volume = 0.4;
  this.audio.preload = 'auto';

  const playMusic = async () => {
    try {
      await this.audio.play();
      this.isMusicPlaying = true;
    } catch (err) {
      // autoplay blocked — wait for first interaction
      const resumeMusic = async () => {
        try {
          await this.audio.play();
          this.isMusicPlaying = true;
        } catch (_) {}

        document.removeEventListener('click', resumeMusic);
      };

      document.addEventListener('click', resumeMusic, { once: true });
    }
  };

  playMusic();
}

toggleMusic(): void {
  if (!this.audio) return;

  if (this.isMusicPlaying) {
    this.audio.pause();
    this.isMusicPlaying = false;
  } else {
    this.audio.play();
    this.isMusicPlaying = true;
  }
}

  // ── Countdown Timer ──────────────────────────────────────
  private startCountdown(): void {
    const targetDate = new Date('2026-05-18T10:00:00');

    const update = () => {
      const now  = new Date().getTime();
      const diff = targetDate.getTime() - now;

      if (diff <= 0) {
        this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        return;
      }

      this.countdown = {
        days    : Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours   : Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes : Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds : Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    update();
    this.countdownInterval = setInterval(update, 1000);
  }

  // ── Pad number with leading zero ─────────────────────────
  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  // ── Entry Animations ─────────────────────────────────────
  private initAnimations(): void {
    const sections = document.querySelectorAll<HTMLElement>('[data-reveal]');
    sections.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      }, 300 + i * 150);
    });

    const logo = document.querySelector<HTMLElement>('.ktm-svg');
    if (logo) {
      setInterval(() => {
        logo.style.transition = 'filter 1.2s ease-in-out';
        logo.style.filter =
          'drop-shadow(0 0 36px rgba(255,100,0,0.9)) drop-shadow(0 0 80px rgba(255,100,0,0.4))';
        setTimeout(() => {
          logo.style.filter =
            'drop-shadow(0 0 24px rgba(255,100,0,0.6)) drop-shadow(0 0 60px rgba(255,100,0,0.25))';
        }, 1200);
      }, 2800);
    }
  }

  // ── Contact tap handler ───────────────────────────────────
  onContactTap(href: string): void {
    window.location.href = href;
  }

  onRSVP(): void {
    window.open(this.rsvpWhatsApp, '_blank');
  }
}

/* ─────────────────────────────────────────────────────────────
   STANDALONE / NON-ANGULAR VANILLA JS FALLBACK
   (used when this script is loaded directly via <script> tag)
   ─────────────────────────────────────────────────────────────*/
if (typeof window !== 'undefined' && !(window as any).__ngLoaded) {
  (() => {
    const targetDate = new Date('2026-05-18T10:00:00');
    const pad = (n: number) => n.toString().padStart(2, '0');

    function updateCountdown() {
      const diff = targetDate.getTime() - Date.now();

      const days    = Math.max(0, Math.floor(diff / 86400000));
      const hours   = Math.max(0, Math.floor((diff % 86400000) / 3600000));
      const minutes = Math.max(0, Math.floor((diff % 3600000) / 60000));
      const seconds = Math.max(0, Math.floor((diff % 60000) / 1000));

      const set = (id: string, v: string) => {
        const el = document.getElementById(id);
        if (el) el.textContent = v;
      };

      set('cd-days',  pad(days));
      set('cd-hours', pad(hours));
      set('cd-mins',  pad(minutes));
      set('cd-secs',  pad(seconds));

      const legacy = document.getElementById('countdown-display');
      if (legacy) {
        legacy.textContent = `${pad(days)}D  ${pad(hours)}H  ${pad(minutes)}M  ${pad(seconds)}S`;
      }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Cursor ripple on invitation card
    const wrapper = document.querySelector<HTMLElement>('.invitation-wrapper');
    if (wrapper) {
      wrapper.addEventListener('click', (e: MouseEvent) => {
        const ripple = document.createElement('div');
        const rect   = wrapper.getBoundingClientRect();

        ripple.style.cssText = `
          position: absolute;
          width: 1px; height: 1px;
          background: rgba(255,100,0,0.35);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple-out 0.8s ease-out forwards;
          left: ${e.clientX - rect.left}px;
          top:  ${e.clientY - rect.top}px;
          pointer-events: none;
          z-index: 999;
        `;

        if (!document.getElementById('ripple-style')) {
          const style = document.createElement('style');
          style.id = 'ripple-style';
          style.textContent = `
            @keyframes ripple-out {
              to { transform: scale(400); opacity: 0; }
            }
          `;
          document.head.appendChild(style);
        }

        wrapper.style.position = 'relative';
        wrapper.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    }
  })();
}
