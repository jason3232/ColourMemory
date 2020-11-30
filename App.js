/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Text,
  StatusBar,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
const numOfCards = 16; // Must be multiply of baseCards.length

/**
 * Generate an game card array for the game by duplicating the base card array
 * @param {int} size times the base card array to be duplicated
 */
const generateCardArray = (size) => {
  return baseCards.reduce((res, current) => {
    return res.concat(Array(size).fill(current));
  }, []);
};

/**
 * Shuffle and return the original shuffled array
 * @param {Array} arr the array to be shuffled
 */
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

const GameCard = ({
  index,
  color,
  cards,
  flippedCards,
  onFlippedCards,
  miss,
  freeze,
}) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (!cards[index].matched) {
        setFlipped(false);
      }
    }, 1000);
  }, [cards, index]);

  useEffect(() => {
    setTimeout(() => {
      if (miss.length && miss.indexOf(index) > -1) {
        console.log(`Unflipped Card#${index}`);
        setFlipped(false);
      }
    }, 1000);
  }, [miss, index]);

  const handleCardFlip = () => {
    if (!freeze) {
      console.log(`Pressed Card#${index}`);
      if (
        !cards[index].matched &&
        flippedCards.length < 2 &&
        flippedCards.indexOf(index) === -1
      ) {
        setFlipped(!flipped);
        onFlippedCards((current) => {
          return [...current, index];
        });
      }
    }
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

const GameBoard = (props) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, onFlippedCards] = useState([]);
  const [miss, setMiss] = useState([]);
  const [freeze, setFreeze] = useState(false);
  const [score, changeScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState('Unnamed');

  useEffect(() => {
    const cardsArr = generateCardArray(numOfCards / baseCards.length);
    shuffleArray(cardsArr);
    setCards(cardsArr);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let allMatched = false;
    if (cards.length) {
      console.log(`Cards: ${JSON.stringify(cards)}`);
      allMatched = !cards.some((card) => !card.matched);
      console.log(`allMatched? ${allMatched}`);
    }
    if (allMatched) {
      console.log(`You won, score ${score}`);
      setModalVisible(true);
    }
  }, [cards, score]);

  useEffect(() => {
    console.log(`Current score: ${score}`);
  }, [score]);

  useEffect(() => {
    console.log(`Currently flipped ${flippedCards.length} cards`);
  }, [flippedCards]);

  if (flippedCards.length === 2) {
    setFreeze(true);
    setTimeout(() => {
      setFreeze(false);
    }, 1000);
    console.log('Flipped 2 cards');
    console.log(flippedCards);
    const match = cards[flippedCards[0]].color === cards[flippedCards[1]].color;
    console.log(`Match? ${match}`);
    if (match) {
      setCards(
        cards.map((card, i) => {
          return i === flippedCards[0] || i === flippedCards[1]
            ? {...card, matched: true}
            : card;
        }),
      );
      changeScore((current) => current + 5);
    } else {
      changeScore((current) => current - 1);
      setMiss([...flippedCards]);
    }
    onFlippedCards([]);
  }

  return loading ? (
    <View style={styles.loading}>
      <Text style={styles.loadingText}>Loading</Text>
    </View>
  ) : (
    <View style={styles.flexContainer}>
      <Modal animationType="slide" visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalText}>Congratulation!</Text>
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
                try {
                  const data = await AsyncStorage.getItem('highscores');
                  let savedScores = [];
                  if (data) {
                    savedScores = JSON.parse(data);
                  }
                  savedScores.push({
                    name: playerName,
                    score: score,
                  });
                  savedScores.sort((a, b) => {
                    return b.score - a.score;
                  });
                  savedScores = savedScores.slice(0, 10);
                  console.log('saving data', savedScores);
                  await AsyncStorage.setItem(
                    'highscores',
                    JSON.stringify(savedScores),
                  );
                } catch (e) {
                  console.error(
                    'An error occured when trying to save the highscore',
                    e,
                  );
                }
                const newCards = generateCardArray(
                  numOfCards / baseCards.length,
                );
                setMiss(newCards);
                shuffleArray(newCards);
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                }, 1000);
                setCards(newCards);
                changeScore(0);
                setModalVisible(false);
                props.setShowHighscore((state) => !state);
                console.log('====================GAME END====================');
              }}>
              <Text style={styles.modalButtonText}>Ok</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      <View style={styles.gameContainer}>
        <View style={styles.gameBoard}>
          {cards.map((card, i) => (
            <GameCard
              key={i}
              index={i}
              color={card.color}
              cards={cards}
              flippedCards={flippedCards}
              onFlippedCards={onFlippedCards}
              miss={miss}
              freeze={freeze}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const HighScoreButton = (props) => {
  const handleShowHighscore = () => {
    console.log('Toggling Highscore');
    props.setShowHighscore((state) => !state);
  };
  return (
    <TouchableOpacity
      style={styles.highScoreButton}
      onPress={handleShowHighscore}>
      <Text style={styles.highScoreButtonText}>HS</Text>
    </TouchableOpacity>
  );
};

const Highscore = ({showHighscore}) => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const updateLeaderboard = async () => {
      const data = await AsyncStorage.getItem('highscores');
      const savedRecords = JSON.parse(data);
      setLeaderboard(savedRecords);
    };
    updateLeaderboard();
  }, []);

  useEffect(() => {
    console.log('Updated Leaderboard', leaderboard);
  }, [leaderboard]);

  leaderboard && leaderboard.length;

  return (
    <View style={styles.flexContainer}>
      <View style={styles.leaderboardHeader}>
        <Text style={styles.leaderboardRank}>Rank</Text>
        <Text style={styles.leaderboardText}>Name</Text>
        <Text style={styles.leaderboardScore}>Score</Text>
      </View>
      {leaderboard && leaderboard.length ? (
        leaderboard.map((highscore, i) => (
          <View key={i} style={styles.leaderboardEntry}>
            <Text style={styles.leaderboardRank}>{i + 1}</Text>
            <Text style={styles.leaderboardText}>{highscore.name}</Text>
            <Text style={styles.leaderboardScore}>{highscore.score}</Text>
          </View>
        ))
      ) : (
        <View style={styles.leaderboardEntry}>
          <Text style={styles.leaderboardText}>There are no records yet</Text>
        </View>
      )}
    </View>
  );
};

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
            <HighScoreButton setShowHighscore={setShowHighscore} />
          </View>
        </View>
        <View style={styles.gameContainer}>
          {showHighscore ? (
            <Highscore showHighscore={showHighscore} />
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
  gameContainer: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
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
  leaderboard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#bbb',
  },
  leaderboardHeader: {
    height: 50,
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardEntry: {
    flex: 1,
    maxHeight: '10%',
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardText: {
    flex: 2,
    fontSize: 16,
    textAlign: 'center',
  },
  leaderboardRank: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  leaderboardScore: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;
