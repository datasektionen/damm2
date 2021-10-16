import React, { useEffect, useRef, useState } from 'react';
import { IPatch, ITag } from '../../../../types/definitions';
import { StyledPatchDetails, PatchImage, Left, Right, Description, Tags, Meta, CloseButton, Content } from './style';
import { Tag } from '../../../../components/Tag/Tag';
import Moment from 'react-moment';
import 'moment/locale/sv';
import { Button } from '../../../../components/Button/Button';
import { DetailsView } from './DetailsView'
import { EditDetails } from '../EditDetails/EditDetails'

interface Props {
    patch: IPatch;
    onClose: () => void;
    allTags: ITag[];
    fetchPatches: () => Promise<void>;
    edit: boolean;
    setEdit: (state: boolean) => void;
    editApiPath: string;
    type: "patch" | "artefact";
    onDeleteClick: (id: number) => any;
}

export const PatchDetails: React.FC<Props> = ({ patch, onClose, allTags, fetchPatches, edit, setEdit, editApiPath, type, onDeleteClick }) => {

    const ref = useRef(document.createElement("div"));
    
    useEffect(() => {
        ref.current.scrollTo(0, 0)
    }, [patch])

    return (
        <StyledPatchDetails ref={ref}>
            {edit ?
                <EditDetails
                    onCancel={() => setEdit(false)}
                    patch={patch}
                    tags={allTags}
                    fetchPatches={fetchPatches}
                    editApiPath={editApiPath}
                    type={type}
                    onDeleteClick={(id: number) => onDeleteClick(id)}
                />
                :
                <DetailsView
                    onClose={onClose}
                    onEditClick={() => setEdit(true)}
                    patch={patch}
                    fetchPatches={fetchPatches}
                    type={type}
                />
            }
        </StyledPatchDetails>
    )
}

export class WrappedPatchDetails extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <PatchDetails {...this.props} />
        )
    }
}