import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import pot from './assets/pot.png'
import * as Progress from 'react-native-progress'
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { useFonts } from 'expo-font';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from "firebase/database";
import config from "./config";
export default function App() {
  initializeApp(config);
  const [soilHumidity, setSoilHumidity] = useState();
  const [temperature, setTemperature] = useState();
  const [humidity, setHumidity] = useState();
  const [illuminance, setIlluminance] = useState();
  const [exp, setExp] = useState();
  const [progress, setProgress] = useState(NaN);
  const [lv,setLv]=useState();
  const database = getDatabase();
  const soilHumidityRef = ref(database, 'soilHumidity');
  const temperatureRef = ref(database, 'temperature');
  const humidityRef = ref(database, 'humidity');
  const illuminanceRef = ref(database, 'illuminance');
  const expRef = ref(database, 'exp');
  useEffect(() => {
    onValue(soilHumidityRef, (snapshot) => {
      const data = snapshot.val();
      setSoilHumidity((1023-data)/1023*100);
    })
    onValue(temperatureRef, (snapshot) => {
      const data = snapshot.val();
      setTemperature(data);
    })
    onValue(humidityRef, (snapshot) => {
      const data = snapshot.val();
      setHumidity(data);
    })
    onValue(illuminanceRef, (snapshot) => {
      const data = snapshot.val();
      setIlluminance(Math.ceil((1023-data)/1023*100));
    })
    onValue(expRef, (snapshot) => {
      const data = snapshot.val();
      setExp(data);
      setLv(Math.floor(data/1023));
    })
  })
  const [loaded] = useFonts({
    welcomeBold: require('./assets/fonts/welcomeBold.ttf'),
    welcomeRegular: require('./assets/fonts/welcomeRegular.ttf')
  });
  useEffect(()=>{
    setProgress(((exp-(lv*1023))/1023).toFixed(2));
  })
  if (!loaded || progress=="NaN") return null;
  return (
    <View style={styles.container}>
      <View style={styles.case1}>
        <TouchableOpacity activeOpacity={0.5}>
          <View style={styles.lvWrap2}>
            <Text style={styles.lv}>Lv.{lv}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5}>
          <View style={styles.lvWrap1}>
            <Text style={styles.lv}>개나리자스민</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity activeOpacity={0.5}>
        <View style={styles.case2}>
          <Text style={styles.fontStyleOg, styles.textStatus}>식물이 건강하게{"\n"}자라고 있어요👍🏻</Text>
          <Image source={pot} style={styles.potImg} />
          <Progress.Bar progress={progress} width={200} />
          <Text style={styles.fontStyleOg}>{progress*100}%</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.case3} />
      <View style={styles.potDataWrapWrap}>
        <TouchableOpacity activeOpacity={0.5}>
          <View style={styles.potDataWrap}>
            <Text style={styles.fontStyle}>🪴{soilHumidity}%</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5}>
          <View style={styles.potDataWrap}>
            <Text style={styles.fontStyle}>🔥{temperature}°C</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5}>
          <View style={styles.potDataWrap}>
            <Text style={styles.fontStyle}>💧{humidity}%</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5}>
          <View style={styles.potDataWrap}>
            <Text style={styles.fontStyle}>☀️{illuminance}%</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textStatus: {
    marginBottom: 50,
    fontFamily: 'welcomeRegular',
    fontSize: 25,
  },
  potDataWrapWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 5,
    marginBottom: 80,
  },
  potDataWrap: {
    width: 80,
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    marginLeft: 5,
    marginRight: 5,
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  fontStyle: {
    fontFamily: 'welcomeBold',
    fontSize: 20,
  },
  fontStyleOg: {
    fontFamily: 'welcomeBold',
    marginTop: 10,
    fontSize: 20,
  },
  case1: {
    marginBottom: 5,
    flexDirection: 'row',
    right:100,
  },
  lvWrap1: {
    marginTop: 65,
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    marginLeft:20,
  },
  lvWrap2: {
    marginTop: 65,
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    marginLeft:30,
  },
  lv: {
    fontSize: 25,
    fontFamily: 'welcomeBold',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  case2: {
    width: 340,
    height: 550,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  case3: {
    marginTop: 50,
  },
  potImg: {
    width: '40%',
    height: '40%',
    marginRight: 10,
    marginBottom: 20,
  }
})