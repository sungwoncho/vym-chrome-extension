import {get} from 'request';

const endpoint = '__VYM_HOST__/api/v1';

export default {
  /**
   * options {Object}
   * options.ownerName {String}
   * options.repoName {String}
   * options.prNumber {String}
   * options.vymToken {String} - used to authorize user
   */
  getSlideDeck(options, done) {
    let url =
      '__VYM_HOST__/api/v1' +
      '/slide_decks' +
      `/${options.ownerName}` +
      `/${options.repoName}` +
      `/${options.prNumber}`;

    get({url, qs: {vymToken: options.vymToken}, json: true}, done);
  }
};
