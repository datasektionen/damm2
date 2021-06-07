import React, { useState } from 'react';
import { StyledPatch, Hover, PatchImage, PatchInfo, PatchName, PatchItemDate, HoverTags } from './style';
import { Tag } from '../Tag/Tag';
import { useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import { IPatch } from '../../types/definitions';

interface Props {
    patch: IPatch;
    onClick: (patch: IPatch) => void;
}

export const PatchComponent: React.FC<Props> = props => {
    
    const [hover, setHover] = useState(false);
    const history = useHistory();

    const { patch } = props;

    return (
        <StyledPatch
            onMouseEnter={_ => setHover(true)}
            onMouseLeave={_ => setHover(false)}
            onTouchStart={_ => setHover(true)}
            onTouchMove={_ => setHover(false)}
            onTouchEnd={_ => setHover(false)}
            onClick={() => props.onClick(patch)}
            title={patch.description}
        >
            {hover &&
                <Hover title="Klicka för detaljer">
                    <HoverTags>
                        {patch.tags.length === 0 ?
                            "Inga taggar"
                            :
                            patch.tags.map((tag: any) => 
                                <Tag key={`patch-${patch.id}-tag-${tag.id}`} {...tag} />
                            )
                        }
                    </HoverTags>
                    <div>
                        Klicka för detaljer
                    </div>
                </Hover>
            }
            <PatchImage image={patch.images[1]} />
            <PatchInfo>
                <PatchItemDate>
                    <i className="far fa-clock"></i>
                    {patch.date === null ?
                        "Okänt"
                        :
                        <Moment format="Do MMM YYYY">
                            {patch.date}
                        </Moment>
                    }
                </PatchItemDate>
            </PatchInfo>
            <PatchName>
                <h2>
                    {patch.name}
                </h2>
            </PatchName>
        </StyledPatch>
    )
}

// react-flip-move requires class components
class PatchWrapper extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <PatchComponent {...this.props} />
        )
    }
}

export const Patch = PatchWrapper