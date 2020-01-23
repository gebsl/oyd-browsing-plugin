import { xhr, POST } from './networking';

function getBasicHeaders() {
  return {
    'Content-Type': 'application/json',
  };
}

function getDataHeaders(token) {
  return Object.assign(getBasicHeaders(), {
    'Accept': '*/*',
    'Authorization': `Bearer ${token}`,
  });
}

function getRepoPath(repo, sublist) {
  let path = repo;

  if (sublist)
    path += `.${sublist}`;

  return path;
}

export class OydCommunicator {
  constructor(url, repo, appKey, appSecret, sublist) {
    this.url = url;
    this.repo = repo;
    this.appKey = appKey;
    this.appSecret = appSecret;
    this.sublist = sublist;
  }

  async isValid() {
    try {
      // test if is valid url
      new URL(this.url);
    }
    catch (e) {
      return false;
    }

    if (!this.repo || !this.appKey || !this.appSecret)
      return false;

    const token = await this.authorize();
    return !!token;
  }

  async authorize() {
    const headers = getBasicHeaders();
    const { responseText } = await xhr(`${this.url}/oauth/token`, POST, headers, JSON.stringify({
      'client_id': this.appKey,
      'client_secret': this.appSecret,
      'grant_type': 'client_credentials'
    }));

    if (responseText) {
      let data;

      try {
        data = JSON.parse(responseText);
      }
      catch (e) {
        return null;
      }

      return data['access_token'];
    }

    return null;
  }

  async sendData(data) {
    // TODO: Don't fetch token each time data is sent
    // TODO: Check if token is still valid
    const token = await this.authorize();
    // TODO: Error handling -> e.g. unauthorized

    // TODO: There is a http 400, if something is wrong with the token
    xhr(`${this.url}/api/repos/${getRepoPath(this.repo, this.sublist)}/items`, POST, getDataHeaders(token), JSON.stringify(data));
  }
}