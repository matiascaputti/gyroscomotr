import Exponent, { Gyroscope } from 'exponent';
import React from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';


class App extends React.Component {
  state = {
    gyroscopeData: { x: 0, y: 0, z: 0 },
    gyroscopeSolution: {
      x: Math.floor((Math.random() * 100) + 1),
      y: Math.floor((Math.random() * 100) + 1),
      z: Math.floor((Math.random() * 100) + 1)
    },
    threshold: 10,
    reachX: false,
    reachY: false,
    reachZ: false,
    win: false,
    time: 0
  }

  _restart = () => {
    this.setState({
      gyroscopeData: { x: 0, y: 0, z: 0 },
      gyroscopeSolution: {
        x: Math.floor((Math.random() * 100) + 1),
        y: Math.floor((Math.random() * 100) + 1),
        z: Math.floor((Math.random() * 100) + 1)
      },
      reachX: false,
      reachY: false,
      reachZ: false,
      win: false,
      time: 0
    })
  }

  _incrementSeconds = () => {
    const { win, time } = this.state

    if (!win) {
      this.setState({time: time + 1})
    }
  }

  _toggle = () => {
    if (!this._subscription) {
      setInterval(this._incrementSeconds, 1000);

      Gyroscope.setUpdateInterval(300);
      this._subscription = Gyroscope.addListener((result) => {
        let {x, y, z} = result
        let reachX = false
        let reachY = false
        let reachZ = false
        let reachWin = false
        const { gyroscopeSolution, threshold, win } = this.state

        const newX = win ? this.state.gyroscopeData.x : this.state.gyroscopeData.x + parseInt(x*5)
        const newY = win ? this.state.gyroscopeData.y : this.state.gyroscopeData.y + parseInt(y*5)
        const newZ = win ? this.state.gyroscopeData.z : this.state.gyroscopeData.z + parseInt(z*5)

        const newData = {
          x: newX,
          y: newY,
          z: newZ
        }

        if (newData.x >= gyroscopeSolution.x - threshold && newData.x <= gyroscopeSolution.x + threshold) {
          reachX = true
        }

        if (newData.y > gyroscopeSolution.y - threshold && newData.y <= gyroscopeSolution.y + threshold) {
          reachY = true
        }

        if (newData.z > gyroscopeSolution.z - threshold && newData.z <= gyroscopeSolution.z + threshold) {
          reachZ = true
        }

        if (reachX && reachY && reachZ) {
          reachWin = true
        }

        this.setState({
          gyroscopeData: newData,
          reachX,
          reachY,
          reachZ,
          win: reachWin
        });
      });
    }
  }

  render() {
    this._toggle()
    let { gyroscopeData, gyroscopeSolution, win, time } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Gyroscomotr</Text>
          <Text style={styles.subtitle}>Move your device to reach following position:</Text>
          <Text style={styles.info}>
            { win ?
              `You win in ${time} seconds ✅`  :
              `X: ${gyroscopeSolution.x} | Y: ${gyroscopeSolution.y} | Z: ${gyroscopeSolution.z}`
            }
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: 'https://developer.apple.com/library/prerelease/content/documentation/EventHandling/Conceptual/EventHandlingiPhoneOS/Art/gyro_rotation_2x.png'}}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.text, {backgroundColor: this.state.reachX ? '#2ecc71' : '#34495e'}]}>
            X: {gyroscopeData.x}
          </Text>
          <Text style={[styles.text, {backgroundColor: this.state.reachY ? '#3498db' : '#34495e'}]}>
            Y: {gyroscopeData.y}
          </Text>
          <Text style={[styles.text, {backgroundColor: this.state.reachZ ? '#e74c3c' : '#34495e'}]}>
            Z: {gyroscopeData.z}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text
            onPress={this._restart}
            style={styles.reload}
          >
            {'Restart game'.toUpperCase()}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'stretch',
  },
  header: {
    alignItems: 'center',
    marginTop: 20
  },
  title: {
    color: '#2c3e50',
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 5
  },
  subtitle: {
    textAlign: 'center',
    color: '#34495e',
    fontSize: 18,
    fontStyle: 'italic'
  },
  info: {
    color: '#FFF',
    backgroundColor: '#34495e',
    borderRadius: 5,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
    padding: 10
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20
  },
  image: {
    width: 215,
    height: 250,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30
  },
  text: {
    color: '#FFF',
    backgroundColor: '#e74c3c',
    borderRadius: 15,
    fontSize: 18,
    fontWeight: '600',
    padding: 20
  },
  footer: {
    backgroundColor: '#95a5a6'
  },
  reload: {
    padding: 20,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500'
  }
});

Exponent.registerRootComponent(App);
