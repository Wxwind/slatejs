export const sliceFileName = (fileName: string, length = 32, includesExt = false) => {
  const extIndex = fileName.lastIndexOf('.');
  if (extIndex === -1) return fileName.slice(0, length);
  const ext = fileName.slice(extIndex + 1).toLocaleLowerCase();
  if (fileName.length > length) {
    return includesExt
      ? `${fileName.slice(0, length - 1 - ext.length)}.${ext}`
      : `${fileName.slice(0, length - 1 - ext.length)}`;
  }
  return includesExt ? fileName : `${fileName.slice(0, fileName.length - 1 - ext.length)}`;
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
  const path = url.split('?')[0];
  const index = path.lastIndexOf('/');
  if (index === -1) return url;
  return url.substring(index + 1);
};
