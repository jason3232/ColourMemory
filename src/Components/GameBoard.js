import React, {useEffect, useState} from 'react';
import {
  TouchableHighlight,
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GameCard from './GameCard';

const baseCards = [
  {
    color: 'red',
    matched: false,
  },
  {
    color: 'green',
    matched: false,
  },
  {
    color: 'blue',
    matched: false,
  },
  {
    color: 'yellow',
    matched: false,
  },
];

/**
 * Generate an game card array for the game by duplicating the base card array
 * @param {int} size times the base card array to be duplicated
 */
const generateCardArray = (size) => {
  const cards = baseCards.reduce((res, current) => {
    return res.concat(Array(size).fill(current));
  }, []);
  shuffleArray(cards);
  return cards;
};

/**
 * Shuffle and modify the original shuffled array
 * @param {Array} arr the array to be shuffled
 */
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

/**
 * Save player name and score to AsyncStorage records
 * @param {*} name the name of the player
 * @param {*} score the score
 */
const saveScore = async (name, score) => {
  try {
    let savedScores = [];
    const data = await AsyncStorage.getItem('highscores');
    if (data) {
      savedScores = JSON.parse(data);
    }
    savedScores.push({
      name: name,
      score: score,
    });
    savedScores.sort((a, b) => {
      return b.score - a.score;
    });
    savedScores = savedScores.slice(0, 10);
    console.log('saving data', savedScores);
    await AsyncStorage.setItem('highscores', JSON.stringify(savedScores));
  } catch (e) {
    console.error('An error occured when trying to save the highscore', e);
  }
};

const GameBoard = (props) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [freeze, setFreeze] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('Unnamed');

  useEffect(() => {
    console.log('Game Started');
    resetGame();
  }, []);

  useEffect(() => {
    let allMatched = false;
    if (cards.length) {
      allMatched = !cards.some((card) => !card.matched);
      console.log(`allMatched? ${allMatched}`);
    }
    if (allMatched) {
      setModalVisible(true);
    }
  }, [cards]);

  useEffect(() => {
    console.log(`Current score: ${score}`);
  }, [score]);

  useEffect(() => {
    if (flippedCards.length === 2 && !freeze) {
      console.log(`Flipped ${flippedCards.length} cards`);
      console.log('flippedCards: ', flippedCards);
      toggleInput();
      const match =
        cards[flippedCards[0]].color === cards[flippedCards[1]].color;
      console.log(`Match? ${match}`);
      if (match) {
        setCards(
          cards.map((card, i) => {
            return i === flippedCards[0] || i === flippedCards[1]
              ? {...card, matched: true}
              : card;
          }),
        );
        setScore((current) => current + 5);
      } else {
        setScore((current) => current - 1);
      }
      setTimeout(() => {
        setFlippedCards([]);
        toggleInput();
      }, 1000);
    }
  }, [flippedCards, cards, freeze]);

  const resetGame = () => {
    console.log('Game Reset');
    setLoading(true);
    setFlippedCards([]);
    setCards(generateCardArray(4));
    setScore(0);
    setModalVisible(false);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const toggleInput = () => {
    setFreeze((state) => !state);
  };

  const isCardFlipped = (index) => {
    return cards[index].matched || flippedCards.indexOf(index) > -1;
  };

  const flipCard = (index) => {
    if (
      !freeze &&
      !cards[index].matched &&
      flippedCards.length < 2 &&
      flippedCards.indexOf(index) === -1
    ) {
      console.log(`Flipping Card#${index}`);
      setFlippedCards((curr) => {
        return [...curr, index];
      });
    }
  };

  return loading ? (
    <View style={styles.loading}>
      <Text style={styles.loadingText}>Loading</Text>
    </View>
  ) : (
    <View style={styles.flexContainer}>
      <Modal animationType="slide" visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalText}>Congratulations!</Text>
            <Text style={styles.modalText}>Your Score: {score}</Text>
            <TextInput
              style={styles.highscoreInput}
              placeholder="Enter your name"
              onChangeText={(text) => setPlayerName(text)}
            />
            <TouchableHighlight
              style={styles.modalButton}
              activeOpacity={0.8}
              underlayColor="#ccc"
              onPress={async () => {
                await saveScore(playerName, score);
                props.setShowHighscore((state) => !state);
              }}>
              <Text style={styles.modalButtonText}>Ok</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      <View style={styles.flexContainer}>
        <View style={styles.gameBoard}>
          {cards.map((card, i) => (
            <GameCard
              key={i}
              index={i}
              color={card.color}
              flipped={isCardFlipped(i)}
              flipCard={flipCard}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  gameBoard: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    margin: 4,
  },
  modalContainer: {
    padding: 24,
    overflow: 'hidden',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    marginTop: '50%',
    backgroundColor: '#fefefe',
    borderRadius: 16,
    padding: 16,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  highscoreInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 8,
    marginBottom: 8,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
});

export default GameBoard;
