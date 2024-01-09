import "aliceonboarding/dist/aliceonboarding.css";

import {
  DocumentType,
  Onboarding,
  OnboardingConfig,
  SelfieStageConfig,
  TrialAuthenticator,
} from "aliceonboarding";

import React from "react";
import { Redirect } from "react-router";

class KYC extends React.Component {
  state = {
    externalData: null,
  };

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
    let authenticator = new TrialAuthenticator({
      sandboxToken: trialToken,
      userInfo: {
        email: userEmail,
      },
      environment: "sandbox",
    });
    authenticator
      .execute()
      .then((userToken) => {
        console.log("Authentication was successful");
        let config = new OnboardingConfig()
          .withUserToken(userToken)
          .withAddSelfieStage({ selfieStageConfig: new SelfieStageConfig({}) })
          .withAddDocumentStage({ documentType: DocumentType.IDCARD });
        new Onboarding({ idSelector: "alice", onboardingConfig: config }).run(
          this.onSuccess.bind(this),
          this.onFailure.bind(this),
          this.onCancel.bind(this)
        );
      })
      .catch((error) => {
        console.log("Error on authentication: " + error);
      });
  }

  componentDidMount() {
    this.startKYC();
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    const container = {
      paddingTop: "5rem",
    };
    return (
      <div style={container}>
        <div id="root">
          <div id="alice"></div>
        </div>
      </div>
    );
  }
}
export default KYC;
