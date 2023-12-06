export const downLoad = (file: File) => {
  const url = URL.createObjectURL(file);
  const tmpLink = document.createElement('a');
  tmpLink.href = url;
  tmpLink.download = file.name;
  document.body.append(tmpLink);
  tmpLink.click();
  document.body.removeChild(tmpLink);
  URL.revokeObjectURL(url);
};
