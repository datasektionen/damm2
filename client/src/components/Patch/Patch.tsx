import React, { useCallback, useMemo, useState } from 'react';
import {
  StyledPatch,
  Hover,
  PatchImage,
  PatchInfo,
  PatchName,
  PatchItemDate,
  HoverTags,
} from './style';
import { Tag } from '../Tag/Tag';
import Moment from 'react-moment';
import { IPatch } from '../../types/definitions';
import { useDarkMode } from '../../hooks/useDarkMode';

interface Props {
  patch: IPatch;
  onClick: (patch: IPatch) => void;
  disabled?: boolean;
}

export const useShouldHidePatch = () => {
  const { isDarkModeEnabled } = useDarkMode();

  return useMemo(
    () => ({
      hidePatchOnDarkmode: (patch: IPatch) =>
        isDarkModeEnabled && patch.tags.some((x) => x.category === 'RECEPTION'),
      isAffectedByDarkmode: (patch: IPatch) =>
        patch.tags.some((x) => x.category === 'RECEPTION'),
      tagsThatApplyDarkMode: (patch: IPatch) =>
        patch.tags.filter((x) => x.category === 'RECEPTION'),
    }),
    [isDarkModeEnabled]
  );
};

export const PatchComponent: React.FC<Props> = (props) => {
  const [hover, setHover] = useState(false);
  const { hidePatchOnDarkmode } = useShouldHidePatch();

  const { patch } = props;

  return (
    <StyledPatch
      disabled={props.disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={() => setHover(true)}
      onTouchMove={() => setHover(false)}
      onTouchEnd={() => setHover(false)}
      onClick={() => props.onClick(patch)}
    >
      {hover && (
        <Hover title="Klicka för detaljer">
          <HoverTags>
            {patch.tags.length === 0
              ? 'Inga taggar'
              : patch.tags.map((tag: any) => (
                  <Tag key={`patch-${patch.id}-tag-${tag.id}`} {...tag} />
                ))}
          </HoverTags>
          <div>Klicka för detaljer</div>
        </Hover>
      )}
      {hidePatchOnDarkmode(props.patch) && (
        <div
          style={{ position: 'absolute', right: 8, top: 8 }}
          title="Märket är mörklagt och syns inte för icke-administratörer"
        >
          <i className="fa-solid fa-eye-slash" style={{ fontSize: '24px' }}></i>
        </div>
      )}
      <PatchImage image={patch.images[1]} />
      <PatchInfo>
        <PatchItemDate>
          <i className="far fa-clock"></i>
          {patch.date.length === 0 ? (
            'Okänt'
          ) : (
            <Moment format="Do MMM YYYY">{patch.date}</Moment>
          )}
        </PatchItemDate>
      </PatchInfo>
      <PatchName>
        <h2>{patch.name}</h2>
      </PatchName>
    </StyledPatch>
  );
};

// react-flip-move requires class components
class PatchWrapper extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return <PatchComponent {...this.props} />;
  }
}

export const Patch = PatchWrapper;
