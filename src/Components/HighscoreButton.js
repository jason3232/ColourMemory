import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const HighscoreButton = ({setShowHighscore}) => {
  const handleShowHighscore = () => {
    console.log('Toggling Highscore');
    setShowHighscore((state) => !state);
  };
  return (
    <TouchableOpacity
      style={styles.highScoreButton}
      onPress={handleShowHighscore}>
      <Text style={styles.highScoreButtonText}>HS</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  highScoreButton: {
    width: 36,
    height: 36,
    marginRight: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  highScoreButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fefefe',
  },
});

export default HighscoreButton;
