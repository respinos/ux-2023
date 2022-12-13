import { LitElement, css, html } from 'lit';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/menu-label/menu-label.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/popup/popup.js';

import './lib/search-form.js';

import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

import logo from './assets/phire-htdl-v12.png';

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.85/dist');

export class HathiWebsiteHeader extends LitElement {
  static properties = {
    name: {},
    containerWidth: { type: Number },
    includeSearch: { attribute: 'include-search' },
  };

  // Define scoped styles right with your component, in plain CSS
  static styles = css`
    :host {
      color: blue;
      --orange: #e67821;
    }

    *, *::after, *::before {
      box-sizing: border-box;
    }

    header {
      max-width: 1170px;
      margin: 1rem auto;
    }

    .menu {
      display: grid;
      gap: 1rem;
      align-items: center;
      grid-template: "logo nav actions" min-content / min-content 1fr max-content;
    }

    .logo {
      grid-area: logo;
      height: 60px;
    }

    nav.nav {
      grid-area: nav;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    nav.nav sl-button::part(base) {
      color: black;
      padding: 0;
    }

    nav.nav sl-button::part(base)::hover {
      color: orange;
      padding: 0;
      background: black;
    }

    nav.nav sl-button::part(label) {
      padding-left: 0.25rem;
      padding-right: 0.25rem;
    }

    nav.actions {
      grid-area: actions;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    nav.actions sl-button::part(base) {
      text-transform: uppercase;
      font-weight: bold;
      color: black;
      padding-inline-end: 0;
      padding: 0;
    }

    nav.actions sl-button::part(label) {
      padding-left: 0.25rem;
      padding-right: 0.25rem;
    }

    nav.actions sl-button::part(suffix) {
      color: var(--orange);
    }
  `;

  _observer = new ResizeObserver(this._adjustNavigation.bind(this));

  constructor() {
    super();
    // Declare reactive properties
    this.containerWidth = 0;
    this.name = 'World';
    this.includeSearch = 'true';

    // this may be shameless forest green
    if ( location.pathname.indexOf('/Search/Advanced') > -1 || 
         location.search.indexOf('page=advanced') > -1 ) {
      this.includeSearch = 'false';
    }

    this.MEDIA_ROOT = '';
    // this is surprisingly complicated...
    if ( location.hostname != 'localhost' && window.HT ) {
      let assetUrl = new URL(document.querySelector('script[data-shoelace]').src);
      assetUrl.pathname = '';
      this.MEDIA_ROOT = assetUrl.toString();
    }
  }

  disconnectedCallback() {
    this._observer.disconnect();
  }

  firstUpdated() {
    this._observer.observe(this.renderRoot.querySelector('header'));
  }

  // Render the UI as a function of component state
  render() {
    return html`
      <header>
        <div class="menu">
          <a href="https://www.hathitrust.org" aria-label="Home"><img class="logo" src="${this.MEDIA_ROOT}/dist/${logo}" /></a>
          ${
            this.containerWidth == 0 ?
              html`<div><sl-icon name="smartwatch"></sl-icon></div>` : 
              this.containerWidth >= 1170 ?
              html`<nav class="nav">
                <sl-dropdown>
                  <sl-button variant="text" slot="trigger" caret>About</sl-button>
                  <sl-menu>
                    ${this._aboutMenuItems()}
                  </sl-menu>
                </sl-dropdown>
                <sl-dropdown>
                  <sl-button variant="text" slot="trigger" caret>The Collection</sl-button>
                  <sl-menu>
                    ${this._collectionMenuItems()}
                  </sl-menu>
                </sl-dropdown>
                <sl-dropdown>
                  <sl-button variant="text" slot="trigger" caret>Member Libraries</sl-button>
                  <sl-menu>
                    ${this._memberLibrariesMenuItems()}
                  </sl-menu>
                </sl-dropdown>
                <sl-button variant="text">Join Us</sl-button>
                <sl-dropdown>
                  <sl-button variant="text" slot="trigger" caret>News & Events</sl-button>
                  <sl-menu>
                    ${this._newsEventsMenuItems()}
                  </sl-menu>
                </sl-dropdown>
              </nav>` : 
              html `
              <nav class="nav-compact">
                <sl-dropdown>
                  <sl-button slot="trigger">
                    Menu
                    <sl-icon slot="suffix" name="list"></sl-icon>
                  </sl-button>
                  <sl-menu>
                    <sl-menu-label>About</sl-menu-label>
                    ${this._aboutMenuItems()}
                    <sl-divider></sl-divider>
                    <sl-menu-label>The Collection</sl-menu-label>
                    ${this._collectionMenuItems()}
                    <sl-divider></sl-divider>
                    <sl-menu-label>Member Libraries</sl-menu-label>
                    ${this._memberLibrariesMenuItems()}
                    <sl-divider></sl-divider>
                    <sl-menu-item>Join Us</sl-menu-item>
                    <sl-divider></sl-divider>
                    <sl-menu-label>News & Events</sl-menu-label>
                    ${this._newsEventsMenuItems()}
                  </sl-menu>
              </nav>
              `
          }
          <nav class="actions">
            <sl-button variant="text">
              Get Help
              <sl-icon slot="suffix" name="arrow-up-right-square-fill"></sl-icon>
            </sl-button>
            <sl-button variant="text">
              Log In
              <sl-icon slot="suffix" name="person-fill"></sl-icon>
            </sl-button>
          </nav>
        </div>
      </header>
      ${
        this.includeSearch == 'true' ? 
          html`<hathi-search-form></hathi-search-form>` : ''
      }
    `;
  }

  _adjustNavigation() {
    this.containerWidth = this.offsetWidth;
  }

  _aboutMenuItems() {
    return html`
      <sl-menu-item>Our Mission</sl-menu-item>
      <sl-menu-item>HathiTrust Research Center</sl-menu-item>
      <sl-menu-item>HathiTrust by the Numbers</sl-menu-item>
      <sl-menu-item>Our Team</sl-menu-item>
      <sl-menu-item>Careers</sl-menu-item>
    `;
  }

  _collectionMenuItems() {
    return html`
      <sl-menu-item>About the Collection</sl-menu-item>
      <sl-menu-item>How to Search & Access</sl-menu-item>
      <sl-menu-item>How to Contribute Content</sl-menu-item>
      <sl-menu-item>Preservation</sl-menu-item>
      <sl-menu-item>Terms & Conditions</sl-menu-item>
    `;
  }

  _memberLibrariesMenuItems() {
    return html`
      <sl-menu-item>Member List</sl-menu-item>
      <sl-menu-item>Services</sl-menu-item>
      <sl-menu-item>Collaborations</sl-menu-item>
      <sl-menu-item>Governance & Groups</sl-menu-item>
      <sl-menu-item>Member Groups</sl-menu-item>
    `;
  }

  _newsEventsMenuItems() {
    return html`
      <sl-menu-item>Perspectives</sl-menu-item>
      <sl-menu-item>Newsletters</sl-menu-item>
      <sl-menu-item>Events & Webinars</sl-menu-item>
    `;
  }

}
customElements.define('hathi-website-header', HathiWebsiteHeader);
