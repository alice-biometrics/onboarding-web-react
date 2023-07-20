import "aliceonboarding/dist/aliceonboarding.css";

import {
  DocumentType,
  OnboardingCommands,
  OnboardingConfig,
  TrialAuthenticator,
} from "aliceonboarding";

import React from "react";
import { Redirect } from "react-router";

class KYC extends React.Component {
  state = {
    externalData: null,
  };

  onboardingCommands = null;

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

  async initOnboardingCommands(threadUserToken, commandsSelector) {
    if (!this.onboardingCommands) {
      console.log("Init onboarding commands");
      const config = new OnboardingConfig().withTheme(
        "corporate",
        "minimal",
        "circle",
        {
          alice_color_primary: "#5c88da",
          alice_color_accent: "black",
          alice_color_secondary: "#666",
          alice_color_background: "white",
          alice_color_check: "#3db387",
          alice_color_feedback: "#3db387",
          alice_font_family: "Museo Sans, system-ui, -apple-ui, sans-serif;",
          alice_title_font_family:
            "Museo Sans, system-ui, -apple-ui, sans-serif;",
          alice_modal_title_font_size: "17px",
          alice_modal_title_font_size_desktop: "20px",
          alice_button_font_size: "13px",
          alice_button_font_size_desktop: "14px",
          alice_button_font_color: "#ffffff",
          alice_button_border_radius: "8px",
          alice_button_height: "36px",
        }
      );

      this.onboardingCommands = await OnboardingCommands.makeOnboardingCommands(
        commandsSelector,
        threadUserToken,
        config
      );
      console.log("Commands initialized");
    }
    this.onboardingCommands.createDocument(
      DocumentType.IDCARD,
      "ESP",
      (result) => {
        console.log(result.document_id);
        this.onboardingCommands.addDocument(
          () => {
            console.log("Document side uploaded");
            this.startKYC();
          },
          (error) => {
            console.error(error);
          },
          (cancel) => {
            console.error(cancel);
          },
          result.document_id,
          DocumentType.IDCARD,
          "ESP",
          "front"
        );
      },
      (error) => {
        console.error(error);
      },
      (cancel) => {
        console.error(cancel);
      }
    );
  }

  startKYC() {
    console.log("Start KYC");
    const trialToken = process.env.REACT_APP_TRIAL_TOKEN;
    const userEmail = `${Math.random().toString(36).substring(7)}@host.com`;
    let authenticator = new TrialAuthenticator(trialToken, {
      email: userEmail,
    });
    authenticator
      .execute()
      .then((userToken) => {
        console.log("Authentication was successful");
        this.initOnboardingCommands(userToken, "alice");
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
