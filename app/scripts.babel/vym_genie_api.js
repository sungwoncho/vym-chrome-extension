import request from 'request';

const endpoint = 'https://vym.io/api/v1';

export default {
  /**
   * options {Object}
   * options.ownerName {String}
   * options.repoName {String}
   * options.prNumber {String}
   */
  getSlideDeck(options, done) {
    request({url: `${endpoint}/slide_decks/${options.ownerName}/${options.repoName}/${options.prNumber}`, json: true}, done);
  }
};
