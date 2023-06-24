import React, { PureComponent } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import { registerFeedback } from './main.cjs';

let FULL_HEIGHT = Dimensions.get('window').height;
let PAN = new Animated.ValueXY({ x: 0, y: FULL_HEIGHT });
let panResponder;

export default class Component extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      level: 0,
      text: "",
      screen: 0,
      panelHeight: 0
    }
    panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        PAN.setValue({
          x: 0,
          y: gestureState.dy > 0 ? gestureState.dy : 0,
        });
        if (gestureState.dy > this.state.panelHeight) {
          registerFeedback(this.state.level, this.state.text);
          this.props.close();
        }
      },
      onPanResponderRelease: () => {
        PAN.flattenOffset();
        Animated.spring(PAN, {
          toValue: { x: 0, y: 0 },
          tension: 80,
          friction: 25,
          useNativeDriver: true,
          restDisplacementThreshold: 10,
          restSpeedThreshold: 10,
        }).start();
      }
    });
  }

  orientationChange = () => {
    FULL_HEIGHT = Dimensions.get('window').height;
    PAN = new Animated.ValueXY({ x: 0, y: FULL_HEIGHT });
  };

  componentDidMount = () => {
    if (this.props.show) {
      Animated.spring(PAN, {
        toValue: { x: 0, y: 0 },
        tension: 80,
        friction: 25,
        useNativeDriver: true,
        restDisplacementThreshold: 10,
        restSpeedThreshold: 10,
      }).start();
    }
    Dimensions.addEventListener('change', this.orientationChange);
  };

  componentDidUpdate() {
    if (this.props.show) {
      Animated.spring(PAN, {
        toValue: { x: 0, y: 0 },
        tension: 80,
        friction: 25,
        useNativeDriver: true,
        restDisplacementThreshold: 10,
        restSpeedThreshold: 10,
      }).start();
    }
  };

  closePanel = () => {
    Animated.spring(PAN, {
      toValue: { x: 0, y: FULL_HEIGHT },
      tension: 80,
      friction: 25,
      useNativeDriver: true,
      restDisplacementThreshold: 10,
      restSpeedThreshold: 10,
    }).start(({ finished }) => {
      if (finished) {
        registerFeedback(this.state.level, this.state.text);
        this.props.close(false);
      }
    });
  };

  render() {
    return this.props.show ? (
      <Animated.View
        style={[styles.panel, { backgroundColor: this.props.panelBackgroundColor ? this.props.panelBackgroundColor : 'white', shadowColor: this.props.panelShadowColor ? this.props.panelShadowColor : '#000000' }]}
        {...panResponder.panHandlers}
        onLayout={(event) => this.setState({ panelHeight: event.nativeEvent.layout.height })}
      >
        <View style={styles.barContainer}>
          <View style={[styles.bar, { backgroundColor: this.props.panelBarColor ? this.props.panelBarColor : '#e2e2e2' }]} />
        </View>
        <ScrollView
          onTouchStart={() => {
            return false;
          }}
          onTouchEnd={() => {
            return false;
          }}
          contentContainerStyle={{ width: '100%' }}>
          {
            this.state.screen == 0 ?
              <View style={styles.panelContent}>
                <Text style={[styles.textCenter, { color: 'black', fontWeight: '700', fontSize: 36 }]}>
                  Como está sua experiência até agora?
                </Text>
                <Text style={[styles.textCenter, { color: 'gray', fontWeight: '400', fontSize: 18 }]}>
                  Adoraríamos saber!
                </Text>
                <View style={styles.contentHorizontal}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => { this.setState({ level: 1, screen: 1 }) }}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={require('./emojis/confounded-face.png')}
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => { this.setState({ level: 2, screen: 1 }) }}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={require('./emojis/unamused-face.png')}
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => { this.setState({ level: 3, screen: 1 }) }}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={require('./emojis/neutral-face.png')}
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => { this.setState({ level: 4, screen: 1 }) }}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={require('./emojis/happy-face.png')}
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => { this.setState({ level: 5, screen: 1 }) }}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={require('./emojis/smiling-face-with-heart-eyes.png')}
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              :
              null
          }
          {
            this.state.screen == 1 ?
              <View style={styles.panelContent}>
                <Image
                  source={require('./emojis/party-popper.png')}
                  style={styles.imageCenter}
                />
                <Text style={[styles.textCenter, { color: 'black', fontWeight: '700', fontSize: 36 }]}>
                  Obrigado pelo seu feedback!
                </Text>
                <Text style={[styles.textCenter, { color: 'gray', fontWeight: '400', fontSize: 18 }]}>
                  Gostaria de deixar uma mensagem para nos dizer como podemos melhorar?
                </Text>
                <TouchableOpacity
                  style={{
                    marginVertical: 12,
                    marginHorizontal: 24,
                    backgroundColor: "#1B59F8",
                    padding: 15,
                    width: '100%',
                    borderRadius: 15
                  }}
                  onPress={() => { this.setState({ screen: 2 }) }}
                  activeOpacity={0.7}>
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 18, textAlign: 'center' }}>Claro!</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginHorizontal: 24,
                    marginTop: 12,
                    marginBottom: 24
                  }}
                  onPress={this.closePanel}
                  activeOpacity={0.7}>
                  <Text style={{ color: 'gray', fontWeight: '400', fontSize: 18 }}>Não tenho nada a dizer</Text>
                </TouchableOpacity>
              </View>
              :
              null
          }
          {
            this.state.screen == 2 ?
              <View style={styles.panelContent}>
                <Text style={[styles.textCenter, { color: 'black', fontWeight: '700', fontSize: 30 }]}>
                  Poderia nos dizer como podemos melhorar:
                </Text>
                <TextInput
                  style={{ borderWidth: 1, textAlignVertical: 'top', color: 'black', height: 200, width: '100%', borderRadius: 5 }}
                  onChangeText={(text) => this.setState({ text: text })}
                  value={this.state.text}
                  numberOfLines={4}
                  multiline={true}
                  selectionColor="black"
                />
                <TouchableOpacity
                  style={{
                    marginVertical: 12,
                    marginHorizontal: 24,
                    backgroundColor: "#1B59F8",
                    padding: 15,
                    width: '100%',
                    borderRadius: 15
                  }}
                  onPress={this.closePanel}
                  activeOpacity={0.7}>
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 18, textAlign: 'center' }}>Enviar</Text>
                </TouchableOpacity>
              </View>
              :
              null
          }
        </ScrollView>
      </Animated.View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    maxHeight: FULL_HEIGHT / 2,
    width: '100%',
    transform: PAN.getTranslateTransform(),
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    zIndex: 2
  },
  panelContent: {
    width: '100%',
    paddingHorizontal: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  barContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    width: '10%',
    height: 5,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  textCenter: {
    marginVertical: 12,
    marginHorizontal: 24,
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center'
  },
  contentHorizontal: {
    marginRight: -15,
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  imageCenter: {
    marginVertical: 12,
    marginHorizontal: 24,
    width: '100%',
    borderRadius: 50,
    height: 64,
    width: 64,
    flex: 1
  },
  button: {
    alignItems: 'center',
    backgroundColor: "#DDDDDD",
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
    marginBottom: 15,
    flexBasis: 64,
    flexGrow: 1
  },
  buttonImage: {
    width: '100%',
    borderRadius: 50,
    height: 48,
    width: 48,
    flex: 1
  }
});