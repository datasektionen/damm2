import React from 'react';
import { StyledTagClickable } from './style';
import { ITag } from '../../types/definitions';

interface Props {
    tag: ITag;
    clicked: boolean;
    onClick: (event: any) => void;
    disabled?: boolean;
}

export const TagClickable: React.FC<Props> = ({tag, clicked, onClick, disabled}) => {

    return (
        <StyledTagClickable onClick={onClick} clicked={clicked} tag={tag} disabled={disabled}>
            <span>{tag.name}</span>
            {clicked ?
                <i className="fas fa-check" />
                :
                <i className="fas fa-plus" />
            }
        </StyledTagClickable>
    )
}

// react-flip-move requires that the elements are class components...
export class TagClickableAsClass extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }

    render() {
        return (
            <TagClickable {...this.props} />
        )
    }
}