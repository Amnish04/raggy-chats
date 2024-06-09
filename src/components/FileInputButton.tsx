import { AttachmentIcon } from "@chakra-ui/icons";
import { IconButton, IconButtonProps, Tooltip } from "@chakra-ui/react";
import { useCallback, useRef } from "react";

type FileInputButtonProps = {
  iconButtonProps: IconButtonProps;
  onFilesSelected?: (files: FileList) => void;
};

const FileInputButton = ({
  iconButtonProps,
  onFilesSelected,
}: FileInputButtonProps) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileInputButtonClick = () => {
    fileInput.current?.click();
  };

  const handleFilesChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;

      if (selectedFiles) {
        onFilesSelected?.(selectedFiles);
      }
    },
    [onFilesSelected]
  );

  return (
    <>
      <Tooltip label={iconButtonProps["aria-label"]}>
        <IconButton
          variant={"outline"}
          border={"none"}
          borderRightRadius={"none"}
          icon={<AttachmentIcon />}
          onClick={handleFileInputButtonClick}
          {...iconButtonProps}
        />
      </Tooltip>

      <input
        ref={fileInput}
        onChange={handleFilesChanged}
        type="file"
        hidden
      />
    </>
  );
};

export default FileInputButton;
