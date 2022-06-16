import React, { useEffect, useRef, useState } from 'react';
import { Bag, IPatch, ITag } from '../../../../types/definitions';
import { StyledPatchDetails } from './style';
import 'moment/locale/sv';
import { DetailsView } from './DetailsView'
import { EditDetails } from '../EditDetails/EditDetails'
import axios from 'axios'
import { url } from '../../../../common/api';

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

    const [bags, setBags] = useState<Bag[]>([]);

    useEffect(() => {
        axios.get(url("/api/storage/bag/all?includePatches=false"), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            }
        })
        .then(res => {
            setBags(res.data.body)
        })
    }, [])

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
                    bags={bags}
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