export class StopClock extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'closed' });

    const style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', import.meta.resolve('stopclock.css'));
    shadow.append(style);

    this.span = document.createElement('span');
    this.span.textContent = '00:00:00';

    shadow.append(this.span);
  }
  update() {
    this.span.textContent = new Date().toLocaleTimeString();
  }
}

customElements.define('stop-clock', StopClock);