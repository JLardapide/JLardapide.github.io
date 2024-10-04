(function (customElements) {
    const STYLES = `
    <style>
      .web-component {
        border: 4px dashed rgba(232, 255, 146, 0.72);
        background-color: rgba(232, 255, 146, 0.05);
        padding: 8px;
      }
      img {
        height: 45px;
      }
      h1 {
        font-size: 2.5rem;
        color: #00A0FF;
        font-family: Roboto, "Helvetica Neue", sans-serif;
        text-align: center;
      }
      .json-object {
        padding: 1%;
        width: 98%;
        max-width: 98%;
      }
      pre {
        white-space: pre-wrap;
        overflow: auto;
        background-color: rgba(232, 255, 146, 0.4);
      }
    </style>`;
    const getLocalStorageContent = () => {
      var archive = {},
        keys = Object.keys(localStorage),
        i = 0, key;
      for (; key = keys[i]; i++) {
        archive[key] = localStorage.getItem(key);
      }
      return archive; //
    };
    const objectToHTML = (title, object) => `
      <h4>${title}:</h4>
      <pre>${object ? JSON.stringify(object, null, 2) : 'ninguno'}</pre>
    `;
    const createTemplate = ({ imgUrl, params, storage }) => {
      const paramsHTML = objectToHTML('Parametros', params);
      const storageHTML = objectToHTML('LocalStorage', storage);
      const template = document.createElement('template');
      template.innerHTML = `
            ${STYLES}
            <div class="web-component">
              <img src="${imgUrl}" alt="Imagen con url absoluta ${imgUrl}"/>
              <h1>WebComponent para pruebas</h1>
              <div class="json-object">
                ${paramsHTML}
              </div>
              <div class="json-object">
                ${storageHTML}
              </div>
              <img src="./assets/custom/icons/icon-152x152.png" alt="Imagen con url relativa ./assets/custom/icons/icon-152x152.png"/>
            </div>
        `;
      return template;
    };
    class MyExtension extends HTMLElement {
      connectedCallback() {
        const paramsAttribute = JSON.parse(
          // HSI envía los parámetros
          this.getAttribute('params') || '{}'
        );
        const currentUrl = paramsAttribute.url || document.location.href;
        const imgUrl = new URL('./logo-HSI.png', currentUrl);
        const storage = getLocalStorageContent();
        const template = createTemplate({
          imgUrl,
          params: paramsAttribute.params,
          storage,
        });
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
      }
    }
    // define el web-component
    customElements.define('my-extension', MyExtension);
  })(window.customElements);
