export async function copyToClipboard(content: string, dom?: Node) {
  // android webview don't support Permissions
  if ('clipboard' in navigator && navigator.permissions) {
    // use in https or local environment
    await navigator.clipboard.writeText(content);
  } else {
    // used in http environment
    const textArea = document.createElement('textarea');
    textArea.value = content;
    textArea.style.position = 'absolute';
    textArea.style.opacity = '0';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    dom ? dom.appendChild(textArea) : document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    dom ? dom.removeChild(textArea) : document.body.removeChild(textArea);
  }
}
