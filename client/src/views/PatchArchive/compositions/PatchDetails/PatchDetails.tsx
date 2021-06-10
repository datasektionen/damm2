import React, { useState } from 'react';
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
}

export const PatchDetails: React.FC<Props> = ({patch, onClose, allTags, fetchPatches, edit, setEdit}) => {

    // const [edit, setEdit] = useState(false);

    return (
        <StyledPatchDetails>
            {edit ?
                <EditDetails
                    onCancel={() => setEdit(false)}
                    patch={patch}
                    tags={allTags}
                    fetchPatches={fetchPatches}
                />
                :
                <DetailsView
                    onClose={onClose}
                    onEditClick={() => setEdit(true)}
                    patch={patch}
                    fetchPatches={fetchPatches}
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