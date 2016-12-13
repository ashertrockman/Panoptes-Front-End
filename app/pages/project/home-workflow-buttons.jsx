import React from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import ProjectHomeWorkflowButton from './home-workflow-button';

counterpart.registerTranslations('en', {
  buttons: {
    learnMore: 'Learn more',
    getStarted: 'Get started'
  },
  workflow: {
    choice: 'Please choose a workflow'
  }
});

export default class ProjectHomeWorkflowButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showWorkflows: false
    };

    this.shouldWorkflowBeDisabled = this.shouldWorkflowBeDisabled.bind(this);
    this.renderRedirectLink = this.renderRedirectLink.bind(this);
    this.renderWorkflowButtons = this.renderWorkflowButtons.bind(this);
    this.toggleWorkflows = this.toggleWorkflows.bind(this);
  }

  shouldWorkflowBeDisabled(workflow) {
    if (this.context.user && workflow.configuration.level && this.props.preferences) {
      const currentWorkflowAtLevel = this.props.activeWorkflows.filter((activeWorkflow) => {
        return (activeWorkflow.id === this.props.preferences.settings.workflow_id) ? activeWorkflow : null;
      });
      const currentLevel = (currentWorkflowAtLevel.length > 0) ? currentWorkflowAtLevel[0].configuration.level : 1;

      return (workflow.configuration.level > currentLevel);
    }

    return false;
  }

  toggleWorkflows() {
    this.setState({ showWorkflows: !this.state.showWorkflows });
  }

  renderRedirectLink() {
    return (<a href={this.props.project.redirect} className="call-to-action standard-button">
      <strong>Visit the project</strong><br />
      <small>at {this.props.project.redirect}</small>
    </a>);
  }

  renderWorkflowButtons() {
    let workflowDescription;

    if (this.props.project.workflow_description && this.props.project.workflow_description !== '') {
      workflowDescription = (
        <h4>{this.props.project.workflow_description}</h4>
      );
    } else {
      workflowDescription = <Translate component="h4" content="workflow.choice" />;
    }

    if (this.props.activeWorkflows.length > 0 && this.props.preferences) {
      return (
        <div className="project-home-page__section top-arrow">
          <div className="project-home-page__content">
            {workflowDescription}
            {this.props.activeWorkflows.map((workflow) => {
              return (
                <ProjectHomeWorkflowButton
                  key={workflow.id}
                  disabled={this.shouldWorkflowBeDisabled(workflow)}
                  onChangePreferences={this.props.onChangePreferences}
                  project={this.props.project}
                  workflow={workflow}
                  workflowAssignment={this.props.workflowAssignment}
                />);
            })
          }</div>
        </div>);
    }

    return (<span>Loading...</span>);
  }

  render() {
    let getStarted = (
      <Link
        to={`/projects/${this.props.project.slug}/classify`}
        className="call-to-action standard-button get-started"
      >
        <Translate content="buttons.getStarted" />
      </Link>
    );

    const learnMore = (
      <Link to={`/projects/${this.props.project.slug}/about`} className="standard-button learn-more">
        <Translate content="buttons.learnMore" />
      </Link>
    );

    if (this.props.project.redirect) {
      return this.renderRedirectLink();
    }

    if (this.props.showWorkflowButtons) {
      getStarted = (
        <button className="call-to-action standard-button get-started" onClick={this.toggleWorkflows}>
          <Translate content="buttons.getStarted" />
        </button>
      );
    }

    return (
      <div>
        <div className="project-home-page__content">
          {learnMore}
          {getStarted}
        </div>

        {this.state.showWorkflows && (
          this.renderWorkflowButtons()
        )}
      </div>
    );
  }
}

ProjectHomeWorkflowButtons.contextTypes = {
  geordi: React.PropTypes.object,
  user: React.PropTypes.object
};

ProjectHomeWorkflowButtons.defaultProps = {
  activeWorkflows: [],
  onChangePreferences: () => {},
  preferences: {},
  project: {},
  showWorkflowButtons: false,
  splits: {},
  workflowAssignment: false
};

ProjectHomeWorkflowButtons.propTypes = {
  activeWorkflows: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onChangePreferences: React.PropTypes.func.isRequired,
  preferences: React.PropTypes.shape({
    preferences: React.PropTypes.object,
    settings: React.PropTypes.objectOf(React.PropTypes.string)
  }),
  project: React.PropTypes.shape({
    redirect: React.PropTypes.string,
    slug: React.PropTypes.string,
    workflow_description: React.PropTypes.string
  }).isRequired,
  showWorkflowButtons: React.PropTypes.bool.isRequired,
  splits: React.PropTypes.object,
  workflowAssignment: React.PropTypes.bool
};
