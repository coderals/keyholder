import React from "react";
import {
  CardItem,
  Text,
  Form,
  Toast,
  Button,
  Accordion,
  Container
} from "native-base";
import { connect } from "react-redux";
import {
  updatePasswordItemListArrOnStoreAction,
  setMasterKeyAction,
  updateLanguageAction
} from "../store/actions/PasswordItemAction";
import { encrypt, decrypt } from "../components/Encryption";
import { withNavigation } from "react-navigation";
import KeyHolderHeader from "../components/KeyHolderHeader";
import { translate } from "../language/TranslateService";
import PasswordInput from "../components/inputs/PasswordInput";
import LanguageContentPage from "./LanguageContentPage";

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validation: {
        currentMasterKeyValidation: false,
        newMasterKeyValidation: false,
        confirmNewMasterKeyValidation: false
      },
      masterInfo: {
        currentMasterKey: "",
        newMasterKey: "",
        confirmNewMasterKey: ""
      },
      secureTextCurrentMasterKey: true,
      secureTextNewMasterKey: true,
      secureTextConfirmNewMasterKey: true,
      trRadio: false,
      enRadio: true
    };
    this.onCurrentMasterKeyChange = this.onCurrentMasterKeyChange.bind(this);
    this.onNewMasterKeyValidationChange = this.onNewMasterKeyValidationChange.bind(
      this
    );
    this.onConfirmNewMasterKeyValidationChange = this.onConfirmNewMasterKeyValidationChange.bind(
      this
    );
    this.changePasswordPage = this.changePasswordPage.bind(this);
    this.duration = 3000;
  }

  toggleShowCurrentMasterKey() {
    this.setState({
      secureTextCurrentMasterKey: !this.state.secureTextCurrentMasterKey
    });
  }

  toggleShowNewMasterKey() {
    this.setState({
      secureTextNewMasterKey: !this.state.secureTextNewMasterKey
    });
  }

  toggleShowConfirmNewMasterKey() {
    this.setState({
      secureTextConfirmNewMasterKey: !this.state.secureTextConfirmNewMasterKey
    });
  }

  setCurrentMasterKeyValidationState = () => {
    if (this.state.masterInfo.currentMasterKey == "") {
      this.setState(prevState => ({
        validation: {
          ...prevState.validation,
          currentMasterKeyValidation: true
        }
      }));
    } else {
      this.setState(prevState => ({
        validation: {
          ...prevState.validation,
          currentMasterKeyValidation: false
        }
      }));
    }
  };

  setNewMasterKeyValidationState = () => {
    if (this.state.masterInfo.newMasterKey == "") {
      this.setState(prevState => ({
        validation: {
          ...prevState.validation,
          newMasterKeyValidation: true
        }
      }));
    } else {
      this.setState(prevState => ({
        validation: {
          ...prevState.validation,
          newMasterKeyValidation: false
        }
      }));
    }
  };

  setConfirmNewMasterKeyValidationState = () => {
    if (this.state.masterInfo.confirmNewMasterKey == "") {
      this.setState(prevState => ({
        validation: {
          ...prevState.validation,
          confirmNewMasterKeyValidation: true
        }
      }));
    } else {
      this.setState(prevState => ({
        validation: {
          ...prevState.validation,
          confirmNewMasterKeyValidation: false
        }
      }));
    }
  };

  currentMasterKeyOnBlur = () => {
    this.setCurrentMasterKeyValidationState();
  };

  newMasterKeyOnBlur = () => {
    this.setNewMasterKeyValidationState();
  };

  confirmNewMasterKeyOnBlur = () => {
    this.setConfirmNewMasterKeyValidationState();
  };

  onCurrentMasterKeyChange(value) {
    this.setState(
      prevState => ({
        masterInfo: {
          ...prevState.masterInfo,
          currentMasterKey: value
        }
      }),
      this.setCurrentMasterKeyValidationState
    );
  }

  onNewMasterKeyValidationChange(value) {
    this.setState(
      prevState => ({
        masterInfo: {
          ...prevState.masterInfo,
          newMasterKey: value
        }
      }),
      this.setNewMasterKeyValidationState
    );
  }

  onConfirmNewMasterKeyValidationChange(value) {
    this.setState(
      prevState => ({
        masterInfo: {
          ...prevState.masterInfo,
          confirmNewMasterKey: value
        }
      }),
      this.setConfirmNewMasterKeyValidationState
    );
  }

  validateAndSave = async () => {
    this.setCurrentMasterKeyValidationState();
    this.setNewMasterKeyValidationState();
    this.setConfirmNewMasterKeyValidationState();
  };

  savePassword = () => {
    this.validateAndSave().then(() => {
      if (!(this.state.masterInfo.currentMasterKey == this.props.masterKey)) {
        Toast.show({
          text: translate("settings.passwordError"),
          buttonText: translate("settings.toastButton"),
          duration: this.duration
        });
        return;
      }
      if (
        !(
          this.state.masterInfo.newMasterKey ==
          this.state.masterInfo.confirmNewMasterKey
        )
      ) {
        Toast.show({
          text: translate("settings.confirmError"),
          buttonText: translate("settings.toastButton"),
          duration: this.duration
        });
        return;
      }

      if (
        this.state.validation.currentMasterKeyValidation ||
        this.state.validation.newMasterKeyValidation ||
        this.state.validation.confirmNewMasterKeyValidation
      ) {
        Toast.show({
          text: translate("settings.validationError"),
          buttonText: translate("settings.toastButton"),
          duration: this.duration
        });
        return;
      }
      this.updateAllPasswordItemWithNewMasterKey();
      Toast.show({
        text: translate("settings.successMessage"),
        buttonText: translate("settings.toastButton"),
        duration: this.duration
      });
      this.props.navigation.navigate(translate("pages.home"));
    });
  };

  updateAllPasswordItemWithNewMasterKey = () => {
    let _passwordItems = [...this.props.passwordItems];
    _passwordItems.map(element => {
      let decryptedPassword = decrypt(element.password, this.props.masterKey);
      let encryptedPassword = encrypt(
        decryptedPassword,
        this.state.masterInfo.newMasterKey
      );
      element.password = encryptedPassword;
    });
    this.props.updatePasswordItemListArrOnStore(_passwordItems);
    this.props.setMasterKey(this.state.masterInfo.newMasterKey);
  };

  onPressedEnglishRadio = () => {
    this.setState({
      enRadio: true,
      trRadio: false
    });
  };
  onPressedTurkishRadio = () => {
    this.setState({
      trRadio: true,
      enRadio: false
    });
  };

  saveLanguage = () => {
    this.props.updateLanguage(this.state.enRadio ? "en" : "tr");
    Toast.show({
      text: translate("settings.successMessage"),
      buttonText: translate("settings.toastButton"),
      duration: this.duration
    });
  };

  returnLanguageContentPage = () => {
    return (
      <LanguageContentPage
        onPressedEnglishRadio={this.onPressedEnglishRadio}
        enRadio={this.state.enRadio}
        onPressedTurkishRadio={this.onPressedTurkishRadio}
        trRadio={this.state.trRadio}
        buttonStyle={{ justifyContent: "center" }}
        saveLanguage={this.saveLanguage}
        buttonText={translate("settings.saveButton")}
      />
    );
  };

  changePasswordPage() {
    return (
      <Form>
        <PasswordInput
          itemErrorFlag={this.state.validation.currentMasterKeyValidation}
          inputPlaceholder={translate("settings.current")}
          inputValue={this.state.masterInfo.currentMasterKey}
          inputOnChangeText={this.onCurrentMasterKeyChange}
          inputOnBlur={this.currentMasterKeyOnBlur}
          inputSecureTextEntry={this.state.secureTextCurrentMasterKey}
          buttonTransparent={true}
          buttonTogglePassword={this.toggleShowCurrentMasterKey.bind(this)}
          iconEyeFlag={this.state.secureTextCurrentMasterKey}
        />
        <PasswordInput
          itemErrorFlag={this.state.validation.newMasterKeyValidation}
          inputPlaceholder={translate("settings.new")}
          inputValue={this.state.masterInfo.newMasterKey}
          inputOnChangeText={this.onNewMasterKeyValidationChange}
          inputOnBlur={this.newMasterKeyOnBlur}
          inputSecureTextEntry={this.state.secureTextNewMasterKey}
          buttonTransparent={true}
          buttonTogglePassword={this.toggleShowNewMasterKey.bind(this)}
          iconEyeFlag={this.state.secureTextNewMasterKey}
        />
        <PasswordInput
          itemErrorFlag={this.state.validation.confirmNewMasterKeyValidation}
          inputPlaceholder={translate("settings.confirm")}
          inputValue={this.state.masterInfo.confirmNewMasterKey}
          inputOnChangeText={this.onConfirmNewMasterKeyValidationChange}
          inputOnBlur={this.confirmNewMasterKeyOnBlur}
          inputSecureTextEntry={this.state.secureTextConfirmNewMasterKey}
          buttonTransparent={true}
          buttonTogglePassword={this.toggleShowConfirmNewMasterKey.bind(this)}
          iconEyeFlag={this.state.secureTextConfirmNewMasterKey}
        />
        <Button
          style={{ justifyContent: "center", marginTop : 5 }}
          onPress={this.savePassword}
        >
          <Text>{translate("settings.saveButton")}</Text>
        </Button>
      </Form>
    );
  }

  render() {
    return (
      <Container>
        <KeyHolderHeader headerTitle={translate("settings.header")} />
        <CardItem>
          <Accordion
            dataArray={[{ title: translate("password.changeMasterKeyHeader") }]}
            animation={true}
            expanded={true}
            renderContent={this.changePasswordPage}
          />
        </CardItem>
        <CardItem>
          <Accordion
            dataArray={[{ title: translate("password.changeLanguageHeader") }]}
            animation={true}
            expanded={true}
            renderContent={this.returnLanguageContentPage}
          />
        </CardItem>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    passwordItems: state.PasswordItemReducer.PasswordItems,
    masterKey: state.PasswordItemReducer.masterKey
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updatePasswordItemListArrOnStore: data =>
      dispatch(updatePasswordItemListArrOnStoreAction(data)),
    setMasterKey: data => dispatch(setMasterKeyAction(data)),
    updateLanguage: data => dispatch(updateLanguageAction(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(SettingsPage));