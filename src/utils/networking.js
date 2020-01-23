export const POST = 'POST';
export const GET = 'GET';

export async function xhr(url, type, headers, body) {
  const req = new XMLHttpRequest();
  req.open(type, url, true);

  for (const key in headers) {
    req.setRequestHeader(key, headers[key]);
  }

  // TODO: reject it somewhere?
  const promise = new Promise(resolve => {
    req.onreadystatechange = () => {
      if (req.readyState === XMLHttpRequest.DONE)
        resolve(req);
    }
  });

  req.send(body);

  return promise;
}