import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* Every reveal is a `from` tween, so the page is fully readable with the
   markup alone — if this bundle never runs, nothing stays hidden. */

const EASE = 'power3.out';

const mm = gsap.matchMedia();

/* ---------- the pinned video ----------
   Desktop only: pinning a section for 1.3 screens of scroll is a poor trade on
   a phone, where it costs a lot of scrolling and fights browser chrome that
   resizes the viewport mid-gesture. Below md the section just renders normally.

   Created first and refreshed first (refreshPriority: -1): it is the only
   trigger that changes page height, via pin spacing, so every other trigger
   below it must measure its position *after* that spacer exists. */
mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
	const frame = document.querySelector<HTMLElement>('[data-video-frame]');
	const grow = document.querySelector<HTMLElement>('[data-video-grow]');

	if (frame && grow) {
		const labels = frame.querySelectorAll('[data-video-label]');
		const copy = frame.querySelector('[data-video-copy]');

		/* Scaling a child keeps the frame's layout box fixed, so the pin never
		   has to re-measure and the growth stays on the compositor. */
		gsap.set(grow, { scale: 0.42, transformOrigin: 'center center' });
		gsap.set(copy, { opacity: 0, y: 26 });

		gsap
			.timeline({
				defaults: { ease: 'none' },
				scrollTrigger: {
					trigger: frame,
					start: 'top top',
					end: '+=130%',
					pin: true,
					scrub: 1,
					anticipatePin: 1,
					invalidateOnRefresh: true,
					refreshPriority: -1,
				},
			})
			.to(labels, { opacity: 0, duration: 0.16 }, 0)
			.to(grow, { scale: 1, ease: 'power1.inOut', duration: 0.72 }, 0)
			.to(copy, { opacity: 1, y: 0, duration: 0.22 }, 0.74);
	}
});

/* Everything below is lightweight enough to keep on phones. */
mm.add('(prefers-reduced-motion: no-preference)', () => {
	/* ---------- headlines, revealed line by line ---------- */
	document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
		/* 'soft' skips the overflow mask: those headlines carry inline art that
		   sits taller than its line box and would get clipped. */
		const soft = el.dataset.split === 'soft';
		const onLoad = el.hasAttribute('data-split-immediate');

		SplitText.create(el, {
			type: 'lines',
			mask: soft ? undefined : 'lines',
			autoSplit: true,
			onSplit: (self) =>
				gsap.from(self.lines, {
					yPercent: soft ? 0 : 115,
					y: soft ? 34 : 0,
					opacity: soft ? 0 : 1,
					duration: 1.1,
					ease: 'power4.out',
					stagger: 0.11,
					...(onLoad
						? { delay: 0.15 }
						: { scrollTrigger: { trigger: el, start: 'top 88%' } }),
				}),
		});
	});

	/* ---------- single elements ---------- */
	document.querySelectorAll<HTMLElement>('[data-anim]').forEach((el) => {
		const kind = el.dataset.anim;
		gsap.from(el, {
			opacity: 0,
			y: kind === 'fade' ? 0 : 28,
			scale: kind === 'scale' ? 0.94 : 1,
			duration: 0.9,
			ease: EASE,
			scrollTrigger: { trigger: el, start: 'top 90%' },
		});
	});

	/* ---------- grids and lists, staggered ---------- */
	document.querySelectorAll<HTMLElement>('[data-anim-group]').forEach((group) => {
		const items = group.querySelectorAll('[data-anim-item]');
		if (!items.length) return;

		gsap.from(items, {
			opacity: 0,
			y: 44,
			duration: 0.9,
			ease: EASE,
			stagger: 0.09,
			scrollTrigger: { trigger: group, start: 'top 88%' },
		});
	});

	/* ---------- hero cup: lands on load, then drifts with scroll ---------- */
	const cup = document.querySelector<HTMLElement>('[data-hero-cup]');
	if (cup) {
		gsap.from(cup, {
			opacity: 0,
			y: 90,
			scale: 0.92,
			duration: 1.4,
			ease: 'power3.out',
			delay: 0.3,
		});
		gsap.to(cup, {
			yPercent: -10,
			ease: 'none',
			scrollTrigger: { trigger: cup, start: 'top 75%', end: 'bottom top', scrub: 0.6 },
		});
	}

	/* ---------- StirUp stickers: pop in, then breathe ---------- */
	document.querySelectorAll<HTMLElement>('[data-badge]').forEach((badge, i) => {
		gsap.from(badge, {
			opacity: 0,
			scale: 0.3,
			duration: 0.7,
			ease: 'back.out(2.2)',
			delay: i * 0.09,
			scrollTrigger: { trigger: badge, start: 'top 95%' },
		});
		/* The inline rotation is the CSS `rotate` property, so writing a
		   transform here leaves each sticker's tilt intact. */
		gsap.to(badge, {
			y: i % 2 ? 9 : -9,
			duration: 2.4 + i * 0.35,
			ease: 'sine.inOut',
			repeat: -1,
			yoyo: true,
		});
	});

	/* ---------- the two drinks flanking the order CTA ---------- */
	document.querySelectorAll<HTMLElement>('[data-float]').forEach((el) => {
		const dir = Number(el.dataset.float) || 1;
		gsap.from(el, {
			opacity: 0,
			y: 70,
			duration: 1.1,
			ease: EASE,
			scrollTrigger: { trigger: el, start: 'top 92%' },
		});
		gsap.to(el, {
			yPercent: -9 * dir,
			ease: 'none',
			scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
		});
	});

	const bands = document.querySelectorAll('[data-cta-band]');
	if (bands.length) {
		gsap.from(bands, {
			opacity: 0,
			yPercent: 70,
			duration: 0.95,
			ease: 'power3.out',
			stagger: 0.13,
			scrollTrigger: { trigger: bands[0], start: 'top 90%' },
		});
	}

	const crafted = document.querySelector<HTMLElement>('[data-crafted-img]');
	if (crafted) {
		gsap.from(crafted, {
			opacity: 0,
			scale: 1.08,
			duration: 1.2,
			ease: 'power3.out',
			scrollTrigger: { trigger: crafted, start: 'top 88%' },
		});
	}
});

/* Display faces land after first paint and reflow every split line. */
document.fonts?.ready.then(() => ScrollTrigger.refresh());
