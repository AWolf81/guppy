// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import { getSelectedProject } from '../../reducers/projects.reducer';
import { COLORS } from '../../constants';
import { loadDependencyInfoFromDisk } from '../../actions';

import MainContentWrapper from '../MainContentWrapper';
import Heading from '../Heading';
import PixelShifter from '../PixelShifter';
import Spacer from '../Spacer';
import Button from '../Button';
import DevelopmentServerPane from '../DevelopmentServerPane';
import TaskRunnerPane from '../TaskRunnerPane';
import DependencyManagementPane from '../DependencyManagementPane';

import type { Project } from '../../types';

const launchEditor = window.require('react-dev-utils/launchEditor');
const { shell } = window.require('electron');

type Props = {
  project: Project,
  loadDependencyInfoFromDisk: (projectId: string, projectPath: string) => any,
  location: any, // provided by react-router
  match: any, // provided by react-router
  history: any, // provided by withRouter HOC
};

class ProjectPage extends Component<Props> {
  openIDE = () => {
    const { path } = this.props.project;
    launchEditor(path, 1, 1);
  };

  openFolder = () => {
    const { path } = this.props.project;
    // Show a folder in the file manager
    // shell.showItemInFolder(path); // shows parent directory
    shell.openItem(path);
  };

  componentDidMount() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    this.loadNewProjectOrBail(this.props.project);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      !this.props.project ||
      !nextProps.project ||
      this.props.project.id !== nextProps.project.id
    ) {
      this.loadNewProjectOrBail(nextProps.project);
    }
  }

  loadNewProjectOrBail(project: Project) {
    const { history, loadDependencyInfoFromDisk } = this.props;

    if (project) {
      loadDependencyInfoFromDisk(project.id, project.path);
    } else {
      // If the selected project was not successfully resolved, that means
      // it must have been deleted. We should redirect the user to the main
      // screen.
      history.push('/');
    }
  }

  render() {
    const { project } = this.props;

    if (!project) {
      return null;
    }

    return (
      <FadeIn>
        <MainContentWrapper>
          <PixelShifter x={-2}>
            <Heading size="xlarge" style={{ color: COLORS.purple[500] }}>
              {project.name}
            </Heading>
          </PixelShifter>
          <ProjectActionBar>
            <ActionButton onClick={this.openFolder} size="small">
              Open in explorer
            </ActionButton>
            <ActionButton onClick={this.openIDE} size="small">
              Open IDE
            </ActionButton>
          </ProjectActionBar>
          <Spacer size={30} />
          <DevelopmentServerPane leftSideWidth={300} />

          <Spacer size={30} />
          <TaskRunnerPane leftSideWidth={200} />

          {project.dependencies.length > 0 && (
            <Fragment>
              <Spacer size={30} />
              <DependencyManagementPane />
            </Fragment>
          )}

          <Spacer size={60} />
        </MainContentWrapper>
      </FadeIn>
    );
  }
}

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectActionBar = styled.div``;

const ActionButton = styled(Button)`
  margin-right: 0.5em;
`;

const fadeIn = keyframes`
  from { opacity: 0.5 }
  to { opacity: 1 }
`;

const FadeIn = styled.div`
  animation: ${fadeIn} 400ms;
`;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

export default withRouter(
  connect(
    mapStateToProps,
    { loadDependencyInfoFromDisk }
  )(ProjectPage)
);
