import classnames from "classnames";
import _ from "lodash";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {Path, PathValue, Validate, useController, useFormContext} from "react-hook-form";
import {Card} from "@consta/uikit/Card";
import {FileField} from "@consta/uikit/FileField";
import {IconAdd} from "@consta/uikit/IconAdd";
import {IconClose} from "@consta/uikit/IconClose";
import {Modal} from "@consta/uikit/Modal";
import {Tooltip} from "@consta/uikit/Tooltip";

import {Preview, FieldsData, FieldsDataValue} from "../../../../helpers/types";

import styles from "./Files.module.css";

type FilesProps = {
  id: string;
  className: string;
  fieldName: Path<FieldsData>;
  required?: boolean;
  requiredMessage?: string;
  validation?: Validate<PathValue<FieldsData, Path<FieldsData>>> | Record<string, Validate<PathValue<FieldsData, Path<FieldsData>>>>;
};


export default function Files(props: FilesProps) {
  const {id, className, fieldName, required, requiredMessage, validation} = props;

  const anchorRef = useRef(null);

  const [previews, setPreviews] = useState<Preview[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<Preview>(null);

  const {setValue, clearErrors, formState} = useFormContext<FieldsData>();
  const {isSubmitSuccessful} = formState;

  const {
    fieldState: { error },
  } = useController<FieldsData>({
    name: fieldName,
    rules: {
      required: {
        value: required && !files.length,
        message: requiredMessage
      },
      validate: files.length ? validation : null
    },
  });

  const fieldChangeHandler = (key: typeof fieldName, value: FieldsDataValue) => {
    setValue(key, value);
    clearErrors(key);
  }

  const uploadFilesHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const targetFiles = e.target.files;
    if (!targetFiles) return;
    for (const file of targetFiles) {
      previews.push({id: _.uniqueId('image-'), url: URL.createObjectURL(file)});
      files.push(file);
    }
    fieldChangeHandler(fieldName, files);
 };

  const removeFilesHandler = (id: string) => {
    const index = previews.findIndex((preview) => preview.id === id);
    previews.splice(index, 1);
    files.splice(index, 1);
    fieldChangeHandler(fieldName, files);
 };

  const showPreviewModalHandler = (id: string) => {
    const index = previews.findIndex((preview) => preview.id === id);
    setModalContent(previews[index]);
    setShowModal(true);
  };

  const hidePreviewModalHandler = () => {
    setModalContent(null);
    setShowModal(false);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      setPreviews([]);
      setFiles([]);
    }
  }, [isSubmitSuccessful]);

  return (
      <Card className={classnames(styles.filesList, className)} shadow={false}>
        {previews.map((preview) => (
            <div key={preview.id} className={styles.filesItem}>
              <IconClose
                  className={styles.close}
                  size="s"
                  onClick={() => removeFilesHandler(preview.id)}
              />
              <img
                  className={styles.filesItemImg}
                  src={preview.url}
                  width="150"
                  height="150"
                  alt={preview.id}
                  onClick={() => showPreviewModalHandler(preview.id)}
              />
            </div>
        ))}
        <FileField
            inputRef={anchorRef}
            id={id}
            className={classnames(styles.filesItem, {[styles.filesItemInvalid]: error})}
            multiple
            onChange={uploadFilesHandler}
        >
          <IconAdd className={styles.plus} size="m" />
        </FileField>
        {error && (
            <Tooltip style={{marginLeft: 100}}  anchorRef={anchorRef} size="m" status="alert" direction="rightCenter">
              {error.message}
            </Tooltip>
        )}
        <Modal
            className={styles.filePreview}
            isOpen={showModal}
            hasOverlay
            onClickOutside={hidePreviewModalHandler}
            onEsc={hidePreviewModalHandler}
        >
          <IconClose
              className={styles.filePreviewClose}
              size="m"
              onClick={hidePreviewModalHandler}
          />
          {modalContent && <img className={styles.filePreviewImg} src={modalContent.url} alt={modalContent.id}/>}
        </Modal>
      </Card>
  );
}
