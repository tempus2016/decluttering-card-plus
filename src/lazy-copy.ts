import { HomeAssistant, createThing } from 'custom-card-helpers';
import { LAZY_MARGIN, placeholderHeight } from './layout';
import { HELPERS } from './shared';

/*
 * One copy of a `lazy: true` repeat, waiting to come into view. The card has already
 * worked out what the copy is; this holds its place in the stack at the height a built
 * copy took, and creates the real card once it is within a few hundred pixels of the
 * screen. Once built it stays built - scrolling back up does not tear it down again.
 */
/*
 * The first copy is built straight away, but it is only the empty shell of a card when the
 * waiting copies first measure it - 34px of a 133px card - and every placeholder kept that,
 * so the page jumped as each one came in. The copies waiting on a first copy follow its
 * height as it settles instead: one observer for every first copy, each telling the copies
 * that copy their height from it.
 */
export const waitingOn = new WeakMap<Element, Set<DeclutteringLazyCopy>>();

const firstCopies =
  typeof ResizeObserver === 'undefined'
    ? undefined
    : new ResizeObserver((entries) => {
        for (const entry of entries) for (const copy of waitingOn.get(entry.target) ?? []) copy.holdPlace();
      });

export class DeclutteringLazyCopy extends HTMLElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _card?: any;
  // The first copy whose height this one is keeping, while it waits.
  private _following?: Element;
  private _hassValue?: HomeAssistant;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _built?: any;
  private _watch?: IntersectionObserver;
  private _sized?: ResizeObserver;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public setConfig(config: any): void {
    this._card = config?.card;
    if (this._built) this._configure(this._built);
  }

  set hass(hass: HomeAssistant) {
    this._hassValue = hass;
    if (this._built) this._built.hass = hass;
  }

  public connectedCallback(): void {
    if (this._built) return;
    this.style.display = 'block';
    this.holdPlace();
    this._follow();
    // The first copy may not be in the stack yet when this one is put on the page.
    requestAnimationFrame(() => {
      if (this._built || !this.isConnected) return;
      this.holdPlace();
      this._follow();
    });
    if (typeof IntersectionObserver === 'undefined') {
      this._build();
      return;
    }
    this._watch ??= new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) this._build();
      },
      { rootMargin: LAZY_MARGIN },
    );
    this._watch.observe(this);
  }

  public disconnectedCallback(): void {
    this._watch?.disconnect();
    this._unfollow();
  }

  /*
   * The first copy in the same stack, which was built straight away. Each copy sits in a
   * hui-card of its own, side by side in the stack, so the first of those is two levels up
   * and across. Anything else in the way and there is none.
   */
  private _firstCopy(): Element | undefined {
    const own = this.parentElement;
    const first = own?.parentElement?.firstElementChild;
    return first && first !== own && first !== this ? first : undefined;
  }

  /** Keeps the first copy's height, or the default height when there is none to go by. */
  public holdPlace(): void {
    if (this._built) return;
    this.style.minHeight = `${placeholderHeight(this._firstCopy()?.getBoundingClientRect().height)}px`;
  }

  private _follow(): void {
    const first = this._firstCopy();
    if (!first || !firstCopies || first === this._following) return;
    this._unfollow();
    this._following = first;
    const copies = waitingOn.get(first) ?? new Set<DeclutteringLazyCopy>();
    if (!copies.size) firstCopies.observe(first);
    copies.add(this);
    waitingOn.set(first, copies);
  }

  private _unfollow(): void {
    const first = this._following;
    if (!first) return;
    this._following = undefined;
    const copies = waitingOn.get(first);
    copies?.delete(this);
    if (copies && !copies.size) {
      waitingOn.delete(first);
      firstCopies?.unobserve(first);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _configure(thing: any): void {
    if (thing.localName === 'hui-card') thing.config = this._card;
    else thing.setConfig?.(this._card);
  }

  private async _build(): Promise<void> {
    if (this._built || !this._card) return;
    this._watch?.disconnect();
    this._unfollow();
    // Home Assistant's own card wrapper, as for every other card this bundle creates.
    const wrapper = customElements.get('hui-card');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let thing: any;
    if (wrapper) {
      thing = new wrapper();
      thing.config = this._card;
    } else if (HELPERS) {
      thing = (await HELPERS).createCardElement(this._card);
    } else {
      thing = createThing(this._card);
    }
    this._built = thing;
    if (this._hassValue) thing.hass = this._hassValue;
    this.appendChild(thing);
    // The room kept for it is let go once the card has a size of its own, not before, or
    // everything below would jump up and back down again.
    this._sized = new ResizeObserver(() => {
      if (thing.getBoundingClientRect().height > 0) {
        this.style.minHeight = '';
        this._sized?.disconnect();
      }
    });
    this._sized.observe(thing);
  }

  public getCardSize(): number | Promise<number> {
    return this._built?.getCardSize?.() ?? 1;
  }
}
