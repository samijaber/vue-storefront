import { ApiClientExtension } from '@vue-storefront/core';
import { CT_COOKIE_NAME, Token, TokenType } from '../types/setup';
import { createSdkHelpers } from '../links/sdkHelpers';
import { Logger } from '@vue-storefront/core';

function parseToken(rawToken: string): Token {
  try {
    return JSON.parse(rawToken);
  } catch (e) {
    return null;
  }
}

export const tokenExtension: ApiClientExtension = {
  name: 'tokenExtension',
  extendApp: ({ configuration }) => {
    console.log('tokenExtension');
    configuration.auth = {
      onTokenChange: () => {},
      onTokenRead: () => '',
      onTokenRemove: () => {}
    };

    Logger.debug('Generating server access token');
    const { tokenProvider: serverTokenProvider } = createSdkHelpers(configuration, TokenType.ServerAccessToken);
    Logger.debug('Successfully generated server access token');

    Logger.debug('Generating quest access token');
    const { tokenProvider } = createSdkHelpers(configuration, TokenType.QuestAccessToken);

    Logger.debug('Successfully generated guest access token');

    configuration.serverTokenProvider = serverTokenProvider;
    configuration.questTokenProvider = tokenProvider;
  },
  hooks(request, response) {
    let currentToken = parseToken(request.cookies[CT_COOKIE_NAME]);

    /**
     * Updates token cookie.
     */
    function onTokenChange(token) {
      currentToken = token;
      const options = {
        ...(token?.expires_at && { expires: new Date(token.expires_at) }),
        httpOnly: true,
        secure: request.secure
      };
      return response.cookie(
        CT_COOKIE_NAME,
        JSON.stringify(token),
        options
      );
    }

    /**
     * Returns current access token.
     */
    function onTokenRead() {
      console.log('currentToken', currentToken);
      return currentToken;
    }

    /**
     * Removes token cookie.
     */
    function onTokenRemove() {
      currentToken = null;
      return response.clearCookie(CT_COOKIE_NAME);
    }
    return {
      beforeCreate: ({ configuration }) => ({
        ...configuration,
        auth: {
          onTokenChange,
          onTokenRead,
          onTokenRemove
        }
      })
    };
  }
};