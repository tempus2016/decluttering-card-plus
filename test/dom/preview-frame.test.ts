/*
 * Ideas 53 and 54: the preview frame's dark mode has to change the card's colours, and the
 * width caption has to say what the card really got when the dialog is narrower than the
 * width asked for.
 */
import { describe, it, expect, settle, until } from './runner';
import { stubHass } from './stubs';
import '../../src/preview-frame';

/* eslint-disable @typescript-eslint/no-explicit-any */

async function frame(width: number): Promise<any> {
  const box = document.createElement('div');
  box.style.width = `${width}px`;
  const el = document.createElement('decluttering-preview-frame') as any;
  el.hass = { ...stubHass(), themes: { default_theme: 'default', themes: {}, darkMode: false } };
  el.config = { type: 'markdown', content: 'x' };
  box.appendChild(el);
  document.body.appendChild(box);
  await el.updateComplete;
  await settle();
  return el;
}

const press = async (el: any, label: string): Promise<void> => {
  const button = [...el.shadowRoot.querySelectorAll('.seg button')].find(
    (b: any) => b.textContent.trim() === label,
  ) as any;
  if (!button) throw new Error(`no ${label} button`);
  button.click();
  await el.updateComplete;
  await settle();
};

describe('preview frame', () => {
  it('Dark puts Home Assistant dark colours on the card', async () => {
    const el = await frame(900);
    const holder = (): any => el.shadowRoot.querySelector('.stage > div');
    expect(holder().style.getPropertyValue('--card-background-color')).to.equal('#ffffff');
    await press(el, 'Dark');
    expect(holder().style.getPropertyValue('--card-background-color')).to.equal('#1c1c1c');
    expect(holder().style.getPropertyValue('--primary-text-color')).to.equal('#e1e1e1');
    await press(el, 'Light');
    expect(holder().style.getPropertyValue('--card-background-color'), 'light puts the light ones back').to.equal(
      '#ffffff',
    );
  });

  it('Both draws a light and a dark stage', async () => {
    const el = await frame(900);
    await press(el, 'Both');
    const holders = [...el.shadowRoot.querySelectorAll('.stage > div')] as any[];
    expect(holders.map((h) => h.style.getPropertyValue('--card-background-color'))).to.deep.equal([
      '#ffffff',
      '#1c1c1c',
    ]);
  });

  it('Light is light even when the dashboard around it is dark', async () => {
    document.body.style.setProperty('--card-background-color', '#1c1c1c');
    document.body.style.setProperty('--primary-background-color', '#111111');
    try {
      const el = await frame(900);
      await press(el, 'Light');
      const holder = el.shadowRoot.querySelector('.stage > div') as HTMLElement;
      expect(getComputedStyle(holder).getPropertyValue('--card-background-color').trim()).to.equal('#ffffff');
      expect(getComputedStyle(holder).backgroundColor).to.equal('rgb(250, 250, 250)');
    } finally {
      document.body.style.removeProperty('--card-background-color');
      document.body.style.removeProperty('--primary-background-color');
    }
  });

  it('the tablet caption says the real width when the dialog is narrower', async () => {
    const el = await frame(500);
    await press(el, 'Tablet');
    await until(
      () => /asked for 768/.test(el.shadowRoot.querySelector('.caption')?.textContent ?? ''),
      2000,
      'caption',
    );
    const caption = el.shadowRoot.querySelector('.caption').textContent;
    expect(caption).to.match(/^\d{3} px/);
    expect(caption).to.not.match(/^768/);
  });

  it('the phone caption is the phone width when it fits', async () => {
    const el = await frame(900);
    await press(el, 'Phone');
    await settle(4);
    expect(el.shadowRoot.querySelector('.caption').textContent.trim()).to.equal('388 px');
  });
});
