/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text, StatusBar} from 'react-native';

import HighscoreButton from './src/Components/HighscoreButton';
import Highscore from './src/Components/Highscore';
import GameBoard from './src/Components/GameBoard';

const App = () => {
  const [showHighscore, setShowHighscore] = useState(false);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#faa916" />
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.header}>
          <View style={styles.row}>
            <Text style={styles.logoPlaceholder}>CM</Text>
            <Text style={styles.title}>Colour Memory</Text>
            <HighscoreButton setShowHighscore={setShowHighscore} />
          </View>
        </View>
        <View style={styles.gameContainer}>
          {showHighscore ? (
            <Highscore />
          ) : (
            <GameBoard setShowHighscore={setShowHighscore} />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  header: {
    height: 50,
    backgroundColor: '#faa916',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoPlaceholder: {
    textAlign: 'center',
    width: 36,
    height: 36,
    marginLeft: 16,
    paddingTop: 8,
    borderRadius: 60,
    fontWeight: 'bold',
    backgroundColor: '#fefefe',
    color: '#faa916',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fefefe',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
});

export default App;
