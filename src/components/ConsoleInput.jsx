import bindAll from 'lodash-es/bindAll';
import isNil from 'lodash-es/isNil';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import get from 'lodash-es/get';
import preventClickthrough from 'react-prevent-clickthrough';

import {EditorLocation} from '../records';
import {
  createAceEditor,
  createAceSessionWithoutWorker,
  inheritFontStylesFromParentElement,
} from '../util/ace';

export default class ConsoleInput extends Component {
  constructor() {
    super();
    bindAll(this, '_ref');
  }

  componentDidUpdate({
    isTextSizeLarge: prevIsTextSizeLarge,
    currentInputValue: prevCurrentInputValue,
  }) {
    const {
      isTextSizeLarge,
      requestedFocusedLine,
      currentInputValue,
    } = this.props;

    if (isTextSizeLarge !== prevIsTextSizeLarge) {
      requestAnimationFrame(() => {
        inheritFontStylesFromParentElement(this._editor);
      });
    }

    this._focusRequestedLine(requestedFocusedLine);

    if (currentInputValue !== prevCurrentInputValue) {
      this._editor.setValue(currentInputValue);
      this._editor.clearSelection();
    }
  }

  _focusRequestedLine(requestedFocusedLine) {
    if (get(requestedFocusedLine, 'component') !== 'console') {
      return;
    }

    this._editor.navigateLineEnd();
    this._editor.focus();
    this.props.onRequestedLineFocused();
  }

  _ref(containerElement) {
    const {
      onChange,
      onInput,
      onNavigateConsoleHistory,
    } = this.props;

    if (containerElement) {
      const editor = this._editor = createAceEditor(containerElement);
      const session = createAceSessionWithoutWorker('javascript');
      editor.setSession(session);
      editor.renderer.setShowGutter(false);
      editor.moveCursorTo(0, 0);
      editor.setOptions({
        highlightActiveLine: false,
        maxLines: 1,
        minLines: 1,
      });
      editor.resize();
      editor.focus();

      editor.commands.addCommand({
        name: 'historyPrevious',
        bindKey: 'Up',
        exec: () => {
          onNavigateConsoleHistory('UP');
        },
      });

      editor.commands.addCommand({
        name: 'historyNext',
        bindKey: 'Down',
        exec: () => {
          onNavigateConsoleHistory('DOWN');
        },
      });

      session.on('change', ({action, lines}) => {
        if (action === 'insert' && lines.length === 2) {
          onInput(editor.getValue().replace('\n', ''));
        } else {
          onChange(editor.getValue());
        }
      });
    } else if (!isNil(this._editor)) {
      this._editor.destroy();
    }
  }

  render() {
    return (
      <div
        className="console__row console__input"
        onClick={preventClickthrough}
      >
        <div className="console__chevron console__chevron_blue">&#xf054;</div>
        <div className="console__editor" ref={this._ref} />
      </div>
    );
  }
}

ConsoleInput.propTypes = {
  currentInputValue: PropTypes.string.isRequired,
  isTextSizeLarge: PropTypes.bool,
  requestedFocusedLine: PropTypes.instanceOf(EditorLocation),
  onChange: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  onNavigateConsoleHistory: PropTypes.func.isRequired,
  onRequestedLineFocused: PropTypes.func.isRequired,
};

ConsoleInput.defaultProps = {
  requestedFocusedLine: null,
  isTextSizeLarge: false,
};
