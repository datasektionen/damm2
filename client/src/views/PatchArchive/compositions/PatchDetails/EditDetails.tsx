import React from 'react';
import { Field } from '../../../../components/Field/Field';
import { Button } from '../../../../components/Button/Button';
import { TextArea } from '../../../../components/TextArea/TextArea';

interface Props {
    onCancel: () => void;
}

export const EditDetails: React.FC<Props> = props => {
    return (
        <div>
            <Field
                placeholder="Namn"
            />
            <input type="date" />
            <TextArea
                placeholder="Beskrivning"
            />
            {/* TAGS
                IMAGES
                CREATORS
                INFORMATION
            */}
            <Button label="Avbryt" onClick={props.onCancel} color="" backgroundColor="" />
            <Button label="Spara" onClick={() => {}} />
        </div>
    )
}