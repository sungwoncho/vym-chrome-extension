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
  },

  /**
   * options {Object}
   * options.ownerName {String}
   * options.repoName {String}
   * options.vymToken {String} - used to authorize user
   */
  checkRepoActivated(options, done) {
    let url =
      '__VYM_HOST__/api/v1' +
      '/repo' +
      `/${options.ownerName}` +
      `/${options.repoName}`;

    get({url, qs: {vymToken: options.vymToken}, json: true}, done);
  },

  syncRepoAccess(options, done) {
    let url =
      '__VYM_HOST__/api/v1' +
      '/user/sync_access';

    get({url, qs: {vymToken: options.vymToken}}, done);
  }
};
