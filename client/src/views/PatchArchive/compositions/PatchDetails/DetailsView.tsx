import React from 'react';
import { IPatch, ITag } from '../../../../types/definitions';
import Moment from 'react-moment';
import { StyledPatchDetails, PatchImage, Left, Right, Description, Tags, Meta, CloseButton, Content } from './style';
import { Button } from '../../../../components/Button/Button';
import { Tag } from '../../../../components/Tag/Tag';

interface Props {
    patch: IPatch;
    onClose: () => void;
    onEditClick: () => void;
}

export const DetailsView: React.FC<Props> = ({patch, onEditClick, onClose}) => {

    return (
        <>
            <Left>
                <a href={patch.images[0]} target="_blank" rel="noopener noreferrer" title="Öppna i ny flik">
                    <PatchImage src={patch.images[0] ?? ""} draggable={false} />
                </a>
                <Button label="Redigera" onClick={onEditClick} />
            </Left>
            <Right>
                <h1>{patch.name}</h1>
                <Meta>
                    <span title="Datum">
                        <i className="far fa-clock" />
                        {patch.date === null ?
                            "Okänt"
                            :
                            <Moment format="Do MMMM YYYY" locale="sv">
                                {patch.date}
                            </Moment>
                        }
                    </span>
                    <span title="Uppladdningsdatum">
                        <i className="fas fa-cloud-upload-alt" />
                        <Moment format="Do MMMM YYYY" locale="sv">
                            {patch.createdAt}
                        </Moment>
                    </span>
                </Meta>
                <Content>
                    <Description>
                        {patch.description === "" ? "Ingen beskrivning finns" : patch.description}
                    </Description>
                    <Tags>
                        {patch.tags.length === 0 && "Märket har inga taggar"}
                        {patch.tags.map((t: ITag, i: number) =>
                            <Tag {...t} key={"patch-detailed-" + i + "-" + t.id} />
                        )}
                    </Tags>
                </Content>
            </Right>
            <CloseButton onClick={onClose} title="Stäng">
                <i className="fas fa-times" />
            </CloseButton>
        </>
    )
}