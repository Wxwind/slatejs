// eslint-disable-next-line @typescript-eslint/ban-types
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | (string & {});

export async function requestFile(
  req: string,
  callbacks?: {
    onProgress?: (event: ProgressEvent) => void;
  },
  responseType?: ResponseType,
  mimeType?: string
) {
  const response = await fetch(req);
  if (response.status === 200 || response.status === 0) {
    // Some browsers return HTTP Status 0 when using non-http protocol
    // e.g. 'file://' or 'data://'. Handle as success.

    // Workaround: Checking if response.body === undefined for Alipay browser #23548

    if (
      typeof ReadableStream === 'undefined' ||
      response.body === null ||
      response.body === undefined ||
      response.body.getReader === undefined
    ) {
      return response;
    }

    const reader = response.body.getReader();

    // Nginx needs X-File-Size check
    // https://serverfault.com/questions/482875/why-does-nginx-remove-content-length-header-for-chunked-content
    const contentLength = response.headers.get('X-File-Size') || response.headers.get('Content-Length');
    const total = contentLength ? parseInt(contentLength) : 0;
    const lengthComputable = total !== 0;
    let loaded = 0;

    // periodically read data into the new stream tracking while download progress
    const stream = new ReadableStream({
      start(controller) {
        readData();

        function readData() {
          reader.read().then(
            ({ done, value }) => {
              if (done) {
                controller.close();
              } else {
                loaded += value.byteLength;

                const event = new ProgressEvent('progress', {
                  lengthComputable,
                  loaded,
                  total,
                });
                callbacks?.onProgress?.(event);

                controller.enqueue(value);
                readData();
              }
            },
            (e) => {
              controller.error(e);
            }
          );
        }
      },
    });

    const resp = new Response(stream);

    switch (responseType) {
      case 'arraybuffer':
        return resp.arrayBuffer();

      case 'blob':
        return resp.blob();

      case 'document':
        return resp.text().then((text) => {
          const parser = new DOMParser();
          return parser.parseFromString(text, mimeType as DOMParserSupportedType);
        });

      case 'json':
        return resp.json();

      default:
        if (mimeType === undefined) {
          return resp.text();
        } else {
          // sniff encoding
          const re = /charset="?([^;"\s]*)"?/i;
          const exec = re.exec(mimeType);
          const label = exec && exec[1] ? exec[1].toLowerCase() : undefined;
          const decoder = new TextDecoder(label);
          return resp.arrayBuffer().then((ab) => decoder.decode(ab));
        }
    }
  } else {
    throw new Error(`fetch for "${response.url}" responded with ${response.status}: ${response.statusText}`);
  }
}
