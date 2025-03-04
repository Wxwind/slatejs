export const isFileAccepted = (file: File, accept: string) => {
  const acceptArray = accept.split(',');
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();
  const baseMimeType = mimeType.replace(/\/.*$/, '');

  return acceptArray.some((a) => {
    const accType = a.trim();
    // accType = "*/*"|"*"
    if (/^\*(\/\*)?$/.test(accType)) {
      return true;
    }
    // accType = .xxx
    if (accType.charAt(0) === '.') {
      return fileName.endsWith(accType);
    }
    // accType = MIME ,e.g. image/*, video/*
    if (/\/\*$/.test(accType)) {
      return baseMimeType === accType.replace(/\/.*$/, '');
    }

    // accType = MIME ,e.g. image/jpeg, audio/ogg
    if (mimeType === accType) {
      return true;
    }

    if (/^\w+$/.test(accType)) {
      console.warn(false, `Upload takes an invalidate 'accept' type '${accType}'.Skip for check.`);
      return true;
    }
    return false;
  });
};

export const getFileNameAndExt = (file: File | string, length = 32) => {
  const f = typeof file === 'string' ? file : file.name;
  const name = sliceFileName(f, length);
  const index = name.lastIndexOf('.');
  const fileName = index === -1 ? name : name.substring(0, index);
  const ext = index === -1 ? '' : name.slice(index + 1).toLocaleLowerCase();
  return { fileName, ext };
};

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
