import React, { Component } from 'react';
import { Text, FlatList, ScrollView } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';

const mapStateToProps = state => ({
  leaders: state.leaders
});

// this render About screen
class About extends Component {
  //Header title
  static navigationOptions = {
    title: 'About Us'
  };

  render() {
    const about =
      'Started in 2010, Ristorante con Fusion quickly established itself as a culinary' +
      'icon par excellence in Hong Kong. With its unique brand of world fusion cuisine' +
      ' that can be found nowhere else, it enjoys patronage from the A-list clientele in ' +
      'Hong Kong.  Featuring four of the best three-star Michelin chefs in the world, ' +
      'you never know what will arrive on your plate the next time you visit us.' +
      '\n\n The restaurant traces its humble beginnings to The Frying Pan, a successful' +
      " chain started by our CEO, Mr. Peter Pan, that featured for the first time the world's" +
      ' best cuisines in a pan.';

    // this will render list of leaders
    const renderLeadersItems = ({ item, index }) => (
      <ListItem
        key={index}
        title={item.name}
        subtitle={item.description}
        leftAvatar={{ source: { uri: baseUrl + item.image } }}
      />
    );

    if (this.props.leaders.isLoading) {
      return (
        <ScrollView>
          {about}
          <Card title="Corporate Leadership">
            <Loading />
          </Card>
        </ScrollView>
      );
    } else if (this.props.leaders.errMess) {
      return (
        <ScrollView>
          <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
            {about}
            <Card title="Corporate Leadership">
              <Text>{this.props.leaders.errMess}</Text>
            </Card>
          </Animatable.View>
        </ScrollView>
      );
    }
    return (
      <ScrollView>
        <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
          <Card title="Our History">
            <Text>{about}</Text>
          </Card>

          <Card title="Corporate Leadership">
            <FlatList
              data={this.props.leaders.leaders}
              renderItem={renderLeadersItems}
              keyExtractor={item => item.id.toString()}
            />
          </Card>
        </Animatable.View>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps)(About);