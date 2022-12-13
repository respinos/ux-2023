import { LitElement, css, html } from 'lit';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';

import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';

export class HathiSearchForm extends LitElement {
  static properties = {
    for: { type: String },
  };

  static styles = css`
    .search-form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
      max-width: 1170px;
      margin: 1rem auto;
    }

    .search-form > form {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin: auto;

      gap: 0rem;

      font-size: 1rem;
      font-family: sans-serif;

      width: 100%;
    }

    .search-form > form > * + * {
      border-left: 0px;
    }

    .search-form sl-input::part(base) {
      --sl-input-border-radius-large: 8px;
      --sl-input-font-size-large: 1rem;

      border-top-right-radius: 0;
      border-bottom-right-radius: 0;

    }

    sl-select[data-action="searchtype"] {
      min-width: 30ch;
    }

    .search-form sl-select::part(base) {
      --sl-input-border-radius-large: 0;
      --sl-input-font-size-large: 1rem;
    }

    sl-button[data-action="search"]::part(base) {

      --sl-input-border-width: 1px;

      background: #e87821;
      color: white;
      text-transform: uppercase;
      font-weight: bold;
      border: 1px solid #e87821;

      display: flex;
      align-items: center;

      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    sl-input#q1 {
      flex-grow: 1;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    .search-form[data-for="website"] *[data-for="library"] {
      display: none !important;
    }

    .search-form[data-for="library"] *[data-for="website"] {
      display: none !important;
    }

    .search-form form label {
      display: none;
    }

    .search-links {
      display: flex;
      justify-content: space-between;
      gap: 1.5rem;
      width: 98%;
      margin-left: auto;
      margin-right: auto;
    }

    .search-links > div {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 1.5rem;
    }

    .search-links a {
      color: black;
      display: flex;
      flex-direction: row;
      gap: 0.25rem;
      align-items: center;
      text-decoration: none;
    }

    .search-form[data-view="full"] *[data-for-view="full"] {
      display: block;
    }

    span.hint {
      color: #888;
    }
  `;

  constructor() {
    super();
    // Declare reactive properties
  }

  firstUpdated() {

    this.SERVICE_DOMAIN = 'babel.hathitrust.org';
    this.CATALOG_DOMAIN = 'catalog.hathitrust.org';
    if ( window.HT && window.HT.service_domain ) {
      this.SERVICE_DOMAIN = window.HT.service_domain;
      this.CATALOG_DOMAIN = window.HT.catalog_domain;
    }

    let searchParams = new URLSearchParams(location.search);

    this._select = this.renderRoot.querySelector('[data-action="select"]');
    this._searchtype = this.renderRoot.querySelector('[data-action="searchtype"]');
    this._root = this.renderRoot.querySelector('.search-form');
    this._fieldValue = this.renderRoot.querySelector('[data-target="field"]');
    this._searchAction = this.renderRoot.querySelector('[data-action="search"]');

    this._input = this.renderRoot.querySelector('sl-input#q1');

    // seed from the URL
    if ( searchParams.has('lookfor') ) {
      this._input.value = searchParams.get('lookfor');
      let searchtype = searchParams.get('searchtype')  || 'all';
      this._searchtype.value = searchtype;
    } else if ( searchParams.has('q1') ) {
      this._input.value = searchParams.get('q1');
      this._searchtype.value = 'everything';
    }

    // take it off the main thread so the sl-selects build themselves
    setTimeout(() => {
      this._updateSearchType();
    }, 0);

    this.for = 'library';

    this._select.addEventListener('sl-change', (event) => {
      this._root.dataset.for = event.target.value;
      this.for = event.target.value;
    })

    this._searchtype.addEventListener('sl-change', (event) => {
      this._updateSearchType();
    })

    this._searchAction.addEventListener('click', (event) => {
      let search_url;
      if ( this.for == 'library' && this._searchtype.value == 'everything' ) {
        let submitData = new URLSearchParams();
        submitData.set('q1', this._input.value);
        submitData.set('field1', 'ocr');
        submitData.set('a', 'srchls');
        submitData.set('ft', 'ft');
        submitData.set('lmt', 'ft');
        search_url = `//${this.SERVICE_DOMAIN}/cgi/ls?${submitData.toString()}`;
      } else if ( this.for == 'library' ) {
        let submitData = new URLSearchParams();
        submitData.set('lookfor', this._input.value);
        submitData.set('searchtype', this._searchtype.value);
        submitData.set('ft', 'ft');
        submitData.set('setft', 'true');
        search_url = `//${this.CATALOG_DOMAIN}/Search/Home?${submitData.toString()}`;
      } else {
        // website search
        let searchTerms = this._input.value.toLowerCase();
        search_url = `https://www.hathitrust.org/search/node/${searchTerms}`
      }
      if ( search_url ) {
        location.href = search_url;
      }
    })
  }

  render() {
    return html`
      <div class="search-form" data-for="library" data-field="everything">
        <form>
          <label>Search the </label>
          <sl-input id="q1" size="large" placeholder="Type something"></sl-input>
          <sl-select value="library" size="large" data-action="select">
            <sl-menu-item data-view="full" value="library">Collection</sl-menu-item>
            <sl-menu-item value="website">Website</sl-menu-item>
          </sl-select>
          <label data-for="library"> by </label>
          <sl-select data-for="library" data-action="searchtype" value="everything" size="large">
            <sl-menu-item value="everything">Everything</sl-menu-item>
            <sl-menu-item value="all">All Bibliographic Fields</sl-menu-item>
            <sl-menu-item value="title">Title</sl-menu-item>
            <sl-menu-item value="author">Author</sl-menu-item>
            <sl-menu-item value="subject">Subject</sl-menu-item>
            <sl-menu-item value="isbn">ISBN/ISSN</sl-menu-item>
            <sl-menu-item value="publisher">Publisher</sl-menu-item>
            <sl-menu-item value="seriestitle">Series Title</sl-menu-item>
          </sl-select>
          <sl-button data-action="search" size="large">Search</sl-button>
        </form>
        <div class="search-links" data-view="full">
          <span class="hint" data-for="library">
            You're searching in <span data-target="field">Everything</span> for items you can access.
          </span>
          <span class="hint" data-for="website">
            You're searching the information website.
          </span>
          <div>
            <a href="#">
              <sl-icon name="question-circle"></sl-icon>
              Search Help
            </a>
            <a href="/Search/Advanced">
              <sl-icon name="search"></sl-icon>
              Advanced Collection Search
            </a>
          </div>
        </div>
      </div>    
    `;
  }

  _updateSearchType() {
    let value = this._searchtype.value;
    this._root.dataset.field = value;
    let menuItem = this._searchtype.querySelector(`sl-menu-item[value="${value}"]`);
    this._fieldValue.innerText = menuItem.getTextLabel();
  }

}

customElements.define('hathi-search-form', HathiSearchForm);
