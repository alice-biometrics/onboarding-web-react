import React from 'react'
import {
    Onboarding,
    OnboardingConfig,
    DocumentType,
    TrialAuthenticator,
    SelfieStageConfig,
    SelfieCapturerType,
  } from "aliceonboarding";
  import "aliceonboarding/dist/aliceonboarding.css";
  import { Redirect } from "react-router";

class KYCForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { documentType: "", showForm: true };

    this.handleIdCardChange = this.handleIdCardChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleIdCardChange(event) {
    console.log("Event", event);
    this.setState({ documentType: event.target.value });
  }

  handleSubmit(event) {
    this.startKYC();
    event.preventDefault();
    this.setState({ showForm: false });
  }

  restartAliceKYC() {
    this.props.history.push("/");
    return <Redirect to="/" push={true} />;
  }

  onCancel() {
    console.log("onCancel");
    this.restartAliceKYC();
  }

  onSuccess(userInfo) {
    console.log("onSuccess: " + userInfo);
    this.restartAliceKYC();
  }

  onFailure(error) {
    console.log("onFailure: " + error);
    this.restartAliceKYC();
  }

  startKYC() {
    const trialToken = process.env.REACT_APP_TRIAL_TOKEN;
    const userEmail = `${Math.random().toString(36).substring(7)}@host.com`;
    let authenticator = new TrialAuthenticator(trialToken, {
      email: userEmail,
    });
    authenticator
      .execute()
      .then((userToken) => {
        console.log("Authentication was successful");
        let config = new OnboardingConfig()
          .withUserToken(userToken)
          .withAddSelfieStage(
            new SelfieStageConfig(SelfieCapturerType.CAMERA, true)
          );
        if (this.state.documentType === "idcard") {
          config = config.withAddDocumentStage(DocumentType.IDCARD);
        }
        if (this.state.documentType === "driver-license") {
          config = config.withAddDocumentStage(DocumentType.DRIVERLICENSE);
        }
        new Onboarding("alice", config).run(
          this.onSuccess.bind(this),
          this.onFailure.bind(this),
          this.onCancel.bind(this)
        );
      })
      .catch((error) => {
        console.log("Error on authentication: " + error);
      });
  }

  render() {
    const container = {
      paddingTop: "5rem",
    };
    return (
      <div style={container}>
        {this.state.showForm ? (
          <form onSubmit={this.handleSubmit}>
            <label>
              Id card
              <input
                type="radio"
                name="documen-type"
                value="idcard"
                onChange={this.handleIdCardChange}
              />
            </label>
            <label>
              Driver license
              <input
                type="radio"
                name="documen-type"
                value="driver-license"
                onChange={this.handleIdCardChange}
              />
            </label>
            <div>
              <input type="submit" value="Submit" />
            </div>
          </form>
        ) : (
          <div id="alice"></div>
        )}
      </div>
    );
  }
}



export default KYCForm