import React, { Component } from 'react';
import { ListItem, Left, Right, Text, Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
import { StyleSheet, Dimensions } from "react-native";


class PasswordItem extends Component {
    render() {
      console.log("PasswordItem render started")
      console.log("PasswordItem this.props.key : "+ this.props._key)
      console.log("PasswordItem this.props.passworditem : "+ JSON.stringify(this.props.passworditem))
        return (
            <ListItem
              key = {this.props._key}
              button
              onPress = {() => {
                this.props.navigation.navigate('PasswordPage', {
                  passworditem: this.props.passworditem
                })
              }}
            >
              <Left>
                <Text>{this.props.passworditem.name}</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
        );
    }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  standalone: {
    marginTop: 30,
    marginBottom: 30
  },
  standaloneRowFront: {
    alignItems: "center",
    backgroundColor: "#CCC",
    justifyContent: "center",
    height: 50
  },
  standaloneRowBack: {
    alignItems: "center",
    backgroundColor: "#8BC645",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15
  },
  backTextWhite: {
    color: "#FFF"
  },
  rowFront: {
    alignItems: "center",
    backgroundColor: "#CCC",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 50
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75
  },
  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 75
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0
  },
  controls: {
    alignItems: "center",
    marginBottom: 30
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5
  },
  switch: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 10,
    width: Dimensions.get("window").width / 4
  },
  trash: {
    height: 25,
    width: 25
  }
});

export default withNavigation(PasswordItem);
