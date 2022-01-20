import React, { useEffect, useState } from 'react';
import { useUpdateRunDetails } from '../../../apollo/mutations';
import classnames from 'classnames';
import { toHumanReadableTime } from '../../../utils/date-utils';
import BookmarkIcon from '../../icons/bookmark';
import BookmarkStrokeIcon from '../../icons/bookmark-stroke';
import CheckIcon from '../../icons/check';

import './runs-list-card.css';

/**
 * Display a card showing run info from an experiment
 * @param {object} data High-level data from the run (id, timestamp, etc.)
 */
const RunsListCard = ({
  data,
  disableRunSelection = false,
  enableComparisonView = false,
  onRunSelection,
  selectedRunIds = [],
}) => {
  const { id, timestamp, title = null, bookmark } = data;
  const [active, setActive] = useState(false);
  const { updateRunDetails } = useUpdateRunDetails();
  const humanReadableTime = toHumanReadableTime(timestamp);

  const onRunsListCardClick = (id, e) => {
    /**
     * If we click the bookmark icon or the path HTML element within the SVG,
     * then update the bookmark boolean. If we didn't check for the path, the
     * user could hit a dead zone, and nothing would happen.
     */
    if (
      e.target.classList.contains('runs-list-card__bookmark') ||
      e.target.tagName === 'path'
    ) {
      updateRunDetails({
        runId: id,
        runInput: { bookmark: !bookmark },
      });

      return;
    }

    onRunSelection(id);
  };

  useEffect(() => {
    setActive(selectedRunIds.includes(id));
  }, [id, selectedRunIds]);

  return (
    <div
      className={classnames('kedro', 'runs-list-card', {
        'runs-list-card--active': active,
        'runs-list-card--disabled': disableRunSelection && !active,
      })}
      onClick={(e) => onRunsListCardClick(id, e)}
    >
      {enableComparisonView && (
        <CheckIcon
          className={classnames('runs-list-card__checked', {
            'runs-list-card__checked--active': active,
            'runs-list-card__checked--comparing': enableComparisonView,
          })}
        />
      )}
      <div>
        <div className="runs-list-card__title">
          {typeof title === 'string' ? title : humanReadableTime}
        </div>
        <div className="runs-list-card__id">{id}</div>
        <div className="runs-list-card__timestamp">{humanReadableTime}</div>
      </div>
      {bookmark ? (
        <BookmarkIcon
          className={'runs-list-card__bookmark runs-list-card__bookmark--solid'}
        />
      ) : (
        <BookmarkStrokeIcon
          className={
            'runs-list-card__bookmark runs-list-card__bookmark--stroke'
          }
        />
      )}
    </div>
  );
};

export default RunsListCard;