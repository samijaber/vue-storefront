import { mapConfigToSetupObject, CT_TOKEN_COOKIE_NAME } from '@vue-storefront/commercetools/nuxt/helpers'
import { integrationPlugin } from '@vue-storefront/core'

const moduleOptions = <%= serialize(options) %>;

export default integrationPlugin(({ app, integration }) => {
  const onTokenChange = (newToken, options) => {
    try {
      const currentToken = app.$cookies.get(CT_TOKEN_COOKIE_NAME);

      if (!currentToken || currentToken.access_token !== newToken.access_token) {
        app.$cookies.set(CT_TOKEN_COOKIE_NAME, newToken, options);
      }
    } catch (e) {
      // Cookies on is set after request has sent.
    }
  };

  const onTokenRemove = () => {
    app.$cookies.remove(CT_TOKEN_COOKIE_NAME);
  }

  const onTokenRead = () => {
    return app.$cookies.get(CT_TOKEN_COOKIE_NAME);
  };

  /**
   * changeCurrentStore
   * @param {string} id
   * @returns {void} 
   */
  const changeCurrentStore = (id) => {
    app.$cookies.set(
      app.$vsf.$ct.config.cookies.storeCookieName, id
    );
  }


  const setConfigCookie = async (token) => {
    const tokenValue = encodeURIComponent(JSON.stringify(token))
    const cookieTokenString = `${CT_TOKEN_COOKIE_NAME}=${tokenValue}`;

    const settings = {
      axios: {
        headers: {
          cookie: cookieTokenString
        }
      }
    }

    integration.configure('ct', settings)
  }

  const settings = mapConfigToSetupObject({
    moduleOptions,
    app,
    additionalProperties: {
      auth: {
        onTokenChange,
        onTokenRead,
        onTokenRemove
      },
      storeService: {
        changeCurrentStore
      },
      axios: {
        setConfigCookie
      }
    }
  })

  integration.configure('ct', settings)
});
