import React from "react";
import ReactDOM from "react-dom";
import {
  Onboarding,
  OnboardingConfig,
  DocumentType,
  SandboxAuthenticator,
  SelfieStageConfig,
  SelfieCapturerType,
} from "aliceonboarding";
import "aliceonboarding/dist/aliceonboarding.css";

class KYC extends React.Component {
  state = {
    externalData: null,
  };

  restartAliceKYC() {
    const element = <div id="alice"></div>;
    ReactDOM.render(element, document.getElementById("root"));
    this.startKYC();
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
    const sandboxToken = process.env.REACT_APP_SANDBOX_TOKEN;
    const userEmail = `${Math.random().toString(36).substring(7)}@host.com`;
    let authenticator = new SandboxAuthenticator(sandboxToken, {
      email: userEmail,
    });
    authenticator.execute().then((userToken) => {
      console.log("Authentication was successful");
      let config = new OnboardingConfig()
        .withUserToken(userToken)
        .withAddSelfieStage(new SelfieStageConfig(SelfieCapturerType.CAMERA, true))
        .withAddDocumentStage(DocumentType.IDCARD)
      new Onboarding("alice", config).run(
        this.onSuccess.bind(this),
        this.onFailure.bind(this),
        this.onCancel.bind(this)
      );
    }).catch(error=>{
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
    return (
      <div id="root">
        <div id="alice"></div>
      </div>
    );
  }
}
export default KYC;
