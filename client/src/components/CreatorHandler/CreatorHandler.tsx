import React from 'react';
import { Button } from '../Button/Button';
import { Field } from '../Field/Field';
import { StyledCreatorHandler, Creator, CreatorsList } from './style';

interface Props {
    creators: string[];
    setCreators: (next: string[]) => void;
    creator: string;
    setCreator: (name: string) => void;
    disabled?: boolean;
}
// Component for managing Patch creators, adding and removal
export const CreatorHandler: React.FC<Props> = ({ creators, setCreators, creator, setCreator, disabled }) => {

    const removeCreator = (index: number) => {
        if (disabled) return;
        setCreators(creators.filter((s: string, i: number) => i !== index));
    }

    const addCreator = () => {
        if (disabled) return;
        setCreators(creators.concat(creator));
        setCreator("");
    }

    return (
        <StyledCreatorHandler>
            <CreatorsList>
                {creators.map((c: string, index: number) =>
                    <Creator key={"creator"+index} disabled={disabled}>
                        {c}
                        <i className="fas fa-times" onClick={() => removeCreator(index)} />
                    </Creator>
                )}
            </CreatorsList>
            <Field
                value={creator}
                onChange={(e: any) => setCreator(e.target.value)}
                placeholder="Namn"
                disabled={disabled}
            />
            <Button
                label="Lägg till"
                onClick={addCreator}
                disabled={creator.length === 0 || disabled}
            />
        </StyledCreatorHandler>
    )
}