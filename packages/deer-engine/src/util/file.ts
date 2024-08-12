export const sliceFileName = (fileName: string, length = 32) => {
  const ext = fileName.slice(fileName.lastIndexOf('.') + 1).toLocaleLowerCase();
  if (fileName.length > length) {
    return `${fileName.slice(0, length - 1 - ext.length)}.${ext}`;
  }
  return fileName;
};

export const getFileNameAndExt = (file: File | string, length = 32) => {
  const f = typeof file === 'string' ? file : file.name;
  const name = sliceFileName(f, length);
  const index = name.lastIndexOf('.');
  const fileName = index === -1 ? name : name.substring(0, index);
  const ext = index === -1 ? '' : name.slice(index + 1).toLocaleLowerCase();
  return { fileName, ext };
};

export const getFileNameFromUrl = (url: string) => {
  const index = url.lastIndexOf('/');
  if (index === -1) return url;
  return url.substring(index + 1);
};
