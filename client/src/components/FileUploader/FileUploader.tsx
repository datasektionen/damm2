import React, { useRef } from 'react';
import { StyledFileUploader, Label, File, Files, Row } from './style';
import { Button } from '../Button/Button';
import Theme from '../../common/Theme';

interface Props {
    files: File[];
    onAddFile: (file: File) => void;
    onFileRemove: (file: File) => void;
    disabled?: boolean;
    label?: string;
    // A string of accepted file types
    // Ex ["png", "pdf", "jpg"]
    accept?: string[];
    multiple?: boolean;
}

export const FileUploader: React.FC<Props> = ({ files, onAddFile, onFileRemove, label, accept = [], multiple = false, disabled }) => {

    const inputRef = useRef(document.createElement("input"));

    const handleFileChange = (e: any) => {
        
        onAddFile(e.target.files[0]);

        // Make us able to add the same file again if we remove it.
        // https://github.com/ngokevin/react-file-reader-input/issues/11#issuecomment-363484861
        e.target.value = "";
    }

    const mapAcceptPropsToString = (): string => accept?.map(f => `.${f}`).join(", ")

    return (
        <StyledFileUploader>
            <input
                type="file"
                style={{display: "none"}}
                ref={inputRef}
                onChange={handleFileChange}
                multiple={multiple}
                accept={mapAcceptPropsToString()}
            />
            <Row>
                <Button
                    label="Bifoga fil"
                    backgroundColor={Theme.palette.cerise}
                    color="#fff"
                    onClick={() => inputRef.current.click()}
                    disabled={disabled}
                />
                <Label>
                    {label ?? "Ladda upp filer"}
                </Label>
            </Row>
            <Files>
                {files.map((f: File, i: number) =>
                    <File key={"attached-file"+i}>{f.name}<i className="fas fa-times" onClick={() => onFileRemove(f)} /></File>
                )}
            </Files>
        </StyledFileUploader>
    )
}