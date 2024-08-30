import { FC, PropsWithChildren, useRef, useState } from 'react';

interface FileUploadProps {
  multiple?: boolean;
  onFileSelected: (file: FileList) => Promise<void>;
}

export const FileUpload: FC<PropsWithChildren<FileUploadProps>> = (props) => {
  const { multiple, onFileSelected, children } = props;

  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        disabled={isImporting}
        multiple={multiple}
        onChange={async (e) => {
          console.log('upload file');

          if (e.target.files && e.target.files.length > 0) {
            setIsImporting(true);
            await onFileSelected(e.target.files);
            setIsImporting(false);
          }
          e.target.value = '';
        }}
      />
      <div
        onClick={() => {
          fileInputRef.current?.click();
        }}
      >
        {children}
      </div>
    </>
  );
};
