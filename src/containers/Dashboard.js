import {connect} from 'react-redux';
import {Dashboard} from '../components';
import {
  createProject,
  exportGist,
  exportRepo,
} from '../actions';
import {
  getCurrentProject,
  getCurrentUser,
  isDashboardOpen,
  isExperimental,
  isGistExportInProgress,
} from '../selectors';

function mapStateToProps(state) {
  return {
    currentProject: getCurrentProject(state),
    currentUser: getCurrentUser(state),
    gistExportInProgress: isGistExportInProgress(state),
    isExperimental: isExperimental(state),
    isOpen: isDashboardOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onExportGist() {
      dispatch(exportGist());
    },

    onExportRepo() {
      dispatch(exportRepo());
    },

    onNewProject() {
      dispatch(createProject());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
