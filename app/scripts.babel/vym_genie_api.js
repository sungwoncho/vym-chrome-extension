import request from 'request';

const endpoint = 'http://0.0.0.0:3000';

export default {
  /**
   * options {Object}
   * options.ownerName {String}
   * options.repoName {String}
   * options.prNumber {String}
   */
  getSlideDeck(options, done) {
    request({url: `${endpoint}/slide_decks`, qs: options, json: true}, done);
  }
};
