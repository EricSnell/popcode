import React from 'react';
import classnames from 'classnames';

function LibraryPickerItem(props) {
  return (
    <div
      className={classnames('dashboard__menu-item',
        {'dashboard__menu-item_active': props.enabled},
        {'dashboard__menu-item_checked': props.enabled},
        {'dashboard__menu-item_unchecked': !props.enabled}
      )} onClick={props.onLibraryToggled}
    >
      {props.library.name}
    </div>
  );
}

LibraryPickerItem.propTypes = {
  enabled: React.PropTypes.bool.isRequired,
  library: React.PropTypes.object.isRequired,
  onLibraryToggled: React.PropTypes.func.isRequired,
};

export default LibraryPickerItem;
