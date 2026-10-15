import http from '../../common/api';
import React, { useEffect, useState } from 'react';
import { url } from '../../common/api';
import { FancyHeader } from '../../components/FancyHeader/FancyHeader';
import { ScrollLegend } from '../../components/Timeline/ScrollLegend/ScrollLegend';
import { IEvent, IEventsPerYear } from '../../types/definitions';
import {
  StyledTimeline,
  TimelineBody,
  Cards,
  Year,
  Line,
  CardWrapper,
  LineEnd,
  LineStart,
} from './style';
import { getYear } from '../../common/dates';
import { General } from '../../components/Timeline/Cards/General/General';
import { SM } from '../../components/Timeline/Cards/SM/SM';
import { Anniversary } from '../../components/Timeline/Cards/Anniversary/Anniversary';
import { Filter } from './compositions/Filter';
import { DFunkt } from '../../components/Timeline/Cards/DFunkt/DFunkt';
import { useTitle } from '../../hooks/useTitle';
import { title } from '../../common/strings';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../common/routes';

const templates = {
  SM_DM: {
    title: 'SM och DM',
    template: (data: IEvent, i: number, onEditClick: (id: number) => void) => (
      <CardWrapper index={i} key={'card-' + getYear(data.date) + '-' + i}>
        <SM
          {...data}
          protocol={data.protocol ?? ''}
          index={i}
          onEditClick={onEditClick}
        />
      </CardWrapper>
    ),
  },
  ANNIVERSARY: {
    title: 'Årsdagar',
    template: (data: IEvent, i: number, onEditClick: (id: number) => void) => (
      <CardWrapper index={i} key={'card-' + getYear(data.date) + '-' + i}>
        <Anniversary {...data} index={i} onEditClick={onEditClick} />
      </CardWrapper>
    ),
  },
  GENERAL: {
    title: 'Generell historia',
    template: (data: IEvent, i: number, onEditClick: (id: number) => void) => (
      <CardWrapper index={i} key={'card-' + getYear(data.date) + '-' + i}>
        <General {...data} index={i} onEditClick={onEditClick} />
      </CardWrapper>
    ),
  },
  DFUNKT: {
    title: 'Funktionärer tillträder',
    template: (data: IEvent, i: number) => (
      <CardWrapper index={i} key={'card-' + getYear(data.date) + '-' + i}>
        <DFunkt {...data} index={i} mandates={data.mandates ?? []} />
      </CardWrapper>
    ),
  },
};

export const Timeline: React.FC = () => {
  useTitle(title('Tidslinje'));
  const [years, setYears] = useState<IEventsPerYear[]>([]);
  const [show, setShow] = useState<string[]>(Object.keys(templates));
  // const history = useHistory();
  const navigate = useNavigate();

  const eventsPerYear = (events: IEvent[]): IEventsPerYear[] => {
    const years: IEventsPerYear[] = [];
    let year: IEventsPerYear | null = null;

    events.forEach((e) => {
      if (year === null || year?.year !== getYear(e.date)) {
        if (year !== null) {
          years.push(year);
        }
        year = {
          year: getYear(e.date),
          cards: [],
        };
      }
      year.cards.push(e);
    });
    if (year !== null) years.push(year);
    return years;
  };

  useEffect(() => {
    (async () => {
      const events = await http.get<IEvent[]>(url('/api/events/all'));
      const body = events.data ?? [];
      setYears(eventsPerYear(body));
    })();
  }, []);

  const templateForCard = (c: IEvent, i: number) => {
    if (!show.includes(c.type)) return null;
    return templates[c.type].template(c, i, onEditClick);
  };

  const onEditClick = (id: number) => {
    navigate({
      pathname: ROUTES.EVENT_HANDLER,
      search: `?edit_id=${id}`,
    });
    // history.push({
    //     pathname: ROUTES.EVENT_HANDLER,
    //     search: `?edit_id=${id}`
    // })
  };

  const filterCards = (cards: IEvent[]) =>
    cards.filter((x) => show.includes(x.type));

  return (
    <StyledTimeline>
      <FancyHeader title="Sektionshistoria" />
      <ScrollLegend years={years} />
      <Filter
        filters={Object.keys(templates)}
        templates={templates}
        setShow={(next: string[]) => setShow(next)}
        show={show}
      />
      <TimelineBody>
        {years.map((y) => {
          const filteredCards = filterCards(y.cards);

          return (
            <div key={'year-heading-' + y.year} id={'year-' + y.year}>
              <Year>{y.year}</Year>
              <Cards>
                {filteredCards.length !== 0 && (
                  <>
                    <LineStart />
                    <Line />
                    <LineEnd />
                  </>
                )}
                {filteredCards.map((c, i) => templateForCard(c, i))}
              </Cards>
            </div>
          );
        })}
      </TimelineBody>
    </StyledTimeline>
  );
};
