import React, { Component } from 'react';
import { Text, View, StyleSheet, Picker, Switch, Button, Modal, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Input, Rating } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { Permissions, Notifications, Calendar } from 'expo';

class Reservation extends Component {
  static navigationOptions = {
    title: 'Reserve Table'
  };

  constructor(props) {
    super(props);

    this.state = {
      guests: 1,
      smoking: false,
      date: '',
      showModal: false
    };
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleReservation() {
    console.log(JSON.stringify(this.state));
    this.toggleModal();
  }

  async addEventToCalender(date) {
    const calenderPermission = await Permissions.askAsync(Permissions.CALENDAR);

    if (calenderPermission.status === 'granted') {
      console.log(date);

      Calendar.createEventAsync(Calendar.DEFAULT, {
        title: 'Restuarnt Event',
        startDate: new Date(Date.parse(date)),
        endDate: new Date(Date.parse(date) + 7200000),
        location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong',
        timeZone: 'Asia/Hong_Kong'
      })
        .then(event => {
          console.log('success', event);
        })
        .catch(error => {
          console.log('failure', error);
        });
    }
  }

  resetForm() {
    this.setState({
      guests: 1,
      smoking: false,
      date: '',
      showModal: false
    });
  }

  async obtainNotificationPermission() {
    let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
    if (permission.status !== 'granted') {
      permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
      if (permission.status !== 'granted') {
        Alert.alert('Permission not granted to show notifications');
      }
    }
    return permission;
  }

  async presentLocalNotification(date) {
    await this.obtainNotificationPermission();
    Notifications.presentLocalNotificationAsync({
      title: 'Your Reservation',
      body: `Reservation for ${date} requested`,
      ios: {
        sound: true
      },
      android: {
        sound: true,
        vibrate: true,
        color: '#512DA8'
      }
    });
  }

  render() {
    return (
      <Animatable.View animation="zoomInUp" duration={3000}>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Number of Guests</Text>
          <Picker
            style={styles.formItem}
            selectedValue={this.state.guests}
            onValueChange={(itemValue, itemIndex) => this.setState({ guests: itemValue })}
          >
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="6" value="6" />
          </Picker>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
          <Switch
            style={styles.formItem}
            value={this.state.smoking}
            onTintColor="#512DA8"
            onValueChange={value => this.setState({ smoking: value })}
          />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Date and Time</Text>
          <DatePicker
            style={{ flex: 2, marginRight: 20 }}
            date={this.state.date}
            format=""
            mode="datetime"
            placeholder="select date and Time"
            minDate="2017-01-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
            }}
            onDateChange={date => {
              this.setState({ date });
            }}
          />
        </View>
        <View style={styles.buttonStyle}>
          <Button
            onPress={() =>
              Alert.alert(
                'Your Reservation OK?',
                `Number of Guests ${this.state.guests} \n Somking? ${
                  this.state.smoking
                } \n Date and Time ${this.state.date}`,
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => this.resetForm()
                  },
                  {
                    text: 'Ok',
                    onPress: () => {
                      this.presentLocalNotification(this.state.date);
                      this.addEventToCalender(this.state.date);
                      this.resetForm();
                    }
                  }
                ],
                {
                  cancelable: false
                }
              )
            }
            title="Reserve"
            color="#512DA8"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        {/* <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => this.toggleModal()}
          onRequestClose={() => this.toggleModal()}
        >
          <Text style={styles.modalTitle}>Your Reservation</Text>
          <Text style={styles.modalText}>Number of Guests: {this.state.guests}</Text>
          <Text style={styles.modalText}>Smoking?: {this.state.smoking ? 'Yes' : 'No'}</Text>
          <Text style={styles.modalText}>Date and Time: {this.state.date}</Text>

          <View style={styles.buttonStyle}>
            <Button
              onPress={() => this.handleReservation()}
              title="Submit"
              color="#512DA8"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
          <View style={styles.buttonStyle}>
            <Button
              onPress={() => {
                this.toggleModal();
                this.resetForm();
              }}
              color="#512DA8"
              title="Cancel"
            />
          </View>
        </Modal> */}
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 20
  },
  formLabel: {
    fontSize: 18,
    flex: 2
  },
  formItem: {
    flex: 1
  },
  modal: {
    justifyContent: 'center',
    margin: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#512DA8',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20
  },
  modalText: {
    fontSize: 18,
    margin: 10
  },
  buttonStyle: {
    backgroundColor: '#512DA8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  passwordContainer: {
    flexDirection: 'row',
    borderColor: '#000',
    padding: 10
  },
  inputStyle: {
    flex: 1,
    paddingBottom: 5,
    paddingLeft: 5
  }
});

export default Reservation;
