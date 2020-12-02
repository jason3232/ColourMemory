import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

const GameCard = ({index, color, flipped, flipCard}) => {
  const handleCardFlip = () => {
    flipCard(index);
  };
  return (
    <View style={styles.cardCell}>
      <TouchableOpacity
        style={flipped ? [styles.card, {backgroundColor: color}] : styles.card}
        onPress={handleCardFlip}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardCell: {
    width: '25%',
    height: '25%',
    backgroundColor: '#fefefe',
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    backgroundColor: '#cccccc',
    margin: 4,
  },
});

export default GameCard;
