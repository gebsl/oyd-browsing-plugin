export const POST = 'POST';
export const GET = 'GET';

export async function xhr(url, type, headers, body) {
  const req = new XMLHttpRequest();
  req.open(type, url, true);

  for (const key in headers) {
    req.setRequestHeader(key, headers[key]);
  }

  // TODO: reject it somewhere?
  const promise = new Promise((resolve, reject) => {
    req.onreadystatechange = () => {
      if (req.readyState === XMLHttpRequest.DONE) {
        const {responseText} = req;
        if (responseText) {
          try {
            const data = JSON.parse(responseText);
            resolve(data);
          }
          catch { }
        }
        reject();
      }
    }
  });

  req.send(body);

  return promise;
}