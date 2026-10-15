import React, { useMemo, useState } from 'react';
import { ITag } from '../../types/definitions';
import { TagClickable } from '../TagClickable/TagClickable';
import { StyledTagSelector, AnimatedTags } from './style';
import styled from '@emotion/styled';
import { useDarkMode } from '../../hooks/useDarkMode';

interface Props {
  tags: ITag[];
  selectedTags: ITag[];
  query: string;
  setSelectedTags: (next: ITag[]) => void;
  disabled?: boolean;
}

export const TagSelector: React.FC<Props> = ({
  tags,
  selectedTags,
  setSelectedTags,
  disabled,
  query,
}) => {
  const { isDarkModeEnabled, isAdminOrPrylis } = useDarkMode();
  const filteredTags = useMemo(
    () =>
      tags.filter((t: ITag) =>
        t.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query, tags]
  );

  const toggleTag = (tag: ITag) => {
    if (disabled) return;
    // Tag is not in list, add it
    if (selectedTags.filter((t: ITag) => t.id === tag.id).length === 0) {
      setSelectedTags(selectedTags.concat(tag));
    } else {
      // Remove the tag we clicked on
      const nextSelectedTags = [...selectedTags].filter((x) => x.id !== tag.id);
      setSelectedTags(nextSelectedTags);
    }
  };

  const tagSections = useMemo<{ category: ITag['category']; label: string }[]>(
    () => [
      {
        category: 'COMMITTEE',
        label: 'Nämnd',
      },
      {
        category: 'EVENT',
        label: 'Event',
      },
      ...(isDarkModeEnabled && !isAdminOrPrylis
        ? []
        : [
            {
              category: 'RECEPTION' as const,
              label: 'Mottagningen',
            },
          ]),
      {
        category: 'OTHER',
        label: 'Övrigt',
      },
    ],
    [isDarkModeEnabled, isAdminOrPrylis]
  );

  const [expansions, setExpansions] = useState<
    Record<ITag['category'], boolean>
  >({ COMMITTEE: true, EVENT: true, OTHER: true, RECEPTION: true });

  return (
    <StyledTagSelector>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {tagSections.map((s) => (
          <div key={s.category}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h4 style={{ marginRight: 8 }}>{s.label}</h4>
              <Expander
                expanded={expansions[s.category]}
                onClick={() =>
                  setExpansions({
                    ...expansions,
                    [s.category]: !expansions[s.category],
                  })
                }
              >
                <i className="fas fa-chevron-down" />
              </Expander>
            </div>
            {expansions[s.category] && (
              <div>
                {filteredTags.filter((x) => x.category === s.category)
                  .length === 0 && <span key="notags">Inga taggar</span>}
                {filteredTags.length !== 0 && (
                  <AnimatedTags duration={250}>
                    {filteredTags
                      .filter((x) => x.category === s.category)
                      .map((t: ITag) => (
                        <TagClickable
                          tag={t}
                          clicked={
                            selectedTags.filter((x: ITag) => x.id === t.id)
                              .length !== 0
                          }
                          onClick={() => toggleTag(t)}
                          key={'tag-' + t.category + '-' + t.id}
                          disabled={disabled}
                        />
                      ))}
                  </AnimatedTags>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </StyledTagSelector>
  );
};

export const Expander = styled.div<{ expanded: boolean }>(
  {
    cursor: 'pointer',
    userSelect: 'none',

    '> i': {
      margin: '5px',
    },
  },
  (props) => ({
    '> i': {
      transform: props.expanded ? 'rotate(-180deg' : 'rotate(-180deg)',
    },
  })
);
