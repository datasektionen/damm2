import React, { useState } from 'react';
import { IPatch, ITag } from '../../../../types/definitions';
import { StyledPatchDetails, PatchImage, Left, Right, Description, Tags, Meta, CloseButton, Content } from './style';
import { Tag } from '../../../../components/Tag/Tag';
import Moment from 'react-moment';
import 'moment/locale/sv';
import { Button } from '../../../../components/Button/Button';
import { DetailsView } from './DetailsView'
import { EditDetails } from './EditDetails'

interface Props {
    patch: IPatch;
    onClose: () => void;
}

export const PatchDetails: React.FC<Props> = props => {

    const { patch } = props;
    const [edit, setEdit] = useState(false);

    return (
        <StyledPatchDetails>
            {edit ?
                <EditDetails onCancel={() => setEdit(false)} />
                :
                <DetailsView onClose={props.onClose} onEditClick={() => setEdit(true)} patch={patch} />
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