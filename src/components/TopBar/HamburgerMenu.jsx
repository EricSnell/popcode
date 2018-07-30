import {t} from 'i18next';
import tap from 'lodash-es/tap';
import PropTypes from 'prop-types';
import React from 'react';

import config from '../../config';

import createMenu, {MenuItem} from './createMenu';
import HamburgerMenuButton from './HamburgerMenuButton';

const HamburgerMenu = createMenu({
  menuClass: 'top-bar__menu_right',
  name: 'hamburger',

  renderItems({
    hasInstructions,
    isEditingInstructions,
    isUserAuthenticated,
    onStartEditingInstructions,
    onStartGithubLogIn,
  }) {
    return tap([], (items) => {
      items.push(
        <MenuItem
          isDisabled={isEditingInstructions}
          key="addOrEditInstructions"
          onClick={onStartEditingInstructions}
        >
          {
            hasInstructions ?
              t('top-bar.edit-instructions') :
              t('top-bar.add-instructions')
          }
        </MenuItem>,
      );

      if (!isUserAuthenticated) {
        items.push(
          <MenuItem
            onClick={onStartGithubLogIn}
          >
            {
              t('top-bar.session.log-in-github')
            }
          </MenuItem>,
        );
      }

      items.push(
        <a
          className="top-bar__menu-item"
          href={config.feedbackUrl}
          key="feedback"
          rel="noopener noreferrer"
          target="blank"
        >
          {t('top-bar.send-feedback')}
        </a>,
      );

      items.push(
        <div
          className="top-bar__menu-item top-bar__menu-item_icons"
          key="social"
        >
          <a
            className="u__icon top-bar__menu-item-icon"
            href="https://github.com/popcodeorg/popcode"
            rel="noopener noreferrer"
            target="_blank"
          >&#xf09b;</a>
          <a
            className="u__icon top-bar__menu-item-icon"
            href="https://twitter.com/popcodeorg"
            rel="noopener noreferrer"
            target="_blank"
          >&#xf099;</a>
          <a
            className="u__icon top-bar__menu-item-icon"
            href="https://slack.popcode.org/"
            rel="noopener noreferrer"
            target="_blank"
          >&#xf198;</a>
        </div>,
      );
    });
  },
})(HamburgerMenuButton);


HamburgerMenu.propTypes = {
  hasInstructions: PropTypes.bool.isRequired,
  isEditingInstructions: PropTypes.bool.isRequired,
  isUserAuthenticated: PropTypes.bool.isRequired,
  onStartEditingInstructions: PropTypes.func.isRequired,
  onStartGithubLogIn: PropTypes.func.isRequired,
};

export default HamburgerMenu;
